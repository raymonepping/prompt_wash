import { Router } from "express";
import {
  getGovernanceRules,
  updateGovernanceRules,
} from "../controllers/governance.js";

const router = Router();

router.get("/rules", getGovernanceRules);
router.post("/rules", updateGovernanceRules);

export default router;
