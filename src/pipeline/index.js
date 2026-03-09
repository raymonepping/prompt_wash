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

function buildDeterministicPromptObject(raw, cleaned, options = {}) {
  const documentSignals = detectDocumentSignals(cleaned);
  const sentenceClassification = classifySentences(cleaned);

  const ir = createEmptyPromptIr();
  ir.goal = detectGoal(cleaned);
  ir.audience = detectAudience(cleaned);
  ir.context = detectContext(cleaned);
  ir.constraints = detectConstraints(cleaned);
  ir.steps = detectSteps(cleaned);
  ir.output_format = detectOutputFormat(cleaned);
  ir.tone = detectTone(cleaned);
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
    enrichment: {
      used: false,
      applied_fields: {},
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
        requested: true,
        ok: enrichmentResult.ok,
        reason: enrichmentResult.reason,
        health: enrichmentResult.health,
      },
    };

    if (enrichmentResult.ok && enrichmentResult.enrichment) {
      promptObject = mergeEnrichment(promptObject, enrichmentResult.enrichment);
      promptObject.lint_warnings = lintPrompt(promptObject);
    }
  }

  return promptObject;
}
