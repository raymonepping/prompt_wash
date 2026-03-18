import { getEnvelope } from "./client";
import type {
  LineageIntelligenceData,
  ModelIntelligenceData,
  OptimizationIntelligenceData,
  RunIntelligenceData,
} from "../types/intelligence";

export async function fetchModelIntelligence(): Promise<ModelIntelligenceData> {
  const envelope = await getEnvelope<ModelIntelligenceData>("/intelligence/models");
  return envelope.data;
}

export async function fetchRunIntelligence(): Promise<RunIntelligenceData> {
  const envelope = await getEnvelope<RunIntelligenceData>("/intelligence/runs");
  return envelope.data;
}

export async function fetchOptimizationIntelligence(): Promise<OptimizationIntelligenceData> {
  const envelope = await getEnvelope<OptimizationIntelligenceData>(
    "/intelligence/optimization",
  );
  return envelope.data;
}

export async function fetchLineageIntelligence(): Promise<LineageIntelligenceData | null> {
  const envelope = await getEnvelope<LineageIntelligenceData | null>(
    "/intelligence/lineage",
  );
  return envelope.data;
}

export const intelligenceApi = {
  fetchModelIntelligence,
  fetchRunIntelligence,
  fetchOptimizationIntelligence,
  fetchLineageIntelligence,
};
