import fs from "node:fs/promises";

import { createFileError, createValidationError } from "../../utils/errors.js";
import { cloneDefaultRiskRules } from "./risk_defaults.js";

export const PROJECT_RISK_RULES_PATH = ".promptwash/risk-rules.json";

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
      `Unable to read risk rules JSON: ${pathValue}`,
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

  if ("patterns" in category) {
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

  if ("checks" in category) {
    if (!Array.isArray(category.checks)) {
      errors.push(`categories.${name}.checks must be an array`);
    } else {
      for (const [index, check] of category.checks.entries()) {
        if (typeof check !== "string" || !check.trim()) {
          errors.push(
            `categories.${name}.checks[${index}] must be a non-empty string`,
          );
        }
      }
    }
  }

  if (!("patterns" in category) && !("checks" in category)) {
    errors.push(`categories.${name} must define either patterns or checks`);
  }
}

export function validateRiskRulesObject(rules) {
  const errors = [];

  if (!isObject(rules)) {
    errors.push("Risk rules must be a JSON object.");
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

export async function loadProjectRiskRules() {
  if (!(await fileExists(PROJECT_RISK_RULES_PATH))) {
    return null;
  }

  const rules = await readJsonFile(PROJECT_RISK_RULES_PATH);
  const errors = validateRiskRulesObject(rules);

  if (errors.length > 0) {
    throw createValidationError(
      `Invalid risk rules file: ${PROJECT_RISK_RULES_PATH}`,
      errors,
    );
  }

  return rules;
}

export async function resolveRiskRules() {
  const projectRules = await loadProjectRiskRules();

  if (projectRules) {
    return projectRules;
  }

  return cloneDefaultRiskRules();
}

export async function initializeProjectRiskRules() {
  if (await fileExists(PROJECT_RISK_RULES_PATH)) {
    throw createValidationError(
      `Risk rules already exist: ${PROJECT_RISK_RULES_PATH}`,
    );
  }

  const rules = cloneDefaultRiskRules();
  const content = `${JSON.stringify(rules, null, 2)}\n`;

  try {
    await fs.mkdir(".promptwash", { recursive: true });
    await fs.writeFile(PROJECT_RISK_RULES_PATH, content, "utf8");
  } catch (error) {
    throw createFileError(
      `Unable to write risk rules file: ${PROJECT_RISK_RULES_PATH}`,
      error.message,
    );
  }

  return PROJECT_RISK_RULES_PATH;
}
