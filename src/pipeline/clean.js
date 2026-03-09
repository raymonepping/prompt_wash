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

export function mergeEnrichment(promptObject, enrichment = {}) {
  const merged = structuredClone(promptObject);

  if (isNonEmptyString(enrichment.goal) && merged.ir.goal.trim().length < 12) {
    merged.ir.goal = enrichment.goal.trim();
  }

  if (isNonEmptyString(enrichment.context) && !merged.ir.context.trim()) {
    merged.ir.context = enrichment.context.trim();
  }

  if (isNonEmptyString(enrichment.output_format) && !merged.ir.output_format.trim()) {
    merged.ir.output_format = enrichment.output_format.trim();
  }

  if (isNonEmptyString(enrichment.audience) && merged.ir.audience === "general") {
    merged.ir.audience = enrichment.audience.trim();
  }

  if (isNonEmptyString(enrichment.tone) && merged.ir.tone === "neutral") {
    merged.ir.tone = enrichment.tone.trim();
  }

  if (isUsefulArray(enrichment.constraints) && merged.ir.constraints.length === 0) {
    merged.ir.constraints = enrichment.constraints
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (isUsefulArray(enrichment.steps) && merged.ir.steps.length <= 1) {
    merged.ir.steps = enrichment.steps
      .map((item) => item.trim())
      .filter(Boolean);
  }

  merged.intent = merged.ir.goal;
  merged.audience = merged.ir.audience;
  merged.constraints = [...merged.ir.constraints];

  merged.metadata = {
    ...merged.metadata,
    enrichment: {
      used: true,
      applied_fields: {
        goal: merged.ir.goal === enrichment.goal?.trim(),
        context: merged.ir.context === enrichment.context?.trim(),
        output_format: merged.ir.output_format === enrichment.output_format?.trim(),
        audience: merged.ir.audience === enrichment.audience?.trim(),
        tone: merged.ir.tone === enrichment.tone?.trim(),
        constraints:
          Array.isArray(enrichment.constraints) &&
          JSON.stringify(merged.ir.constraints) ===
            JSON.stringify(enrichment.constraints.map((item) => item.trim()).filter(Boolean)),
        steps:
          Array.isArray(enrichment.steps) &&
          JSON.stringify(merged.ir.steps) ===
            JSON.stringify(enrichment.steps.map((item) => item.trim()).filter(Boolean))
      },
      raw: enrichment
    }
  };

  return merged;
}