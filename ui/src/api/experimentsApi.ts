import { getEnvelope, postEnvelope } from "./client";
import type {
  ExperimentDetailData,
  ExperimentRecord,
  ExperimentsListData,
  RunExperimentData,
  RunExperimentRequest,
} from "../types/experiments";

export async function fetchExperiments(): Promise<string[]> {
  const envelope = await getEnvelope<ExperimentsListData>("/experiments");
  return envelope.data.experiments;
}

export async function fetchExperimentById(id: string): Promise<ExperimentRecord> {
  const envelope = await getEnvelope<ExperimentDetailData>(
    `/experiments/${encodeURIComponent(id)}`,
  );

  return envelope.data.experiment;
}

export async function runExperiment(
  payload: RunExperimentRequest,
): Promise<RunExperimentData> {
  const envelope = await postEnvelope<RunExperimentData, RunExperimentRequest>(
    "/experiments/run",
    payload,
  );

  return envelope.data;
}

export const experimentsApi = {
  fetchExperiments,
  fetchExperimentById,
  runExperiment,
};
