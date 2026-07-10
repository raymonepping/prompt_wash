import {
  fetchGovernanceRules,
  saveGovernanceRules,
  performRiskAnalysis,
  performBiasAnalysis,
} from "../services/governance.js";

export async function getGovernanceRules(_req, res, next) {
  try {
    const data = await fetchGovernanceRules();

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

export async function updateGovernanceRules(req, res, next) {
  try {
    const data = await saveGovernanceRules(req.body ?? {});

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

export async function analyzeRisk(req, res, next) {
  try {
    const { prompt } = req.body ?? {};

    if (!prompt || typeof prompt !== "string") {
      const error = new Error("prompt must be a non-empty string");
      error.statusCode = 400;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    const data = await performRiskAnalysis(prompt);

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

export async function analyzeBias(req, res, next) {
  try {
    const { prompt } = req.body ?? {};

    if (!prompt || typeof prompt !== "string") {
      const error = new Error("prompt must be a non-empty string");
      error.statusCode = 400;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    const data = await performBiasAnalysis(prompt);

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
