import { Router } from "express";
import { getSiteBySlug, getSiteByDomain } from "../controllers/publicController";

const router = Router();

// Resolve public site by slug (e.g. /api/public/site/my-cool-site)
router.get("/site/:slug", getSiteBySlug);

// Resolve public site by verified custom domain (e.g. /api/public/domain/brand.com)
router.get("/domain/:domain", getSiteByDomain);

export default router;
