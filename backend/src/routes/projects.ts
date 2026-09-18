import { Router, Response } from "express";
import {
  getProjectsByUser,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../lib/db";
import { Project, WebsiteData } from "../lib/types";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 1. Get all projects for current user
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { search, status } = req.query as { search?: string; status?: "all" | "draft" | "published" | "archived" };

    const projects = await getProjectsByUser(user.id, { search, status });
    res.json({ success: true, projects });
  } catch (err) {
    console.error("List projects error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
});

// 2. Create new project
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { name, websiteData, templateId } = req.body as {
      name: string;
      websiteData: WebsiteData;
      templateId?: string;
    };

    if (!name || !websiteData) {
      res.status(400).json({ success: false, message: "Project name and website data are required" });
      return;
    }

    const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const baseSlug = slugify(name || websiteData.businessName || "landing-page");
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const newProject: Project = {
      id: projectId,
      userId: user.id,
      name,
      slug,
      isPublished: false,
      status: "draft",
      websiteData,
      templateId,
      analytics: {
        totalViews: 0,
        uniqueVisitors: 0,
        devices: { desktop: 0, mobile: 0, tablet: 0 },
        referrers: {},
        dailyViews: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createProject(newProject);
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ success: false, message: "Failed to create project" });
  }
});

// 3. Get project by ID (with ownership check)
router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const project = await getProjectById(String(req.params.id));

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    if (project.userId !== user.id) {
      res.status(403).json({ success: false, message: "Access forbidden: you do not own this project" });
      return;
    }

    res.json({ success: true, project });
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ success: false, message: "Failed to load project" });
  }
});

// 4. Update project
router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const project = await getProjectById(String(req.params.id));

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    if (project.userId !== user.id) {
      res.status(403).json({ success: false, message: "Unauthorized access to project" });
      return;
    }

    const { name, websiteData, status, isPublished } = req.body;
    const updates: Partial<Project> = {};

    if (name !== undefined) updates.name = name;
    if (websiteData !== undefined) updates.websiteData = websiteData;
    if (status !== undefined) updates.status = status;
    if (isPublished !== undefined) updates.isPublished = isPublished;

    const updated = await updateProject(project.id, updates);
    res.json({ success: true, project: updated });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ success: false, message: "Failed to update project" });
  }
});

// 5. Delete project
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const project = await getProjectById(String(req.params.id));

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    if (project.userId !== user.id) {
      res.status(403).json({ success: false, message: "Unauthorized" });
      return;
    }

    await deleteProject(project.id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ success: false, message: "Failed to delete project" });
  }
});

// 6. Duplicate project
router.post("/:id/duplicate", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const source = await getProjectById(String(req.params.id));

    if (!source || source.userId !== user.id) {
      res.status(404).json({ success: false, message: "Source project not found" });
      return;
    }

    const dupId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const dupSlug = `${slugify(source.name)}-copy-${Math.random().toString(36).substring(2, 6)}`;

    const duplicated: Project = {
      ...source,
      id: dupId,
      name: `${source.name} (Copy)`,
      slug: dupSlug,
      isPublished: false,
      publishedAt: undefined,
      status: "draft",
      analytics: {
        totalViews: 0,
        uniqueVisitors: 0,
        devices: { desktop: 0, mobile: 0, tablet: 0 },
        referrers: {},
        dailyViews: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createProject(duplicated);
    res.json({ success: true, project: duplicated, message: "Project duplicated successfully" });
  } catch (err) {
    console.error("Duplicate project error:", err);
    res.status(500).json({ success: false, message: "Failed to duplicate project" });
  }
});

// 7. Publish project
router.post("/:id/publish", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const project = await getProjectById(String(req.params.id));

    if (!project || project.userId !== user.id) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const { publish } = req.body;
    const shouldPublish = publish !== undefined ? Boolean(publish) : !project.isPublished;

    const updated = await updateProject(project.id, {
      isPublished: shouldPublish,
      status: shouldPublish ? "published" : "draft",
      publishedAt: shouldPublish ? new Date().toISOString() : undefined,
    });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const publicUrl = `${clientUrl}/p/${project.slug}`;

    res.json({
      success: true,
      project: updated,
      publicUrl,
      message: shouldPublish ? "Website published successfully!" : "Website unpublished",
    });
  } catch (err) {
    console.error("Publish project error:", err);
    res.status(500).json({ success: false, message: "Failed to toggle publish status" });
  }
});

import domainRoutes from "./domains";

// Custom Domain routes (GET, POST, POST /verify, POST /simulate, DELETE)
router.use("/", domainRoutes);

export default router;
