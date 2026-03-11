import { runPipeline } from "../pipeline/index.js";
import {
  diagnosePromptJsonShape,
  normalizePromptInputObject,
  validatePromptWashObject,
} from "./prompt-object.js";
import { tryParseJson } from "./json.js";
import { createValidationError } from "./errors.js";

function buildArtifactSuggestions(diagnosis) {
  const suggestions = [
    "Use `promptwash parse <prompt> --write <file>` to create a valid PromptWash artifact.",
    "Or provide a Prompt IR JSON object with keys like goal, audience, constraints, and steps.",
  ];

  if (diagnosis.likely_shape === "prompt_object_like") {
    suggestions.unshift(
      "This JSON looks somewhat like a PromptWash artifact, but required top-level keys are missing.",
    );
  } else if (diagnosis.likely_shape === "ir_like") {
    suggestions.unshift(
      "This JSON looks somewhat like a Prompt IR, but required IR keys are missing or malformed.",
    );
  } else {
    suggestions.unshift(
      "This looks like generic JSON, not a PromptWash artifact.",
    );
  }

  return suggestions;
}

function buildArtifactValidationDetails(diagnosis) {
  return {
    found_keys: diagnosis.keys,
    likely_shape: diagnosis.likely_shape,
    missing_for_prompt_object: diagnosis.prompt_object_missing,
    missing_for_ir: diagnosis.ir_missing,
    suggestions: buildArtifactSuggestions(diagnosis),
  };
}

export async function resolvePromptObjectFromSource(resolved, options = {}) {
  const parsedJson = tryParseJson(resolved.value);

  if (parsedJson !== null) {
    const normalizedObject = normalizePromptInputObject(parsedJson);

    if (!normalizedObject) {
      const diagnosis = diagnosePromptJsonShape(parsedJson);

      throw createValidationError(
        "JSON input is valid JSON, but not a valid PromptWash artifact or Prompt IR.",
        buildArtifactValidationDetails(diagnosis),
      );
    }

    if (normalizedObject.type === "prompt_object") {
      const errors = validatePromptWashObject(normalizedObject.promptObject);

      if (errors.length > 0) {
        throw createValidationError("Invalid PromptWash JSON artifact", {
          errors,
          diagnosis: buildArtifactValidationDetails(
            diagnosePromptJsonShape(parsedJson),
          ),
        });
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