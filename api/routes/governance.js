import { Router } from "express";
import {
  getGovernanceRules,
  updateGovernanceRules,
  analyzeRisk,
  analyzeBias,
} from "../controllers/governance.js";

const router = Router();

router.get("/rules", getGovernanceRules);
router.post("/rules", updateGovernanceRules);
router.post("/risk", analyzeRisk);
router.post("/bias", analyzeBias);

export default router;
