const FILLER_PATTERNS = [
  /\bjust\b/gi,
  /\bactually\b/gi,
  /\bmaybe\b/gi,
  /\bkind of\b/gi,
  /\bsort of\b/gi,
  /\bplease\b/gi,
];

export async function cleanPromptInput(input) {
  let output = input;

  for (const pattern of FILLER_PATTERNS) {
    output = output.replace(pattern, "");
  }

  return output
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isUsefulArray(value) {
  return (
    Array.isArray(value) &&
    value.some((item) => typeof item === "string" && item.trim())
  );
}

function normalizeOutputFormat(value) {
  if (!isNonEmptyString(value)) {
    return "";
  }

  const lower = value.trim().toLowerCase();

  if (lower.includes("markdown")) {
    return "markdown";
  }

  if (lower.includes("json")) {
    return "json";
  }

  if (lower.includes("table")) {
    return "table";
  }

  if (lower.includes("bullet")) {
    return "bullet_list";
  }

  if (lower.includes("summary")) {
    return "summary";
  }

  return lower;
}

function looksConstraintLike(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return (
    /\bdo not\b/i.test(value) ||
    /\bmust\b/i.test(value) ||
    /\bshould\b/i.test(value) ||
    /\bwithout\b/i.test(value) ||
    /\bavoid\b/i.test(value) ||
    /\bno\b\s+\w+/i.test(value)
  );
}

function looksOutputLike(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return (
    /\bmarkdown\b/i.test(value) ||
    /\bjson\b/i.test(value) ||
    /\btable\b/i.test(value) ||
    /\bbullet(?:ed)? list\b/i.test(value) ||
    /\bsummary\b/i.test(value)
  );
}

function looksAudienceLike(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return (
    /\bexecutives?\b/i.test(value) ||
    /\bdevelopers?\b/i.test(value) ||
    /\bengineers?\b/i.test(value) ||
    /\bbeginners?\b/i.test(value) ||
    /\bstudents?\b/i.test(value)
  );
}

function normalizeArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function looksUsefulContext(value, currentGoal = "") {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const cleaned = value.trim();
  const wordCount = cleaned.split(/\s+/).length;

  if (wordCount < 4) {
    return false;
  }

  if (looksConstraintLike(cleaned)) {
    return false;
  }

  if (looksOutputLike(cleaned)) {
    return false;
  }

  if (looksAudienceLike(cleaned)) {
    return false;
  }

  const goalLower = currentGoal.trim().toLowerCase();
  const contextLower = cleaned.toLowerCase();

  if (!goalLower) {
    return true;
  }

  if (goalLower.includes(contextLower) || contextLower.includes(goalLower)) {
    return false;
  }

  return true;
}

export function mergeEnrichment(promptObject, enrichment = {}) {
  const merged = structuredClone(promptObject);

  const appliedFields = {
    goal: false,
    context: false,
    output_format: false,
    audience: false,
    tone: false,
    constraints: false,
    steps: false,
  };

  const rejectedFields = {};

  if (isNonEmptyString(enrichment.goal)) {
    if (merged.ir.goal.trim().length < 12) {
      merged.ir.goal = enrichment.goal.trim();
      appliedFields.goal = true;
    } else {
      rejectedFields.goal =
        "Existing deterministic goal was already strong enough.";
    }
  }

  if (isNonEmptyString(enrichment.context)) {
    if (merged.ir.context.trim()) {
      rejectedFields.context =
        "Existing deterministic context already present.";
    } else if (!looksUsefulContext(enrichment.context, merged.ir.goal)) {
      rejectedFields.context =
        "Rejected because the suggested context looked too weak, instruction-like, or duplicated the goal.";
    } else {
      merged.ir.context = enrichment.context.trim();
      appliedFields.context = true;
    }
  }

  const normalizedOutputFormat = normalizeOutputFormat(
    enrichment.output_format,
  );
  if (isNonEmptyString(enrichment.output_format)) {
    if (merged.ir.output_format.trim()) {
      rejectedFields.output_format =
        "Existing deterministic output format already present.";
    } else if (!normalizedOutputFormat) {
      rejectedFields.output_format =
        "Rejected because output format could not be normalized.";
    } else {
      merged.ir.output_format = normalizedOutputFormat;
      appliedFields.output_format = true;
    }
  }

  if (isNonEmptyString(enrichment.audience)) {
    if (merged.ir.audience !== "general") {
      rejectedFields.audience =
        "Existing deterministic audience already present.";
    } else {
      merged.ir.audience = enrichment.audience.trim();
      appliedFields.audience = true;
    }
  }

  if (isNonEmptyString(enrichment.tone)) {
    const normalizedTone = enrichment.tone.trim();

    if (merged.ir.tone !== "neutral") {
      rejectedFields.tone = "Existing deterministic tone already present.";
    } else if (merged.ir.tone === normalizedTone) {
      rejectedFields.tone =
        "Rejected because the enriched tone matched the existing deterministic tone.";
    } else {
      merged.ir.tone = normalizedTone;
      appliedFields.tone = true;
    }
  }

  if (Array.isArray(enrichment.constraints)) {
    const normalizedConstraints = normalizeArray(enrichment.constraints);

    if (merged.ir.constraints.length > 0) {
      rejectedFields.constraints =
        "Existing deterministic constraints already present.";
    } else if (normalizedConstraints.length === 0) {
      rejectedFields.constraints =
        "Rejected because no usable constraints remained after normalization.";
    } else {
      merged.ir.constraints = normalizedConstraints;
      appliedFields.constraints = true;
    }
  }

  if (Array.isArray(enrichment.steps)) {
    const normalizedSteps = normalizeArray(enrichment.steps);

    if (merged.ir.steps.length > 1) {
      rejectedFields.steps = "Existing deterministic steps already present.";
    } else if (normalizedSteps.length === 0) {
      rejectedFields.steps =
        "Rejected because no usable steps remained after normalization.";
    } else {
      merged.ir.steps = normalizedSteps;
      appliedFields.steps = true;
    }
  }

  merged.intent = merged.ir.goal;
  merged.audience = merged.ir.audience;
  merged.constraints = [...merged.ir.constraints];

  const mergedAnyField = Object.values(appliedFields).some(Boolean);

  merged.metadata = {
    ...merged.metadata,
    enrichment: {
      ...(merged.metadata.enrichment ?? {}),
      merged: mergedAnyField,
      used: mergedAnyField,
      applied_fields: appliedFields,
      rejected_fields: rejectedFields,
      raw: enrichment,
    },
  };

  return merged;
}
