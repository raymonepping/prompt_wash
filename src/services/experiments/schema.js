export const EXPERIMENT_ARTIFACT_VERSION = 1;

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

export function createExperimentArtifact({
  experimentId,
  createdAt = new Date().toISOString(),
  source,
  provider,
  variants,
  runs,
  rankings,
  recommendations,
  winner,
}) {
  return {
    version: EXPERIMENT_ARTIFACT_VERSION,
    experiment_id: experimentId,
    created_at: createdAt,
    source,
    provider,
    variants,
    runs,
    rankings,
    recommendations,
    winner,
  };
}

export function validateExperimentArtifact(artifact) {
  const errors = [];

  if (!isObject(artifact)) {
    errors.push("Experiment artifact must be an object.");
    return errors;
  }

  if (typeof artifact.version !== "number" || Number.isNaN(artifact.version)) {
    errors.push("version must be a number");
  }

  if (
    typeof artifact.experiment_id !== "string" ||
    !artifact.experiment_id.trim()
  ) {
    errors.push("experiment_id must be a non-empty string");
  }

  if (typeof artifact.created_at !== "string" || !artifact.created_at.trim()) {
    errors.push("created_at must be a non-empty string");
  }

  if (!isObject(artifact.source)) {
    errors.push("source must be an object");
  }

  if (typeof artifact.provider !== "string" || !artifact.provider.trim()) {
    errors.push("provider must be a non-empty string");
  }

  if (!Array.isArray(artifact.variants)) {
    errors.push("variants must be an array");
  }

  if (!Array.isArray(artifact.runs)) {
    errors.push("runs must be an array");
  }

  if (!isObject(artifact.rankings)) {
    errors.push("rankings must be an object");
  }

  if (!Array.isArray(artifact.recommendations)) {
    errors.push("recommendations must be an array");
  }

  if (typeof artifact.winner !== "string" || !artifact.winner.trim()) {
    errors.push("winner must be a non-empty string");
  }

  return errors;
}
