import { resolveBiasRules } from "./bias_loader.js";

function normalizePatternEntry(entry) {
  if (typeof entry === "string") {
    return {
      type: "literal",
      value: entry.toLowerCase(),
    };
  }

  if (
    entry &&
    typeof entry === "object" &&
    entry.type === "regex" &&
    typeof entry.value === "string"
  ) {
    return {
      type: "regex",
      value: entry.value,
      flags: typeof entry.flags === "string" ? entry.flags : "i",
    };
  }

  return null;
}

function matchPattern(text, entry) {
  const normalized = normalizePatternEntry(entry);

  if (!normalized) {
    return null;
  }

  if (normalized.type === "literal") {
    return text.includes(normalized.value) ? normalized.value : null;
  }

  try {
    const regex = new RegExp(normalized.value, normalized.flags);
    const match = text.match(regex);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

function normalizeText(promptObject) {
  const instructionClassification =
    promptObject?.metadata?.instruction_classification ?? {};
  const biasRequest = promptObject?.metadata?.bias_request ?? {};
  const comparisonRequest = promptObject?.metadata?.comparison_request ?? {};

  const parts = [
    promptObject?.raw ?? "",
    promptObject?.cleaned ?? "",
    promptObject?.intent ?? "",
    promptObject?.ir?.goal ?? "",
    ...(promptObject?.constraints ?? []),
    ...(instructionClassification.comparison ?? []),
    ...(instructionClassification.bias ?? []),
    ...(biasRequest.directives ?? []),
    ...(comparisonRequest.directives ?? []),
  ];

  return parts.join("\n").toLowerCase();
}

function evaluatePatternCategory(text, category) {
  if (!category?.enabled) {
    return {
      matched: false,
      matches: [],
      score: 0,
    };
  }

  const patterns = Array.isArray(category.patterns) ? category.patterns : [];
  const matches = patterns
    .map((pattern) => matchPattern(text, pattern))
    .filter(Boolean);

  return {
    matched: matches.length > 0,
    matches,
    score: matches.length > 0 ? category.weight : 0,
  };
}

function scoreToLevel(score, thresholds) {
  if (score <= thresholds.very_low) {
    return "very_low";
  }

  if (score <= thresholds.low) {
    return "low";
  }

  if (score <= thresholds.medium) {
    return "medium";
  }

  if (score <= thresholds.high) {
    return "high";
  }

  return "critical";
}

function buildRecommendations(results) {
  const recommendations = [];

  if (results.signals.outcome_steering) {
    recommendations.push(
      "Remove predetermined conclusion language and frame the request as an open evaluation.",
    );
  }

  if (results.signals.vendor_bias) {
    recommendations.push(
      "Reframe the comparison to avoid pre-selecting a winner between vendors or products.",
    );
  }

  if (results.signals.advocacy_language) {
    recommendations.push(
      "Replace advocacy language with neutral analytical wording.",
    );
  }

  if (results.signals.forced_recommendation) {
    recommendations.push(
      "Avoid forcing a recommendation before the comparison is complete.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("No obvious framing bias detected.");
  }

  return recommendations;
}

export async function analyzePromptBias(promptObject) {
  const rules = await resolveBiasRules();
  const categories = rules.categories ?? {};
  const text = normalizeText(promptObject);
  const biasRequest = promptObject?.metadata?.bias_request ?? {};
  const comparisonRequest = promptObject?.metadata?.comparison_request ?? {};

  const patternResults = {
    outcome_steering: evaluatePatternCategory(
      text,
      categories.outcome_steering,
    ),
    vendor_bias: evaluatePatternCategory(text, categories.vendor_bias),
    advocacy_language: evaluatePatternCategory(
      text,
      categories.advocacy_language,
    ),
    forced_recommendation: evaluatePatternCategory(
      text,
      categories.forced_recommendation,
    ),
  };

  const metadataOutcomeSteering =
    (Array.isArray(biasRequest.signals) &&
      biasRequest.signals.includes("outcome_steering")) ||
    comparisonRequest.detected === true;

  const metadataBiasMatches = [
    ...(Array.isArray(biasRequest.directives) ? biasRequest.directives : []),
    ...(Array.isArray(comparisonRequest.directives)
      ? comparisonRequest.directives
      : []),
  ];

  const results = {
    outcome_steering: {
      matched:
        patternResults.outcome_steering.matched || metadataOutcomeSteering,
      matches: [
        ...patternResults.outcome_steering.matches,
        ...metadataBiasMatches,
      ],
      score:
        patternResults.outcome_steering.score ||
        (metadataOutcomeSteering
          ? (categories.outcome_steering?.weight ?? 0)
          : 0),
    },
    vendor_bias: patternResults.vendor_bias,
    advocacy_language: patternResults.advocacy_language,
    forced_recommendation: patternResults.forced_recommendation,
  };

  const totalScore = Object.values(results).reduce(
    (sum, item) => sum + (item.score ?? 0),
    0,
  );

  const clampedScore = Math.min(totalScore, 100);

  const bias = {
    bias_score: clampedScore,
    bias_level: scoreToLevel(clampedScore, rules.thresholds),
    signals: {
      outcome_steering: results.outcome_steering.matched,
      vendor_bias: results.vendor_bias.matched,
      advocacy_language: results.advocacy_language.matched,
      forced_recommendation: results.forced_recommendation.matched,
    },
    matches: {
      outcome_steering: [...new Set(results.outcome_steering.matches)],
      vendor_bias: [...new Set(results.vendor_bias.matches)],
      advocacy_language: [...new Set(results.advocacy_language.matches)],
      forced_recommendation: [
        ...new Set(results.forced_recommendation.matches),
      ],
    },
    recommendations: [],
    rules_version: rules.version,
  };

  bias.recommendations = buildRecommendations(bias);

  return bias;
}
