import fs from "node:fs/promises";
import path from "node:path";

import { createFileError, createValidationError } from "../utils/errors.js";

export const CONSTRAINTS_DIR = ".promptwash";
export const CONSTRAINTS_JSON_PATH = path.join(
  CONSTRAINTS_DIR,
  "constraints.json",
);
export const CONSTRAINTS_MD_PATH = path.join(CONSTRAINTS_DIR, "constraints.md");

export const DEFAULT_CONSTRAINTS = {
  structural: [
    "do not invent missing information",
    "preserve technical accuracy",
    "no em dashes",
  ],
  output: ["images must be wide", "images must not contain text"],
};

export async function fileExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

export function validateConstraintsObject(value) {
  const errors = [];

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push("Constraints must be a JSON object.");
    return errors;
  }

  if (!Array.isArray(value.structural)) {
    errors.push("structural must be an array");
  }

  if (!Array.isArray(value.output)) {
    errors.push("output must be an array");
  }

  if (Array.isArray(value.structural)) {
    for (const item of value.structural) {
      if (typeof item !== "string" || !item.trim()) {
        errors.push("Each structural constraint must be a non-empty string");
        break;
      }
    }
  }

  if (Array.isArray(value.output)) {
    for (const item of value.output) {
      if (typeof item !== "string" || !item.trim()) {
        errors.push("Each output constraint must be a non-empty string");
        break;
      }
    }
  }

  return errors;
}

export async function initializeConstraints() {
  if (await fileExists(CONSTRAINTS_JSON_PATH)) {
    throw createValidationError(
      `Constraints file already exists: ${CONSTRAINTS_JSON_PATH}`,
    );
  }

  try {
    await fs.mkdir(CONSTRAINTS_DIR, { recursive: true });
    await fs.writeFile(
      CONSTRAINTS_JSON_PATH,
      `${JSON.stringify(DEFAULT_CONSTRAINTS, null, 2)}\n`,
      "utf8",
    );
  } catch (error) {
    throw createFileError(
      `Unable to write constraints file: ${CONSTRAINTS_JSON_PATH}`,
      error.message,
    );
  }

  return CONSTRAINTS_JSON_PATH;
}

export async function loadConstraints() {
  if (!(await fileExists(CONSTRAINTS_JSON_PATH))) {
    return structuredClone(DEFAULT_CONSTRAINTS);
  }

  try {
    const raw = await fs.readFile(CONSTRAINTS_JSON_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    throw createFileError(
      `Unable to read constraints file: ${CONSTRAINTS_JSON_PATH}`,
      error.message,
    );
  }
}
