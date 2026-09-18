import { Router, Response } from "express";
import { saveMediaItem, getMediaByUser, deleteMediaItem } from "../lib/db";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Get uploaded media for user
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const items = await getMediaByUser(user.id);
    res.json({ success: true, media: items });
  } catch (err) {
    console.error("List media error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch media" });
  }
});

// Upload media item
router.post("/upload", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { name, dataUrl, size, type } = req.body;

    if (!dataUrl || !name) {
      res.status(400).json({ success: false, message: "Image name and image data are required" });
      return;
    }

    // Validate size (max 5MB)
    const approximateSize = size || (dataUrl.length * 3) / 4;
    if (approximateSize > 5 * 1024 * 1024) {
      res.status(400).json({ success: false, message: "Image exceeds maximum allowed size of 5MB" });
      return;
    }

    // Validate image format
    if (type && !type.startsWith("image/")) {
      res.status(400).json({ success: false, message: "Only image files (PNG, JPG, SVG, WebP) are allowed" });
      return;
    }

    const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const mediaItem = {
      id,
      userId: user.id,
      name,
      url: dataUrl,
      size: approximateSize,
      type: type || "image/png",
      createdAt: new Date().toISOString(),
    };

    await saveMediaItem(mediaItem);
    res.status(201).json({ success: true, media: mediaItem });
  } catch (err) {
    console.error("Upload media error:", err);
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
});

// Delete media item
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const deleted = await deleteMediaItem(String(req.params.id), user.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Image not found or unauthorized" });
      return;
    }
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete media error:", err);
    res.status(500).json({ success: false, message: "Failed to delete media" });
  }
});

export default router;
