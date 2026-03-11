const FILLER_PATTERNS = [
  /\bjust\b/gi,
  /\bactually\b/gi,
  /\bmaybe\b/gi,
  /\bkind of\b/gi,
  /\bsort of\b/gi,
  /\bplease\b/gi
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
  return Array.isArray(value) && value.some((item) => typeof item === "string" && item.trim());
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

function looksUsefulContext(value, currentGoal = "") {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const cleaned = value.trim();
  const wordCount = cleaned.split(/\s+/).length;

  if (wordCount < 3) {
    return false;
  }

  if (looksConstraintLike(cleaned)) {
    return false;
  }

  if (looksOutputLike(cleaned)) {
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
    steps: false
  };

  if (isNonEmptyString(enrichment.goal) && merged.ir.goal.trim().length < 12) {
    merged.ir.goal = enrichment.goal.trim();
    appliedFields.goal = true;
  }

  if (looksUsefulContext(enrichment.context, merged.ir.goal) && !merged.ir.context.trim()) {
    merged.ir.context = enrichment.context.trim();
    appliedFields.context = true;
  }

  const normalizedOutputFormat = normalizeOutputFormat(enrichment.output_format);
  if (normalizedOutputFormat && !merged.ir.output_format.trim()) {
    merged.ir.output_format = normalizedOutputFormat;
    appliedFields.output_format = true;
  }

  if (isNonEmptyString(enrichment.audience) && merged.ir.audience === "general") {
    merged.ir.audience = enrichment.audience.trim();
    appliedFields.audience = true;
  }

  if (isNonEmptyString(enrichment.tone) && merged.ir.tone === "neutral") {
    merged.ir.tone = enrichment.tone.trim();
    appliedFields.tone = true;
  }

  if (isUsefulArray(enrichment.constraints) && merged.ir.constraints.length === 0) {
    merged.ir.constraints = enrichment.constraints
      .map((item) => item.trim())
      .filter(Boolean);
    appliedFields.constraints = true;
  }

  if (isUsefulArray(enrichment.steps) && merged.ir.steps.length <= 1) {
    merged.ir.steps = enrichment.steps
      .map((item) => item.trim())
      .filter(Boolean);
    appliedFields.steps = true;
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
      raw: enrichment
    }
  };

  return merged;
}