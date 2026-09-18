import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

import authRoutes from "./routes/auth";
import aiRoutes from "./routes/ai";
import projectsRoutes from "./routes/projects";
import templatesRoutes from "./routes/templates";
import mediaRoutes from "./routes/media";
import analyticsRoutes from "./routes/analytics";
import publicRoutes from "./routes/public";
import { getProjectsByUser, createProject, getUserById } from "./lib/db";
import { PREBUILT_TEMPLATES } from "./lib/templates";

import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = config.port;
const CLIENT_URL = config.clientUrl;

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible font/asset loading for user landing pages
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration supporting cookies and headers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-side rewrites)
      if (!origin) return callback(null, true);
      // Reflect requesting origin to allow Vercel previews and production client URL
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AI Landing Page Builder API",
    customDomainRouting: true,
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/templates", templatesRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/public", publicRoutes);

// Global Error Handler
app.use(errorHandler);

// Seed demo project if none exists for instant review
async function seedDemoData() {
  try {
    const demoUser = await getUserById("demo-user-1");
    if (demoUser) {
      const existing = await getProjectsByUser("demo-user-1");
      if (existing.length === 0 && PREBUILT_TEMPLATES.length > 0) {
        const sample = PREBUILT_TEMPLATES[0];
        await createProject({
          id: "proj-demo-1",
          userId: "demo-user-1",
          name: "CloudScale AI Platform",
          slug: "cloudscale-ai",
          isPublished: true,
          publishedAt: new Date().toISOString(),
          status: "published",
          websiteData: sample.websiteData,
          templateId: sample.id,
          analytics: {
            totalViews: 384,
            uniqueVisitors: 215,
            devices: { desktop: 240, mobile: 110, tablet: 34 },
            referrers: { "Twitter / X": 140, Direct: 95, Google: 85, LinkedIn: 64 },
            dailyViews: [
              { date: "2025-09-10", views: 45, visitors: 28 },
              { date: "2025-09-11", views: 62, visitors: 39 },
              { date: "2025-09-12", views: 58, visitors: 34 },
              { date: "2025-09-13", views: 74, visitors: 48 },
              { date: "2025-09-14", views: 85, visitors: 51 },
              { date: "2025-09-15", views: 60, visitors: 35 },
            ],
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log("🌱 Demo project seeded successfully!");
      }
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}

app.listen(PORT, async () => {
  console.log(`
🚀 ─────────────────────────────────────────────────────────────
   AI Landing Page Builder Server running on port ${PORT}
   API URL: http://localhost:${PORT}/api
   Frontend: ${CLIENT_URL}
────────────────────────────────────────────────────────────────
`);
  await seedDemoData();
});

export default app;
