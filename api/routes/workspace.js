import { Router } from "express";
import {
  analyzeWorkspace,
  getWorkspaceState,
  runWorkspacePrompt,
} from "../controllers/workspace.js";

const router = Router();

router.post("/analyze", analyzeWorkspace);
router.post("/run", runWorkspacePrompt);
router.get("/state", getWorkspaceState);

export default router;