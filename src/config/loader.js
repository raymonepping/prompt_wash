import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { createFileError, createValidationError } from "../utils/errors.js";

export const DEFAULT_CONFIG = {
  ollama: {
    baseUrl: "http://localhost:11434/api",
    model: "llama3.2",
    timeoutMs: 30000,
  },
  output: {
    defaultFormat: "text",
  },
  benchmark: {
    enableProviders: ["ollama"],
    exactTokenCounting: false,
    pricing: {
      generic: 0,
      compact: 0,
      openai: 0,
      claude: 0,
      ollama: 0,
    },
    models: {
      generic: "generic-default",
      compact: "compact-default",
      openai: "openai-default",
      claude: "claude-default",
      ollama: "llama3.2",
    },
  },
};

export const PROJECT_CONFIG_PATH = ".promptwash.config.json";

export function getUserConfigPath() {
  return path.join(os.homedir(), ".promptwash.config.json");
}

export async function fileExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

export async function readJsonFile(pathValue) {
  try {
    const raw = await fs.readFile(pathValue, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    throw createFileError(`Unable to read JSON config: ${pathValue}`, error.message);
  }
}

export function deepMerge(baseValue, overrideValue) {
  if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
    return [...overrideValue];
  }

  if (
    baseValue &&
    overrideValue &&
    typeof baseValue === "object" &&
    typeof overrideValue === "object" &&
    !Array.isArray(baseValue) &&
    !Array.isArray(overrideValue)
  ) {
    const result = { ...baseValue };

    for (const key of Object.keys(overrideValue)) {
      result[key] = deepMerge(baseValue[key], overrideValue[key]);
    }

    return result;
  }

  return overrideValue === undefined ? baseValue : overrideValue;
}

export function applyEnvOverrides(config) {
  const result = structuredClone(config);

  if (process.env.PROMPTWASH_OLLAMA_BASE_URL) {
    result.ollama.baseUrl = process.env.PROMPTWASH_OLLAMA_BASE_URL;
  }

  if (process.env.PROMPTWASH_OLLAMA_MODEL) {
    result.ollama.model = process.env.PROMPTWASH_OLLAMA_MODEL;
  }

  if (process.env.PROMPTWASH_OLLAMA_TIMEOUT_MS) {
    const timeoutMs = Number(process.env.PROMPTWASH_OLLAMA_TIMEOUT_MS);

    if (!Number.isNaN(timeoutMs)) {
      result.ollama.timeoutMs = timeoutMs;
    }
  }

  return result;
}

export async function loadProjectConfig() {
  if (!(await fileExists(PROJECT_CONFIG_PATH))) {
    return {};
  }

  return await readJsonFile(PROJECT_CONFIG_PATH);
}

export async function loadUserConfig() {
  const userConfigPath = getUserConfigPath();

  if (!(await fileExists(userConfigPath))) {
    return {};
  }

  return await readJsonFile(userConfigPath);
}

export async function resolveConfig() {
  const userConfig = await loadUserConfig();
  const projectConfig = await loadProjectConfig();

  const merged = deepMerge(
    deepMerge(DEFAULT_CONFIG, userConfig),
    projectConfig,
  );

  return applyEnvOverrides(merged);
}

export function validateConfigObject(config) {
  const errors = [];

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    errors.push("Config must be a JSON object.");
    return errors;
  }

  if (!config.ollama || typeof config.ollama !== "object") {
    errors.push("Missing required object: ollama");
    return errors;
  }

  if (typeof config.ollama.baseUrl !== "string" || !config.ollama.baseUrl.trim()) {
    errors.push("ollama.baseUrl must be a non-empty string");
  }

  if (typeof config.ollama.model !== "string" || !config.ollama.model.trim()) {
    errors.push("ollama.model must be a non-empty string");
  }

  if (typeof config.ollama.timeoutMs !== "number" || Number.isNaN(config.ollama.timeoutMs)) {
    errors.push("ollama.timeoutMs must be a number");
  }

  if (config.output && typeof config.output !== "object") {
    errors.push("output must be an object when provided");
  }

  if (config.benchmark && typeof config.benchmark !== "object") {
    errors.push("benchmark must be an object when provided");
  }

  if (config.benchmark?.pricing && typeof config.benchmark.pricing !== "object") {
    errors.push("benchmark.pricing must be an object when provided");
  }

  if (config.benchmark?.models && typeof config.benchmark.models !== "object") {
    errors.push("benchmark.models must be an object when provided");
  }

  if (config.benchmark?.pricing) {
    for (const [provider, price] of Object.entries(config.benchmark.pricing)) {
      if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
        errors.push(`benchmark.pricing.${provider} must be a non-negative number`);
      }
    }
  }

  if (config.benchmark?.models) {
    for (const [provider, model] of Object.entries(config.benchmark.models)) {
      if (typeof model !== "string" || !model.trim()) {
        errors.push(`benchmark.models.${provider} must be a non-empty string`);
      }
    }
  }

  return errors;
}

export async function initializeProjectConfig() {
  if (await fileExists(PROJECT_CONFIG_PATH)) {
    throw createValidationError(
      `Project config already exists: ${PROJECT_CONFIG_PATH}`,
    );
  }

  const content = `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`;

  try {
    await fs.writeFile(PROJECT_CONFIG_PATH, content, "utf8");
  } catch (error) {
    throw createFileError(
      `Unable to write project config: ${PROJECT_CONFIG_PATH}`,
      error.message,
    );
  }

  return PROJECT_CONFIG_PATH;
}