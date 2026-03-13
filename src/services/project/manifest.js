import fs from "node:fs/promises";

import { createFileError, createValidationError } from "../../utils/errors.js";

export const PROJECT_MANIFEST_PATH = ".promptwash/project.json";

const DEFAULT_PROJECT_MANIFEST = {
  name: "",
  version: 1,
  prompt_folders: ["prompts", "examples", "design"],
  artifact_folders: ["artifacts", "bundle", "reports"],
  lineage_dir: ".promptwash/lineage",
  strict_prompt_folders: true,
  include_patterns: [],
  exclude_patterns: [
    ".promptwash/**",
    "docs/**",
    "reports/**",
    "bundle/**",
    "bundles/**",
    "node_modules/**",
    ".git/**",
    "package.json",
    "package-lock.json",
  ],
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

  if (typeof manifest.strict_prompt_folders !== "boolean") {
    errors.push("strict_prompt_folders must be a boolean");
  }

  validateStringArray("include_patterns", manifest.include_patterns, errors);
  validateStringArray("exclude_patterns", manifest.exclude_patterns, errors);

  return errors;
}

function mergeWithDefaults(manifest) {
  return {
    ...cloneDefaultProjectManifest(),
    ...manifest,
    prompt_folders: Array.isArray(manifest.prompt_folders)
      ? manifest.prompt_folders
      : cloneDefaultProjectManifest().prompt_folders,
    artifact_folders: Array.isArray(manifest.artifact_folders)
      ? manifest.artifact_folders
      : cloneDefaultProjectManifest().artifact_folders,
    include_patterns: Array.isArray(manifest.include_patterns)
      ? manifest.include_patterns
      : cloneDefaultProjectManifest().include_patterns,
    exclude_patterns: Array.isArray(manifest.exclude_patterns)
      ? manifest.exclude_patterns
      : cloneDefaultProjectManifest().exclude_patterns,
  };
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

  const mergedManifest = mergeWithDefaults(manifest);
  const errors = validateProjectManifest(mergedManifest);

  if (errors.length > 0) {
    throw createValidationError(
      `Invalid project manifest: ${PROJECT_MANIFEST_PATH}`,
      errors,
    );
  }

  return mergedManifest;
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

  const manifest = mergeWithDefaults({
    ...cloneDefaultProjectManifest(),
    ...overrides,
  });

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