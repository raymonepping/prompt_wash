import { Router } from "express";

import { getRunById, listRuns, getLatestRun } from "../controllers/runs.js";

const router = Router();

router.get("/", listRuns);
router.get("/latest", getLatestRun);
router.get("/:id", getRunById);

export default router;

// Made with Bob
