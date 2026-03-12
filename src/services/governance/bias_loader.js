import fs from "node:fs/promises";

import { createFileError, createValidationError } from "../../utils/errors.js";
import { cloneDefaultBiasRules } from "./bias_defaults.js";

export const PROJECT_BIAS_RULES_PATH = ".promptwash/bias-rules.json";

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

async function fileExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(pathValue) {
  try {
    const raw = await fs.readFile(pathValue, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    throw createFileError(
      `Unable to read bias rules JSON: ${pathValue}`,
      error.message,
    );
  }
}

function validateCategoryShape(name, category, errors) {
  if (!isObject(category)) {
    errors.push(`categories.${name} must be an object`);
    return;
  }

  if (typeof category.weight !== "number" || Number.isNaN(category.weight)) {
    errors.push(`categories.${name}.weight must be a number`);
  }

  if (typeof category.enabled !== "boolean") {
    errors.push(`categories.${name}.enabled must be a boolean`);
  }

  if (!Array.isArray(category.patterns)) {
    errors.push(`categories.${name}.patterns must be an array`);
  } else {
    for (const [index, pattern] of category.patterns.entries()) {
      if (typeof pattern !== "string" || !pattern.trim()) {
        errors.push(
          `categories.${name}.patterns[${index}] must be a non-empty string`,
        );
      }
    }
  }
}

export function validateBiasRulesObject(rules) {
  const errors = [];

  if (!isObject(rules)) {
    errors.push("Bias rules must be a JSON object.");
    return errors;
  }

  if (typeof rules.version !== "number" || Number.isNaN(rules.version)) {
    errors.push("version must be a number");
  }

  if (!isObject(rules.categories)) {
    errors.push("categories must be an object");
  } else {
    for (const [name, category] of Object.entries(rules.categories)) {
      validateCategoryShape(name, category, errors);
    }
  }

  if (!isObject(rules.thresholds)) {
    errors.push("thresholds must be an object");
  } else {
    const thresholdKeys = ["very_low", "low", "medium", "high"];

    for (const key of thresholdKeys) {
      if (
        typeof rules.thresholds[key] !== "number" ||
        Number.isNaN(rules.thresholds[key])
      ) {
        errors.push(`thresholds.${key} must be a number`);
      }
    }

    if (
      typeof rules.thresholds.very_low === "number" &&
      typeof rules.thresholds.low === "number" &&
      rules.thresholds.very_low > rules.thresholds.low
    ) {
      errors.push(
        "thresholds.very_low must be less than or equal to thresholds.low",
      );
    }

    if (
      typeof rules.thresholds.low === "number" &&
      typeof rules.thresholds.medium === "number" &&
      rules.thresholds.low > rules.thresholds.medium
    ) {
      errors.push(
        "thresholds.low must be less than or equal to thresholds.medium",
      );
    }

    if (
      typeof rules.thresholds.medium === "number" &&
      typeof rules.thresholds.high === "number" &&
      rules.thresholds.medium > rules.thresholds.high
    ) {
      errors.push(
        "thresholds.medium must be less than or equal to thresholds.high",
      );
    }
  }

  return errors;
}

export async function loadProjectBiasRules() {
  if (!(await fileExists(PROJECT_BIAS_RULES_PATH))) {
    return null;
  }

  const rules = await readJsonFile(PROJECT_BIAS_RULES_PATH);
  const errors = validateBiasRulesObject(rules);

  if (errors.length > 0) {
    throw createValidationError(
      `Invalid bias rules file: ${PROJECT_BIAS_RULES_PATH}`,
      errors,
    );
  }

  return rules;
}

export async function resolveBiasRules() {
  const projectRules = await loadProjectBiasRules();

  if (projectRules) {
    return projectRules;
  }

  return cloneDefaultBiasRules();
}

export async function initializeProjectBiasRules() {
  if (await fileExists(PROJECT_BIAS_RULES_PATH)) {
    throw createValidationError(
      `Bias rules already exist: ${PROJECT_BIAS_RULES_PATH}`,
    );
  }

  const rules = cloneDefaultBiasRules();
  const content = `${JSON.stringify(rules, null, 2)}\n`;

  try {
    await fs.mkdir(".promptwash", { recursive: true });
    await fs.writeFile(PROJECT_BIAS_RULES_PATH, content, "utf8");
  } catch (error) {
    throw createFileError(
      `Unable to write bias rules file: ${PROJECT_BIAS_RULES_PATH}`,
      error.message,
    );
  }

  return PROJECT_BIAS_RULES_PATH;
}
