import {
  classifyInstructions,
  looksLikeStep,
} from "./instruction-segmentation.js";
import { createEmptyPromptIr, createEmptyPromptObject } from "../ir/schema.js";
import { createFingerprint } from "../utils/fingerprint.js";
import { estimateTokens } from "../utils/tokens.js";
import { normalizePromptInput } from "./normalize.js";
import { cleanPromptInput, mergeEnrichment } from "./clean.js";
import { lintPrompt } from "./lint.js";
import {
  detectAudience,
  detectConstraints,
  detectDocumentSignals,
  detectGoal,
  detectLanguage,
  detectOutputFormat,
  detectSteps,
  detectTone,
  computeComplexityScore,
  classifySentences,
} from "./analyze.js";
import { enrichPromptObject } from "./enrich.js";

function dedupe(values) {
  return [...new Set(values.filter(Boolean))];
}

function inferOutputFormatFromInstructions(outputInstructions) {
  const joined = outputInstructions.join(" ").toLowerCase();

  if (
    /\bbullet(?:ed)? list\b/.test(joined) ||
    /\bbullet points?\b/.test(joined) ||
    /\bbullets?\b/.test(joined) ||
    /\b\d+\s+bullets?\b/.test(joined) ||
    /\b\d+\s+bullet points?\b/.test(joined)
  ) {
    return "bullet_list";
  }

  if (/\bnumbered list\b/.test(joined)) {
    return "numbered_list";
  }

  if (/\bjson\b/.test(joined)) {
    return "json";
  }

  if (/\bmarkdown\b/.test(joined)) {
    return "markdown";
  }

  if (/\btable\b/.test(joined)) {
    return "table";
  }

  if (/\bsummary\b/.test(joined)) {
    return "summary";
  }

  return "";
}

function isOutputInstruction(value) {
  return inferOutputFormatFromInstructions([value]) !== "";
}

function deriveStepsFromOutputInstructions(outputInstructions) {
  return outputInstructions
    .map((clause) => {
      const lower = clause.toLowerCase();

      const numericMatch = lower.match(/\b(\d+)\s+bullets?\b/);
      if (numericMatch) {
        return `Provide ${numericMatch[1]} key points`;
      }

      if (/\bbullet/.test(lower)) {
        return "Provide key points";
      }

      if (/\bsummary/.test(lower)) {
        return "Provide a concise summary";
      }

      if (/\bjson/.test(lower)) {
        return "Return structured JSON output";
      }

      if (/\btable/.test(lower)) {
        return "Present results in a table";
      }

      return null;
    })
    .filter(Boolean);
}

function deriveStepFromGoal(goal) {
  if (!goal) return null;

  const lower = goal.toLowerCase();

  if (/^tell\b/.test(lower)) return "Provide explanation";
  if (/^explain\b/.test(lower)) return "Explain the topic clearly";
  if (/^compare\b/.test(lower)) return "Compare key aspects";
  if (/^describe\b/.test(lower)) return "Describe the subject";
  if (/^list\b/.test(lower)) return "List key items";
  if (/^analyze\b/.test(lower)) return "Analyze the subject";
  if (/^summarize\b/.test(lower)) return "Summarize key points";

  return "Provide a complete answer";
}

function collectStepCandidates(detectedSteps, instructionClassification) {
  const additionalGoals = instructionClassification.additionalGoals.filter(
    (clause) => !isOutputInstruction(clause),
  );

  const unknownSteps = instructionClassification.unknown.filter(
    (clause) => looksLikeStep(clause) && !isOutputInstruction(clause),
  );

  const inferredFromOutput = deriveStepsFromOutputInstructions(
    instructionClassification.outputInstructions || [],
  );

  const combined =
    detectedSteps.length > 0
      ? [
          ...detectedSteps,
          ...additionalGoals,
          ...inferredFromOutput,
        ]
      : [
          ...additionalGoals,
          ...unknownSteps,
          ...inferredFromOutput,
        ];

  const deduped = dedupe(combined);

  // 🔥 NEW: fallback from goal if still empty
  if (deduped.length === 0 && instructionClassification.goal) {
    const fallback = deriveStepFromGoal(instructionClassification.goal);
    return fallback ? [fallback] : [];
  }

  return deduped;
}

function buildDeterministicPromptObject(raw, cleaned, options = {}) {
  const documentSignals = detectDocumentSignals(cleaned);
  const sentenceClassification = classifySentences(cleaned);

  const instructionClassification = classifyInstructions(cleaned);

  const ir = createEmptyPromptIr();
  ir.goal = instructionClassification.goal || detectGoal(cleaned);
  ir.audience = detectAudience(cleaned);

  ir.context =
    instructionClassification.context.length > 0
      ? instructionClassification.context.join(" ")
      : "";

  const detectedConstraints = detectConstraints(cleaned);
  ir.constraints =
    instructionClassification.constraints.length > 0
      ? dedupe([
          ...instructionClassification.constraints,
          ...detectedConstraints,
        ])
      : detectedConstraints;

  const detectedSteps = detectSteps(cleaned);
  ir.steps = collectStepCandidates(detectedSteps, instructionClassification);

  const detectedOutputFormat = detectOutputFormat(cleaned);
  ir.output_format =
    detectedOutputFormat ||
    inferOutputFormatFromInstructions(
      instructionClassification.outputInstructions,
    );

  const detectedTone = detectTone(cleaned);
  ir.tone =
    instructionClassification.tone.length > 0
      ? instructionClassification.tone.join(", ")
      : detectedTone;

  ir.language = detectLanguage(cleaned);
  ir.tokens = {
    input: estimateTokens(cleaned),
  };
  ir.metadata = {
    source: options.source ?? "unknown",
    path: options.path ?? null,
  };

  const promptObject = createEmptyPromptObject();
  promptObject.raw = raw;
  promptObject.cleaned = cleaned;
  promptObject.ir = ir;
  promptObject.intent = ir.goal;
  promptObject.audience = ir.audience;
  promptObject.constraints = [...ir.constraints];
  promptObject.tokens = {
    input: estimateTokens(cleaned),
  };
  promptObject.complexity_score = computeComplexityScore({
    steps: ir.steps,
    constraints: ir.constraints,
    outputFormat: ir.output_format,
  });
  promptObject.semantic_drift_risk = documentSignals.looks_like_document
    ? "medium"
    : "low";
  promptObject.fingerprint = createFingerprint(cleaned);
  promptObject.language = ir.language;
  promptObject.metadata = {
    source: options.source ?? "unknown",
    path: options.path ?? null,
    document_signals: documentSignals,
    sentence_classification: sentenceClassification,
    instruction_classification: instructionClassification,
    bias_request: {
  detected:
    instructionClassification.bias.length > 0 ||
    (instructionClassification.biasSignals?.length ?? 0) > 0,
  directives: instructionClassification.bias,
  signals: instructionClassification.biasSignals ?? [],
},
    enrichment: {
      requested: false,
      succeeded: false,
      merged: false,
      used: false,
      reason: null,
      health: null,
      applied_fields: {},
      raw: null,
    },
  };
  promptObject.lint_warnings = lintPrompt(promptObject);

  return promptObject;
}

export async function runPipeline(input, options = {}) {
  const raw = typeof input === "string" ? input : "";
  const normalized = normalizePromptInput(raw);
  const cleaned = await cleanPromptInput(normalized);

  let promptObject = buildDeterministicPromptObject(raw, cleaned, options);

  if (options.enrich === true) {
    const enrichmentResult = await enrichPromptObject(promptObject);

    promptObject.metadata = {
      ...promptObject.metadata,
      enrichment: {
        ...(promptObject.metadata.enrichment ?? {}),
        requested: enrichmentResult.requested,
        succeeded: enrichmentResult.succeeded,
        merged: false,
        used: false,
        reason: enrichmentResult.reason,
        health: enrichmentResult.health,
        applied_fields: {},
        raw: enrichmentResult.enrichment,
      },
    };

    if (enrichmentResult.succeeded && enrichmentResult.enrichment) {
      promptObject = mergeEnrichment(promptObject, enrichmentResult.enrichment);
      promptObject.lint_warnings = lintPrompt(promptObject);
    }
  }

  return promptObject;
}
