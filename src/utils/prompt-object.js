function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

const PROMPT_OBJECT_REQUIRED_KEYS = ["raw", "cleaned", "ir", "intent"];
const IR_REQUIRED_KEYS = ["goal", "audience", "constraints", "steps"];

function getObjectKeys(value) {
  if (!isObject(value)) {
    return [];
  }

  return Object.keys(value).sort();
}

function missingKeys(value, requiredKeys) {
  const keys = new Set(getObjectKeys(value));
  return requiredKeys.filter((key) => !keys.has(key));
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

export function diagnosePromptJsonShape(value) {
  const keys = getObjectKeys(value);

  if (!isObject(value)) {
    return {
      kind: "not_object",
      keys,
      prompt_object_missing: [...PROMPT_OBJECT_REQUIRED_KEYS],
      ir_missing: [...IR_REQUIRED_KEYS],
      likely_shape: "unknown",
    };
  }

  const promptObjectMissing = missingKeys(value, PROMPT_OBJECT_REQUIRED_KEYS);
  const irMissing = missingKeys(value, IR_REQUIRED_KEYS);

  let likelyShape = "unknown";

  if (promptObjectMissing.length === 0 && looksLikePromptWashObject(value)) {
    likelyShape = "prompt_object";
  } else if (irMissing.length === 0 && looksLikePromptIr(value)) {
    likelyShape = "ir";
  } else {
    const promptHits =
      PROMPT_OBJECT_REQUIRED_KEYS.length - promptObjectMissing.length;
    const irHits = IR_REQUIRED_KEYS.length - irMissing.length;

    if (promptHits > irHits && promptHits > 0) {
      likelyShape = "prompt_object_like";
    } else if (irHits > promptHits && irHits > 0) {
      likelyShape = "ir_like";
    }
  }

  return {
    kind: "object",
    keys,
    prompt_object_missing: promptObjectMissing,
    ir_missing: irMissing,
    likely_shape: likelyShape,
  };
}

export function validatePromptWashObject(value) {
  const errors = [];

  if (!looksLikePromptWashObject(value)) {
    errors.push("Value does not look like a PromptWash prompt object.");
    return errors;
  }

  if (!isObject(value.ir)) {
    errors.push("Missing IR object.");
    return errors;
  }

  const ir = value.ir;

  if (typeof ir.goal !== "string") {
    errors.push("IR goal must be a string.");
  }

  if (typeof ir.audience !== "string") {
    errors.push("IR audience must be a string.");
  }

  if (typeof ir.context !== "string") {
    errors.push("IR context must be a string.");
  }

  if (!Array.isArray(ir.constraints)) {
    errors.push("IR constraints must be an array.");
  }

  if (!Array.isArray(ir.steps)) {
    errors.push("IR steps must be an array.");
  }

  if (typeof ir.output_format !== "string") {
    errors.push("IR output_format must be a string.");
  }

  if (typeof ir.tone !== "string") {
    errors.push("IR tone must be a string.");
  }

  if (typeof ir.language !== "string") {
    errors.push("IR language must be a string.");
  }

  return errors;
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
