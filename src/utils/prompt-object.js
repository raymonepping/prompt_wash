function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

export function looksLikePromptWashObject(value) {
  return (
    isObject(value) &&
    typeof value.raw === "string" &&
    typeof value.cleaned === "string" &&
    isObject(value.ir) &&
    typeof value.intent === "string"
  );
}

export function looksLikePromptIr(value) {
  return (
    isObject(value) &&
    typeof value.goal === "string" &&
    typeof value.audience === "string" &&
    Array.isArray(value.constraints) &&
    Array.isArray(value.steps)
  );
}

export function normalizePromptInputObject(value) {
  if (looksLikePromptWashObject(value)) {
    return {
      type: "prompt_object",
      promptObject: value,
    };
  }

  if (looksLikePromptIr(value)) {
    return {
      type: "ir",
      promptObject: {
        raw: "",
        cleaned: "",
        ir: value,
        variants: {
          compact: "",
          openai: "",
          claude: "",
        },
        intent: value.goal ?? "",
        audience: value.audience ?? "general",
        constraints: Array.isArray(value.constraints)
          ? [...value.constraints]
          : [],
        tokens: value.tokens ?? { input: 0 },
        cost: {},
        complexity_score: 0,
        semantic_drift_risk: "low",
        lint_warnings: [],
        fingerprint: "",
        language: value.language ?? "en",
        metadata: {
          source: "ir_json",
        },
      },
    };
  }

  return null;
}
