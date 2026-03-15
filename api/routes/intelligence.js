import { Router } from "express";
import {
  getModelIntelligence,
  getRunIntelligence,
  getOptimizationIntelligence,
  getLineageIntelligence,
} from "../controllers/intelligence.js";

const router = Router();

router.get("/models", getModelIntelligence);
router.get("/runs", getRunIntelligence);
router.get("/optimization", getOptimizationIntelligence);
router.get("/lineage", getLineageIntelligence);

export default router;