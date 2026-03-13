import fs from "node:fs/promises";

import { createFileError, createValidationError } from "../../utils/errors.js";

export const PROJECT_MANIFEST_PATH = ".promptwash/project.json";

const DEFAULT_PROJECT_MANIFEST = {
  name: "",
  version: 1,
  prompt_folders: ["prompts", "examples", "design"],
  artifact_folders: ["artifacts", "bundle", "reports"],
  lineage_dir: ".promptwash/lineage",
};

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateStringArray(name, value, errors) {
  if (!Array.isArray(value)) {
    errors.push(`${name} must be an array`);
    return;
  }

  for (const [index, item] of value.entries()) {
    if (!isNonEmptyString(item)) {
      errors.push(`${name}[${index}] must be a non-empty string`);
    }
  }
}

async function pathExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

export function cloneDefaultProjectManifest() {
  return structuredClone(DEFAULT_PROJECT_MANIFEST);
}

export function validateProjectManifest(manifest) {
  const errors = [];

  if (!isObject(manifest)) {
    errors.push("Project manifest must be a JSON object.");
    return errors;
  }

  if (!isNonEmptyString(manifest.name)) {
    errors.push("name must be a non-empty string");
  }

  if (typeof manifest.version !== "number" || Number.isNaN(manifest.version)) {
    errors.push("version must be a number");
  }

  validateStringArray("prompt_folders", manifest.prompt_folders, errors);
  validateStringArray("artifact_folders", manifest.artifact_folders, errors);

  if (!isNonEmptyString(manifest.lineage_dir)) {
    errors.push("lineage_dir must be a non-empty string");
  }

  return errors;
}

export async function loadProjectManifest() {
  if (!(await pathExists(PROJECT_MANIFEST_PATH))) {
    return null;
  }

  let manifest;
  try {
    const raw = await fs.readFile(PROJECT_MANIFEST_PATH, "utf8");
    manifest = JSON.parse(raw);
  } catch (error) {
    throw createFileError(
      `Unable to read project manifest: ${PROJECT_MANIFEST_PATH}`,
      error.message,
    );
  }

  const errors = validateProjectManifest(manifest);

  if (errors.length > 0) {
    throw createValidationError(
      `Invalid project manifest: ${PROJECT_MANIFEST_PATH}`,
      errors,
    );
  }

  return manifest;
}

export async function resolveProjectManifest() {
  const manifest = await loadProjectManifest();

  if (manifest) {
    return {
      source: "project",
      manifest,
    };
  }

  return {
    source: "default",
    manifest: cloneDefaultProjectManifest(),
  };
}

export async function initializeProjectManifest(overrides = {}) {
  if (await pathExists(PROJECT_MANIFEST_PATH)) {
    throw createValidationError(
      `Project manifest already exists: ${PROJECT_MANIFEST_PATH}`,
    );
  }

  const manifest = {
    ...cloneDefaultProjectManifest(),
    ...overrides,
  };

  const errors = validateProjectManifest(manifest);

  if (errors.length > 0) {
    throw createValidationError("Cannot initialize invalid project manifest", errors);
  }

  try {
    await fs.mkdir(".promptwash", { recursive: true });
    await fs.writeFile(
      PROJECT_MANIFEST_PATH,
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8",
    );
  } catch (error) {
    throw createFileError(
      `Unable to write project manifest: ${PROJECT_MANIFEST_PATH}`,
      error.message,
    );
  }

  return PROJECT_MANIFEST_PATH;
}