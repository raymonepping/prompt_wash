import { fetchRunById, fetchRuns } from "../services/runs.js";

export async function listRuns(_req, res, next) {
  try {
    const data = await fetchRuns();

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

export async function getRunById(req, res, next) {
  try {
    const data = await fetchRunById(req.params.id);

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
