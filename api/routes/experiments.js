import { Router } from "express";
import {
  listExperiments,
  getExperimentById,
  runExperiment,
} from "../controllers/experiments.js";

const router = Router();

router.get("/", listExperiments);
router.get("/:id", getExperimentById);
router.post("/run", runExperiment);

export default router;