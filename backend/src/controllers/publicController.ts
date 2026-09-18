import { Request, Response } from "express";
import { getProjectBySlug, getProjectByDomain } from "../lib/db";
import { normalizeDomain } from "../services/domainService";

/**
 * Public controller to serve published websites by slug or custom domain.
 */
export async function getSiteBySlug(req: Request, res: Response): Promise<void> {
  try {
    const slug = String(req.params.slug);
    const project = await getProjectBySlug(slug);

    if (!project || !project.isPublished) {
      res.status(404).json({ success: false, message: "Published website not found" });
      return;
    }

    res.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        websiteData: project.websiteData,
        customDomain: project.customDomain,
        publishedAt: project.publishedAt,
      },
    });
  } catch (error: any) {
    console.error("Public site fetch error:", error);
    res.status(500).json({ success: false, message: "Error retrieving published website" });
  }
}

export async function getSiteByDomain(req: Request, res: Response): Promise<void> {
  try {
    const rawDomain = String(req.params.domain);
    const domain = normalizeDomain(rawDomain);
    const project = await getProjectByDomain(domain);

    if (!project || !project.isPublished) {
      res.status(404).json({
        success: false,
        message: `No published website associated with domain "${domain}". Ensure the site is published and domain is verified.`,
      });
      return;
    }

    res.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        websiteData: project.websiteData,
        customDomain: project.customDomain,
        publishedAt: project.publishedAt,
      },
    });
  } catch (error: any) {
    console.error("Domain fetch error:", error);
    res.status(500).json({ success: false, message: "Error resolving custom domain" });
  }
}
