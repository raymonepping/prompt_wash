import { getEnvelope } from "./client";
import type { RunArtifact, RunDetailData, RunListData, RunSummary } from "../types/runs";

export async function fetchRuns(): Promise<RunSummary[]> {
  const envelope = await getEnvelope<RunListData>("/runs");
  return envelope.data.runs;
}

export async function fetchRunById(id: string): Promise<RunArtifact> {
  const envelope = await getEnvelope<RunDetailData>(`/runs/${encodeURIComponent(id)}`);
  return envelope.data.run;
}

export const runsApi = {
  fetchRuns,
  fetchRunById,
};
