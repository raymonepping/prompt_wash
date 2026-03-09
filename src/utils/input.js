import fs from "node:fs/promises";
import process from "node:process";

import { createFileError, createValidationError } from "./errors.js";

export function isLikelyFilePath(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  return (
    value.includes("/") ||
    value.includes("\\") ||
    value.endsWith(".txt") ||
    value.endsWith(".md") ||
    value.endsWith(".json") ||
    value.endsWith(".prompt")
  );
}

export async function fileExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

export async function readFileUtf8(pathValue) {
  try {
    return await fs.readFile(pathValue, "utf8");
  } catch (error) {
    throw createFileError(`Unable to read file: ${pathValue}`, error.message);
  }
}

export async function readStdin() {
  if (process.stdin.isTTY) {
    return "";
  }

  return await new Promise((resolve, reject) => {
    let data = "";

    process.stdin.setEncoding("utf8");

    process.stdin.on("data", (chunk) => {
      data += chunk;
    });

    process.stdin.on("end", () => {
      resolve(data);
    });

    process.stdin.on("error", (error) => {
      reject(createFileError("Failed to read stdin", error.message));
    });
  });
}

export async function resolveInputSource(input, options = {}) {
  const treatAsFile = options.file === true;

  if (treatAsFile) {
    if (!input) {
      throw createValidationError("Missing file path input for --file");
    }

    const exists = await fileExists(input);

    if (!exists) {
      throw createFileError(`File does not exist: ${input}`);
    }

    return {
      kind: "file",
      value: await readFileUtf8(input),
      path: input
    };
  }

  if (input && typeof input === "string") {
    return {
      kind: "argument",
      value: input,
      path: null
    };
  }

  const stdinValue = await readStdin();

  if (stdinValue.trim()) {
    return {
      kind: "stdin",
      value: stdinValue,
      path: null
    };
  }

  throw createValidationError(
    "No input provided. Pass prompt text, use --file <path>, or pipe content through stdin."
  );
}