import { Router } from "express";

import { getRunById, listRuns } from "../controllers/runs.js";

const router = Router();

router.get("/", listRuns);
router.get("/:id", getRunById);

export default router;
