import { Router } from "express";
import {
  listExperiments,
  getExperimentById,
  runExperiment,
} from "../controllers/experiments.js";
import {
  validateExperimentRun,
  sanitizeInput,
} from "../middleware/validation.js";

const router = Router();

router.get("/", listExperiments);
router.get("/:id", getExperimentById);
router.post("/run", sanitizeInput, validateExperimentRun, runExperiment);

export default router;
