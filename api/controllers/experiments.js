import {
  fetchExperimentById,
  fetchExperiments,
  executeExperiment,
} from "../services/experiments.js";

export async function listExperiments(_req, res, next) {
  try {
    const data = await fetchExperiments();

    res.json({
      status: "success",
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getExperimentById(req, res, next) {
  try {
    const data = await fetchExperimentById(req.params.id);

    res.json({
      status: "success",
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function runExperiment(req, res, next) {
  try {
    const { prompt, variants = [], model = null } = req.body ?? {};

    const data = await executeExperiment({
      prompt,
      variants,
      model,
    });

    res.json({
      status: "success",
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}