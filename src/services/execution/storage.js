import fs from "node:fs/promises";
import path from "node:path";

import { createFileError, createValidationError } from "../../utils/errors.js";
import { validateExecutionArtifact } from "./schema.js";

export const RUNS_DIR = ".promptwash/runs";

async function pathExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

export async function ensureRunsDir() {
  try {
    await fs.mkdir(RUNS_DIR, { recursive: true });
  } catch (error) {
    throw createFileError(`Unable to create runs directory: ${RUNS_DIR}`, error.message);
  }
}

export function buildRunArtifactPath(runId) {
  return path.join(RUNS_DIR, `${runId}.json`);
}

export async function saveExecutionArtifact(artifact) {
  const errors = validateExecutionArtifact(artifact);

  if (errors.length > 0) {
    throw createValidationError("Cannot save invalid execution artifact", errors);
  }

  await ensureRunsDir();

  const filePath = buildRunArtifactPath(artifact.run_id);

  try {
    await fs.writeFile(filePath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  } catch (error) {
    throw createFileError(`Unable to write execution artifact: ${filePath}`, error.message);
  }

  return filePath;
}

export async function loadExecutionArtifact(runId) {
  const filePath = buildRunArtifactPath(runId);

  if (!(await pathExists(filePath))) {
    return null;
  }

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    throw createFileError(`Unable to load execution artifact: ${filePath}`, error.message);
  }
}