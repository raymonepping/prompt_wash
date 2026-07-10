import {
  listExecutionArtifacts,
  loadExecutionArtifact,
} from "../../src/services/execution/storage.js";

export async function fetchRuns() {
  const runs = await listExecutionArtifacts();
  return { runs };
}

export async function fetchLatestRun() {
  const runs = await listExecutionArtifacts();
  
  if (!runs || runs.length === 0) {
    const error = new Error("No runs found");
    error.statusCode = 404;
    error.code = "NOT_FOUND";
    throw error;
  }

  // Sort by timestamp descending and get the first one
  const sortedRuns = runs.sort((a, b) => {
    const timeA = new Date(a.timestamp || a.created_at || 0).getTime();
    const timeB = new Date(b.timestamp || b.created_at || 0).getTime();
    return timeB - timeA;
  });

  const latestRunId = sortedRuns[0].run_id || sortedRuns[0].id;
  const run = await loadExecutionArtifact(latestRunId);

  return { run };
}

export async function fetchRunById(id) {
  const run = await loadExecutionArtifact(id);

  if (!run) {
    const error = new Error(`Run not found: ${id}`);
    error.statusCode = 404;
    error.code = "NOT_FOUND";
    throw error;
  }

  return { run };
}
