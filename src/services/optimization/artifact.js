function clone(value) {
  return structuredClone(value);
}

function countTokensFromText(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }

  return text.split(/\s+/).filter(Boolean).length;
}

export function buildOptimizedPromptArtifactFromSource(
  promptObject,
  optimizationResult,
  options = {},
) {
  const optimizedPrompt = optimizationResult.optimization.optimized_prompt;
  const optimizedTokens =
    optimizationResult.optimization.token_comparison.optimized_tokens ??
    countTokensFromText(optimizedPrompt);

  const artifact = clone(promptObject);

  artifact.raw = optimizedPrompt;
  artifact.cleaned = optimizedPrompt;

  artifact.tokens = {
    ...(artifact.tokens ?? {}),
    input: optimizedTokens,
  };

  artifact.ir = {
    ...clone(promptObject.ir ?? {}),
    tokens: {
      ...(promptObject.ir?.tokens ?? {}),
      input: optimizedTokens,
    },
    variants: {
      ...(promptObject.ir?.variants ?? {}),
    },
    metadata: {
      ...(promptObject.ir?.metadata ?? {}),
      source: options.sourceType ?? "optimized_prompt",
      path: options.path ?? null,
    },
  };

  artifact.metadata = {
    ...(artifact.metadata ?? {}),
    source: options.sourceType ?? "optimized_prompt",
    path: options.path ?? null,
    optimization: {
      source_fingerprint: promptObject.fingerprint ?? null,
      source_intent: promptObject.intent ?? "",
      method: options.method ?? "deterministic_compact",
      original_mode: optimizationResult.optimization.original_mode,
      optimized_mode: optimizationResult.optimization.optimized_mode,
      original_tokens:
        optimizationResult.optimization.token_comparison.original_tokens,
      optimized_tokens:
        optimizationResult.optimization.token_comparison.optimized_tokens,
      saved_tokens:
        optimizationResult.optimization.token_comparison.saved_tokens,
      saved_percent:
        optimizationResult.optimization.token_comparison.saved_percent,
      semantic_drift_risk: optimizationResult.optimization.semantic_drift_risk,
      missing_signals: optimizationResult.optimization.missing_signals ?? [],
    },
  };

  artifact.fingerprint = options.preserveFingerprint
    ? (promptObject.fingerprint ?? artifact.fingerprint)
    : null;

  return artifact;
}
