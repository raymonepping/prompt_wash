import {
  listExecutionArtifacts,
  loadExecutionArtifact,
} from "../../src/services/execution/storage.js";

export async function fetchRuns() {
  const runs = await listExecutionArtifacts();
  return { runs };
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
