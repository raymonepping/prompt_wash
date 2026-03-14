import fs from "node:fs/promises";
import path from "node:path";

import { createFileError, createValidationError } from "../../utils/errors.js";
import {
  validateExperimentArtifact,
} from "./schema.js";

export const EXPERIMENTS_DIR = ".promptwash/experiments";

async function pathExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

export async function ensureExperimentsDir() {
  try {
    await fs.mkdir(EXPERIMENTS_DIR, { recursive: true });
  } catch (error) {
    throw createFileError(
      `Unable to create experiments directory: ${EXPERIMENTS_DIR}`,
      error.message,
    );
  }
}

export function buildExperimentArtifactPath(experimentId) {
  return path.join(EXPERIMENTS_DIR, `${experimentId}.json`);
}

export async function saveExperimentArtifact(artifact) {
  const errors = validateExperimentArtifact(artifact);

  if (errors.length > 0) {
    throw createValidationError("Cannot save invalid experiment artifact", errors);
  }

  await ensureExperimentsDir();

  const filePath = buildExperimentArtifactPath(artifact.experiment_id);

  try {
    await fs.writeFile(filePath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  } catch (error) {
    throw createFileError(
      `Unable to write experiment artifact: ${filePath}`,
      error.message,
    );
  }

  return filePath;
}

export async function loadExperimentArtifact(experimentId) {
  const filePath = buildExperimentArtifactPath(experimentId);

  if (!(await pathExists(filePath))) {
    return null;
  }

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const artifact = JSON.parse(raw);
    const errors = validateExperimentArtifact(artifact);

    if (errors.length > 0) {
      throw createValidationError(`Invalid experiment artifact: ${filePath}`, errors);
    }

    return artifact;
  } catch (error) {
    if (error.code === "VALIDATION_ERROR") {
      throw error;
    }

    throw createFileError(
      `Unable to load experiment artifact: ${filePath}`,
      error.message,
    );
  }
}

function toExperimentSummary(artifact) {
  return {
    experiment_id: artifact.experiment_id,
    created_at: artifact.created_at,
    provider: artifact.provider,
    variants: artifact.variants,
    winner: artifact.winner,
    source_type: artifact.source?.type ?? null,
    source_path: artifact.source?.path ?? null,
    run_count: Array.isArray(artifact.runs) ? artifact.runs.length : 0,
  };
}

export async function listExperimentArtifacts() {
  if (!(await pathExists(EXPERIMENTS_DIR))) {
    return [];
  }

  let entries;
  try {
    entries = await fs.readdir(EXPERIMENTS_DIR, { withFileTypes: true });
  } catch (error) {
    throw createFileError(
      `Unable to list experiments directory: ${EXPERIMENTS_DIR}`,
      error.message,
    );
  }

  const experimentFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort()
    .reverse();

  const summaries = [];

  for (const filename of experimentFiles) {
    const experimentId = filename.replace(/\.json$/i, "");
    const artifact = await loadExperimentArtifact(experimentId);
    if (artifact) {
      summaries.push(toExperimentSummary(artifact));
    }
  }

  return summaries;
}