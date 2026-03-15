import { buildPromptWashStats } from "../../src/services/intelligence/stats.js";
import { buildRunIntelligence } from "../../src/services/intelligence/runs.js";
import { buildOptimizationIntelligence } from "../../src/services/intelligence/optimization.js";
import { buildLineageIntelligence } from "../../src/services/intelligence/lineage.js";
import { buildModelIntelligence } from "../../src/services/intelligence/models.js";

export async function fetchModelIntelligence() {
  return await buildModelIntelligence();
}

export async function fetchRunIntelligence() {
  return await buildRunIntelligence();
}

export async function fetchOptimizationIntelligence() {
  return await buildOptimizationIntelligence();
}

export async function fetchLineageIntelligence() {
  return await buildLineageIntelligence();
}

// handy if you later expose /api/intelligence/stats
export async function fetchStatsIntelligence() {
  return await buildPromptWashStats();
}
