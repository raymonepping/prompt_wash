export const EXECUTION_ARTIFACT_VERSION = 1;

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

export function createExecutionArtifact({
  runId,
  createdAt = new Date().toISOString(),
  source,
  prompt,
  execution,
  input,
  output,
  metadata,
}) {
  return {
    version: EXECUTION_ARTIFACT_VERSION,
    run_id: runId,
    created_at: createdAt,
    source,
    prompt,
    execution,
    input,
    output,
    metadata,
  };
}

export function validateExecutionArtifact(artifact) {
  const errors = [];

  if (!isObject(artifact)) {
    errors.push("Execution artifact must be an object.");
    return errors;
  }

  if (typeof artifact.version !== "number" || Number.isNaN(artifact.version)) {
    errors.push("version must be a number");
  }

  if (typeof artifact.run_id !== "string" || !artifact.run_id.trim()) {
    errors.push("run_id must be a non-empty string");
  }

  if (typeof artifact.created_at !== "string" || !artifact.created_at.trim()) {
    errors.push("created_at must be a non-empty string");
  }

  if (!isObject(artifact.source)) {
    errors.push("source must be an object");
  }

  if (!isObject(artifact.prompt)) {
    errors.push("prompt must be an object");
  }

  if (!isObject(artifact.execution)) {
    errors.push("execution must be an object");
  }

  if (!isObject(artifact.input)) {
    errors.push("input must be an object");
  }

  if (!isObject(artifact.output)) {
    errors.push("output must be an object");
  }

  if (!isObject(artifact.metadata)) {
    errors.push("metadata must be an object");
  }

  return errors;
}
