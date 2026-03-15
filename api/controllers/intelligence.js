import {
  fetchModelIntelligence,
  fetchRunIntelligence,
  fetchOptimizationIntelligence,
  fetchLineageIntelligence,
} from "../services/intelligence.js";

export async function getModelIntelligence(_req, res, next) {
  try {
    const data = await fetchModelIntelligence();
    res.json({
      status: "success",
      data,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRunIntelligence(_req, res, next) {
  try {
    const data = await fetchRunIntelligence();
    res.json({
      status: "success",
      data,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
}

export async function getOptimizationIntelligence(_req, res, next) {
  try {
    const data = await fetchOptimizationIntelligence();
    res.json({
      status: "success",
      data,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
}

export async function getLineageIntelligence(_req, res, next) {
  try {
    const data = await fetchLineageIntelligence();
    res.json({
      status: "success",
      data,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
}