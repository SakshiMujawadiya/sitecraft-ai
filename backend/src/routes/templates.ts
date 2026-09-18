import { Router, Request, Response } from "express";
import { PREBUILT_TEMPLATES } from "../lib/templates";

const router = Router();

// Get all templates with optional category filter
router.get("/", (req: Request, res: Response): void => {
  const { category, search } = req.query;
  let list = [...PREBUILT_TEMPLATES];

  if (category && category !== "All") {
    list = list.filter((t) => t.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, templates: list });
});

// Get single template by ID
router.get("/:id", (req: Request, res: Response): void => {
  const template = PREBUILT_TEMPLATES.find((t) => t.id === req.params.id);
  if (!template) {
    res.status(404).json({ success: false, message: "Template not found" });
    return;
  }
  res.json({ success: true, template });
});

export default router;
