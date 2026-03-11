import { runPipeline } from "../pipeline/index.js";
import {
  normalizePromptInputObject,
  validatePromptWashObject,
} from "./prompt-object.js";
import { tryParseJson } from "./json.js";
import { createValidationError } from "./errors.js";

export async function resolvePromptObjectFromSource(resolved, options = {}) {
  const parsedJson = tryParseJson(resolved.value);

  if (parsedJson !== null) {
    const normalizedObject = normalizePromptInputObject(parsedJson);

    if (!normalizedObject) {
      throw createValidationError(
        "JSON input is valid JSON, but not a valid PromptWash artifact or Prompt IR.",
        [
          "Expected a PromptWash prompt object with fields like raw, cleaned, ir, and intent.",
          "Or expected a Prompt IR object with fields like goal, audience, constraints, and steps.",
        ],
      );
    }

    if (normalizedObject.type === "prompt_object") {
      const errors = validatePromptWashObject(normalizedObject.promptObject);

      if (errors.length > 0) {
        throw createValidationError("Invalid PromptWash JSON artifact", errors);
      }
    }

    return {
      promptObject: normalizedObject.promptObject,
      sourceType:
        normalizedObject.type === "prompt_object"
          ? "promptwash_json"
          : "ir_json",
    };
  }

  const promptObject = await runPipeline(resolved.value, {
    source: resolved.kind,
    path: resolved.path,
    enrich: options.enrich === true,
  });

  return {
    promptObject,
    sourceType: resolved.kind,
  };
}
