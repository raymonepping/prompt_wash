import { printError } from "./display.js";

export class PromptWashError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "PromptWashError";
    this.code = options.code ?? "PROMPTWASH_ERROR";
    this.details = options.details ?? null;
    this.cause = options.cause;
  }
}

export function createValidationError(message, details = null) {
  return new PromptWashError(message, {
    code: "VALIDATION_ERROR",
    details,
  });
}

export function createFileError(message, details = null) {
  return new PromptWashError(message, {
    code: "FILE_ERROR",
    details,
  });
}

export function exitWithError(error) {
  if (error instanceof PromptWashError) {
    printError(`${error.message} [${error.code}]`);

    if (error.details) {
      if (typeof error.details === "string") {
        console.error(error.details);
      } else {
        console.error(JSON.stringify(error.details, null, 2));
      }
    }

    process.exit(1);
  }

  printError(error?.message ?? "Unknown error");
  process.exit(1);
}