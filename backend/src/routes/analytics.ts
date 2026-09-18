import { Router, Request, Response } from "express";
import { recordPageView, getProjectById } from "../lib/db";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// 1. Track pageview (public endpoint called by published landing pages)
router.post("/track", async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, isUnique, device, referrer } = req.body;
    if (!projectId) {
      res.status(400).json({ success: false, message: "Project ID is required" });
      return;
    }

    const validDevice = ["desktop", "mobile", "tablet"].includes(device) ? device : "desktop";

    await recordPageView(projectId, {
      isUnique: Boolean(isUnique),
      device: validDevice,
      referrer,
    });

    res.json({ success: true, message: "Pageview recorded" });
  } catch (err) {
    console.error("Analytics track error:", err);
    res.status(500).json({ success: false, message: "Failed to record event" });
  }
});

// 2. Get analytics metrics for a project
router.get("/:projectId", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const projectId = String(req.params.projectId);
    const project = await getProjectById(projectId);

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    if (project.userId !== user.id) {
      res.status(403).json({ success: false, message: "Unauthorized access to project analytics" });
      return;
    }

    res.json({
      success: true,
      analytics: project.analytics || {
        totalViews: 0,
        uniqueVisitors: 0,
        devices: { desktop: 0, mobile: 0, tablet: 0 },
        referrers: {},
        dailyViews: [],
      },
    });
  } catch (err) {
    console.error("Fetch analytics error:", err);
    res.status(500).json({ success: false, message: "Failed to load analytics" });
  }
});

export default router;
