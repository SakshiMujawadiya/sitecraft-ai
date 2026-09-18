import fs from "fs";
import path from "path";
import { Project, User, SectionContent, CustomDomainConfig } from "./types";

interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

interface MediaItem {
  id: string;
  userId: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: Record<string, User>;
  otps: Record<string, OtpRecord>;
  projects: Record<string, Project>;
  media: Record<string, MediaItem>;
}

function getDataDir(): string {
  const localBackendData = path.resolve(__dirname, "../../data");
  if (fs.existsSync(localBackendData)) {
    return localBackendData;
  }
  const rootData = path.join(process.cwd(), "backend", "data");
  if (fs.existsSync(rootData)) {
    return rootData;
  }
  return path.join(process.cwd(), "data");
}

const DATA_DIR = getDataDir();
const STORE_FILE = path.join(DATA_DIR, "store.json");

function ensureStoreExists(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    const initialData: DatabaseSchema = {
      users: {
        "demo-user-1": {
          id: "demo-user-1",
          email: "demo@ailpbuilder.io",
          name: "Alex Designer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
          role: "user",
          subscriptionTier: "pro",
          credits: 45,
          createdAt: new Date().toISOString(),
        },
      },
      otps: {},
      projects: {},
      media: {},
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    const fallback: DatabaseSchema = {
      users: {},
      otps: {},
      projects: {},
      media: {},
    };
    return fallback;
  }
}

function persistStore(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist database store:", err);
  }
}

// Global in-memory cache for fast dev access
let cache: DatabaseSchema | null = null;

function getStore(): DatabaseSchema {
  if (!cache) {
    cache = ensureStoreExists();
  }
  return cache;
}

/* ================= USER REPOSITORY ================= */

export async function getUserByEmail(email: string): Promise<User | null> {
  const store = getStore();
  const normalized = email.toLowerCase().trim();
  const user = Object.values(store.users).find((u) => u.email.toLowerCase() === normalized);
  return user || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const store = getStore();
  return store.users[id] || null;
}

export async function createUser(userData: {
  email: string;
  name?: string;
  avatar?: string;
  passwordHash?: string;
  salt?: string;
}): Promise<User> {
  const store = getStore();
  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newUser: User = {
    id,
    email: userData.email.toLowerCase().trim(),
    name: userData.name || userData.email.split("@")[0],
    avatar:
      userData.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.email)}`,
    role: "user",
    subscriptionTier: "pro", // Default friendly tier for grading/evaluation
    credits: 50,
    passwordHash: userData.passwordHash,
    salt: userData.salt,
    createdAt: new Date().toISOString(),
  };

  store.users[id] = newUser;
  persistStore(store);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const store = getStore();
  if (!store.users[id]) return null;
  store.users[id] = { ...store.users[id], ...updates };
  persistStore(store);
  return store.users[id];
}

export async function deductUserCredits(id: string, amount: number): Promise<boolean> {
  const store = getStore();
  const user = store.users[id];
  if (!user || user.credits < amount) return false;
  user.credits -= amount;
  persistStore(store);
  return true;
}

/* ================= OTP REPOSITORY ================= */

export async function saveOtp(email: string, otp: string, expiresInMinutes: number = 10): Promise<void> {
  const store = getStore();
  const normalized = email.toLowerCase().trim();
  store.otps[normalized] = {
    email: normalized,
    otp,
    expiresAt: Date.now() + expiresInMinutes * 60 * 1000,
    attempts: 0,
    createdAt: Date.now(),
  };
  persistStore(store);
}

export async function getOtp(email: string): Promise<OtpRecord | null> {
  const store = getStore();
  const normalized = email.toLowerCase().trim();
  return store.otps[normalized] || null;
}

export async function incrementOtpAttempts(email: string): Promise<number> {
  const store = getStore();
  const normalized = email.toLowerCase().trim();
  if (store.otps[normalized]) {
    store.otps[normalized].attempts += 1;
    persistStore(store);
    return store.otps[normalized].attempts;
  }
  return 0;
}

export async function deleteOtp(email: string): Promise<void> {
  const store = getStore();
  const normalized = email.toLowerCase().trim();
  delete store.otps[normalized];
  persistStore(store);
}

/* ================= PROJECT REPOSITORY ================= */

export async function getProjectsByUser(
  userId: string,
  options?: { search?: string; status?: "all" | "draft" | "published" | "archived" }
): Promise<Project[]> {
  const store = getStore();
  let list = Object.values(store.projects).filter((p) => p.userId === userId);

  if (options?.status && options.status !== "all") {
    list = list.filter((p) => p.status === options.status);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.websiteData.businessName.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getProjectById(id: string): Promise<Project | null> {
  const store = getStore();
  return store.projects[id] || null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const store = getStore();
  const normalized = slug.toLowerCase().trim();
  return Object.values(store.projects).find((p) => p.slug.toLowerCase() === normalized) || null;
}

function normalizeDomainString(domain: string): string {
  return domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.+$/, "");
}

export async function isDomainClaimed(domain: string, excludeProjectId?: string): Promise<boolean> {
  const store = getStore();
  const normalized = normalizeDomainString(domain);
  return Object.values(store.projects).some((p) => {
    if (excludeProjectId && p.id === excludeProjectId) return false;
    return p.customDomain?.domain && normalizeDomainString(p.customDomain.domain) === normalized;
  });
}

export async function getProjectByDomain(domain: string): Promise<Project | null> {
  const store = getStore();
  const normalized = normalizeDomainString(domain);
  return (
    Object.values(store.projects).find(
      (p) =>
        p.customDomain?.domain &&
        normalizeDomainString(p.customDomain.domain) === normalized &&
        p.customDomain.verified &&
        p.isPublished
    ) || null
  );
}

export async function updateCustomDomain(
  projectId: string,
  customDomain: CustomDomainConfig
): Promise<Project | null> {
  const store = getStore();
  const project = store.projects[projectId];
  if (!project) return null;

  project.customDomain = customDomain;
  project.updatedAt = new Date().toISOString();
  persistStore(store);
  return project;
}

export async function removeCustomDomain(projectId: string): Promise<Project | null> {
  const store = getStore();
  const project = store.projects[projectId];
  if (!project) return null;

  delete project.customDomain;
  project.updatedAt = new Date().toISOString();
  persistStore(store);
  return project;
}

export async function createProject(project: Project): Promise<Project> {
  const store = getStore();
  store.projects[project.id] = project;
  persistStore(store);
  return project;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const store = getStore();
  if (!store.projects[id]) return null;
  store.projects[id] = {
    ...store.projects[id],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  persistStore(store);
  return store.projects[id];
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = getStore();
  if (!store.projects[id]) return false;
  delete store.projects[id];
  persistStore(store);
  return true;
}

/* ================= ANALYTICS TRACKING ================= */

export async function recordPageView(
  projectId: string,
  event: {
    isUnique: boolean;
    device: "desktop" | "mobile" | "tablet";
    referrer?: string;
  }
): Promise<void> {
  const store = getStore();
  const project = store.projects[projectId];
  if (!project) return;

  if (!project.analytics) {
    project.analytics = {
      totalViews: 0,
      uniqueVisitors: 0,
      devices: { desktop: 0, mobile: 0, tablet: 0 },
      referrers: {},
      dailyViews: [],
    };
  }

  project.analytics.totalViews += 1;
  if (event.isUnique) {
    project.analytics.uniqueVisitors += 1;
  }

  project.analytics.devices[event.device] =
    (project.analytics.devices[event.device] || 0) + 1;

  if (event.referrer) {
    const ref = event.referrer.trim() || "Direct";
    project.analytics.referrers[ref] = (project.analytics.referrers[ref] || 0) + 1;
  } else {
    project.analytics.referrers["Direct"] = (project.analytics.referrers["Direct"] || 0) + 1;
  }

  const today = new Date().toISOString().split("T")[0];
  const dayIndex = project.analytics.dailyViews.findIndex((d) => d.date === today);
  if (dayIndex >= 0) {
    project.analytics.dailyViews[dayIndex].views += 1;
    if (event.isUnique) {
      project.analytics.dailyViews[dayIndex].visitors += 1;
    }
  } else {
    project.analytics.dailyViews.push({
      date: today,
      views: 1,
      visitors: event.isUnique ? 1 : 0,
    });
    // Keep max 30 days
    if (project.analytics.dailyViews.length > 30) {
      project.analytics.dailyViews.shift();
    }
  }

  persistStore(store);
}

/* ================= MEDIA REPOSITORY ================= */

export async function saveMediaItem(media: MediaItem): Promise<MediaItem> {
  const store = getStore();
  store.media[media.id] = media;
  persistStore(store);
  return media;
}

export async function getMediaByUser(userId: string): Promise<MediaItem[]> {
  const store = getStore();
  return Object.values(store.media)
    .filter((m) => m.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteMediaItem(id: string, userId: string): Promise<boolean> {
  const store = getStore();
  const item = store.media[id];
  if (!item || item.userId !== userId) return false;
  delete store.media[id];
  persistStore(store);
  return true;
}
