import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  connectDomain,
  verifyDomain,
  simulateVerifyDomain,
  disconnectDomain,
  getDomainInfo,
} from "../controllers/domainController";

const router = Router({ mergeParams: true });

router.get("/:id/domain", requireAuth, getDomainInfo);
router.post("/:id/domain", requireAuth, connectDomain);
router.post("/:id/domain/verify", requireAuth, verifyDomain);
router.post("/:id/domain/simulate", requireAuth, simulateVerifyDomain);
router.delete("/:id/domain", requireAuth, disconnectDomain);

export default router;
