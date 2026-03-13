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
    const artifact = JSON.parse(raw);
    const errors = validateExecutionArtifact(artifact);

    if (errors.length > 0) {
      throw createValidationError(`Invalid execution artifact: ${filePath}`, errors);
    }

    return artifact;
  } catch (error) {
    if (error.code === "VALIDATION_ERROR") {
      throw error;
    }

    throw createFileError(`Unable to load execution artifact: ${filePath}`, error.message);
  }
}

function toRunSummary(artifact) {
  return {
    run_id: artifact.run_id,
    created_at: artifact.created_at,
    provider: artifact.execution?.provider ?? null,
    model: artifact.execution?.model ?? null,
    render_mode: artifact.execution?.render_mode ?? null,
    latency_ms: artifact.execution?.latency_ms ?? null,
    fingerprint: artifact.prompt?.fingerprint ?? null,
    intent: artifact.prompt?.intent ?? "",
    source_type: artifact.source?.type ?? null,
    source_path: artifact.source?.path ?? null,
    success: artifact.metadata?.success ?? null,
  };
}

export async function listExecutionArtifacts() {
  if (!(await pathExists(RUNS_DIR))) {
    return [];
  }

  let entries;
  try {
    entries = await fs.readdir(RUNS_DIR, { withFileTypes: true });
  } catch (error) {
    throw createFileError(`Unable to list runs directory: ${RUNS_DIR}`, error.message);
  }

  const runFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort()
    .reverse();

  const summaries = [];

  for (const filename of runFiles) {
    const runId = filename.replace(/\.json$/i, "");
    const artifact = await loadExecutionArtifact(runId);
    if (artifact) {
      summaries.push(toRunSummary(artifact));
    }
  }

  return summaries;
}
