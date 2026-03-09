function hasConflictingInstructions(text) {
  const lower = text.toLowerCase();

  const conciseSignals = /\bbrief\b|\bconcise\b|\bshort\b/.test(lower);
  const verboseSignals =
    /\bdetailed\b|\bcomprehensive\b|\bin depth\b|\bextensive\b/.test(lower);

  return conciseSignals && verboseSignals;
}

function outputAudienceMismatch(promptObject) {
  const audience = promptObject.ir.audience;
  const outputFormat = promptObject.ir.output_format;

  if (!outputFormat) {
    return false;
  }

  if (audience === "executives" && outputFormat === "json") {
    return true;
  }

  return false;
}

export function lintPrompt(promptObject) {
  const warnings = [];

  const stepCount = promptObject.ir.steps.length;
  const constraintCount = promptObject.ir.constraints.length;
  const outputFormat = promptObject.ir.output_format;
  const intent = promptObject.intent || "";
  const cleaned = promptObject.cleaned || "";
  const documentSignals = promptObject.metadata.document_signals ?? {
    looks_like_document: false,
    heading_count: 0,
    bullet_count: 0,
    command_count: 0,
  };

  if (!intent.trim()) {
    warnings.push({
      code: "PW001",
      level: "error",
      message: "Unable to detect a clear goal or task.",
    });
  }

  if (!outputFormat) {
    warnings.push({
      code: "PW002",
      level: "warning",
      message: "Missing explicit output format.",
    });
  }

  if (stepCount > 3) {
    warnings.push({
      code: "PW003",
      level: "warning",
      message: "Multiple tasks or steps detected.",
    });
  }

  if (constraintCount > 5) {
    warnings.push({
      code: "PW004",
      level: "warning",
      message: "High constraint density detected.",
    });
  }

  if (documentSignals.looks_like_document) {
    warnings.push({
      code: "PW005",
      level: "warning",
      message: "Input looks more like documentation than a single prompt.",
    });
  }

  if (hasConflictingInstructions(cleaned)) {
    warnings.push({
      code: "PW006",
      level: "warning",
      message:
        "Potentially conflicting brevity and depth instructions detected.",
    });
  }

  if (stepCount === 0 && !documentSignals.looks_like_document) {
    warnings.push({
      code: "PW007",
      level: "warning",
      message: "No actionable steps detected.",
    });
  }

  if (outputAudienceMismatch(promptObject)) {
    warnings.push({
      code: "PW008",
      level: "warning",
      message: "Output format may not fit the detected audience.",
    });
  }

  if (promptObject.tokens?.input > 1200) {
    warnings.push({
      code: "PW009",
      level: "warning",
      message: "Prompt is large and may create unnecessary context pressure.",
    });
  }

  return warnings;
}
