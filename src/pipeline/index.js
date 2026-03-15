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
  detectContext,
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

function trimGoalClause(clause) {
  return clause
    .replace(/\bprovide me as much detail as possible\b.*$/i, "")
    .replace(/\bbe as specific as possible\b.*$/i, "")
    .replace(/\bbrutally honest\b.*$/i, "")
    .replace(/\bfavor\b.*$/i, "")
    .trim();
}

function buildDeterministicPromptObject(raw, cleaned, options = {}) {
  const documentSignals = detectDocumentSignals(cleaned);
  const sentenceClassification = classifySentences(cleaned);

  const instructionClassification = classifyInstructions(cleaned);

  const ir = createEmptyPromptIr();
  ir.goal = instructionClassification.goal || detectGoal(cleaned);
  ir.audience = detectAudience(cleaned);

  const detectedContext = detectContext(cleaned);
  ir.context =
    instructionClassification.context.length > 0
      ? instructionClassification.context.join(" ")
      : "";

  const detectedConstraints = detectConstraints(cleaned);
  ir.constraints =
    instructionClassification.constraints.length > 0
      ? Array.from(
          new Set([
            ...instructionClassification.constraints,
            ...detectedConstraints,
          ]),
        )
      : detectedConstraints;

  const detectedSteps = detectSteps(cleaned);
  ir.steps =
    detectedSteps.length > 0
      ? detectedSteps
      : instructionClassification.unknown.filter((clause) =>
          looksLikeStep(clause),
        );
  ir.output_format = detectOutputFormat(cleaned);

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
      detected: instructionClassification.bias.length > 0,
      directives: instructionClassification.bias,
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
