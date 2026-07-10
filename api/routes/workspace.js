import { Router } from "express";
import {
  analyzeWorkspace,
  getWorkspaceState,
  runWorkspacePrompt,
} from "../controllers/workspace.js";
import {
  validateWorkspaceAnalyze,
  validateWorkspaceRun,
  sanitizeInput,
} from "../middleware/validation.js";

const router = Router();

router.post("/analyze", sanitizeInput, validateWorkspaceAnalyze, analyzeWorkspace);
router.post("/run", sanitizeInput, validateWorkspaceRun, runWorkspacePrompt);
router.get("/state", getWorkspaceState);

export default router;
