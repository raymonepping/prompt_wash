export function createEmptyPromptIr() {
  return {
    goal: "",
    audience: "",
    context: "",
    constraints: [],
    steps: [],
    output_format: "",
    tone: "",
    language: "",
    variants: {},
    tokens: {},
    metadata: {},
  };
}

export function createEmptyPromptObject() {
  return {
    raw: "",
    cleaned: "",
    ir: createEmptyPromptIr(),
    variants: {
      compact: "",
      openai: "",
      claude: "",
    },
    intent: "",
    audience: "",
    constraints: [],
    tokens: {
      input: 0,
    },
    cost: {},
    complexity_score: 0,
    semantic_drift_risk: "low",
    lint_warnings: [],
    fingerprint: "",
    language: "en",
    metadata: {},
  };
}

export function validatePromptIr(ir) {
  const errors = [];

  if (!ir || typeof ir !== "object" || Array.isArray(ir)) {
    errors.push("Prompt IR must be an object.");
    return errors;
  }

  const stringFields = [
    "goal",
    "audience",
    "context",
    "output_format",
    "tone",
    "language",
  ];

  for (const field of stringFields) {
    if (typeof ir[field] !== "string") {
      errors.push(`IR field must be a string: ${field}`);
    }
  }

  if (!Array.isArray(ir.constraints)) {
    errors.push("IR field must be an array: constraints");
  }

  if (!Array.isArray(ir.steps)) {
    errors.push("IR field must be an array: steps");
  }

  if (
    !ir.variants ||
    typeof ir.variants !== "object" ||
    Array.isArray(ir.variants)
  ) {
    errors.push("IR field must be an object: variants");
  }

  if (!ir.tokens || typeof ir.tokens !== "object" || Array.isArray(ir.tokens)) {
    errors.push("IR field must be an object: tokens");
  }

  if (
    !ir.metadata ||
    typeof ir.metadata !== "object" ||
    Array.isArray(ir.metadata)
  ) {
    errors.push("IR field must be an object: metadata");
  }

  return errors;
}
