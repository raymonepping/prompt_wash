import { adaptPrompt, scoreRenderedVariants } from "../../pipeline/adapt.js";

function assessSemanticDrift(promptObject, compactPrompt) {
  const requiredSignals = [
    promptObject.intent ?? "",
    ...(promptObject.constraints ?? []),
    promptObject.ir?.output_format ? [promptObject.ir.output_format] : [],
    promptObject.audience ?? "",
  ]
    .map((item) => String(item).trim().toLowerCase())
    .filter(Boolean);

  const compactLower = compactPrompt.toLowerCase();
  const missingSignals = requiredSignals.filter(
    (signal) => signal && !compactLower.includes(signal),
  );

  if (missingSignals.length === 0) {
    return {
      level: "low",
      missing_signals: [],
    };
  }

  if (missingSignals.length <= 2) {
    return {
      level: "medium",
      missing_signals: missingSignals,
    };
  }

  return {
    level: "high",
    missing_signals: missingSignals,
  };
}

function buildRecommendations(compactScore, drift) {
  const recommendations = [];

  if (compactScore.saved_tokens > 0) {
    recommendations.push(
      `Use the compact variant to save ${compactScore.saved_tokens} tokens (${compactScore.saved_percent}%).`,
    );
  } else {
    recommendations.push("No meaningful token savings detected yet.");
  }

  if (drift.level === "low") {
    recommendations.push("Compact optimization appears safe for normal use.");
  } else if (drift.level === "medium") {
    recommendations.push(
      "Review the compact prompt before production use because some intent signals may be weakened.",
    );
  } else {
    recommendations.push(
      "Do not use the compact prompt without manual review because semantic drift risk is elevated.",
    );
  }

  return recommendations;
}

export function optimizePromptObject(promptObject, options = {}) {
  const originalMode = options.originalMode ?? "generic";
  const optimizedMode = options.optimizedMode ?? "compact";

  const variants = {
    generic: adaptPrompt(promptObject, "generic"),
    compact: adaptPrompt(promptObject, "compact"),
    openai: adaptPrompt(promptObject, "openai"),
    claude: adaptPrompt(promptObject, "claude"),
  };

  const originalPrompt = variants[originalMode] ?? variants.generic;
  const optimizedPrompt = variants[optimizedMode] ?? variants.compact;
  const compactScore = scoreRenderedVariants(variants);
  const drift = assessSemanticDrift(promptObject, optimizedPrompt);

  return {
    source_prompt: {
      fingerprint: promptObject.fingerprint ?? null,
      intent: promptObject.intent ?? "",
      audience: promptObject.audience ?? "",
      output_format: promptObject.ir?.output_format ?? "",
    },
    optimization: {
      original_mode: originalMode,
      optimized_mode: optimizedMode,
      original_prompt: originalPrompt,
      optimized_prompt: optimizedPrompt,
      token_comparison: {
        original_tokens:
          originalMode === "generic"
            ? compactScore.generic_tokens
            : variants[originalMode]?.split(/\s+/).filter(Boolean).length ?? 0,
        optimized_tokens:
          optimizedMode === "compact"
            ? compactScore.compact_tokens
            : variants[optimizedMode]?.split(/\s+/).filter(Boolean).length ?? 0,
        saved_tokens:
          originalMode === "generic" && optimizedMode === "compact"
            ? compactScore.saved_tokens
            : Math.max(
                0,
                (variants[originalMode]?.split(/\s+/).filter(Boolean).length ?? 0) -
                  (variants[optimizedMode]?.split(/\s+/).filter(Boolean).length ?? 0),
              ),
        saved_percent:
          originalMode === "generic" && optimizedMode === "compact"
            ? compactScore.saved_percent
            : 0,
      },
      semantic_drift_risk: drift.level,
      missing_signals: drift.missing_signals,
      recommendations: buildRecommendations(compactScore, drift),
    },
    variants,
  };
}
