import { resolveBiasRules } from "./bias_loader.js";

function includesPattern(text, pattern) {
  return text.includes(pattern.toLowerCase());
}

function normalizeText(promptObject) {
  const parts = [
    promptObject?.raw ?? "",
    promptObject?.cleaned ?? "",
    promptObject?.intent ?? "",
    promptObject?.ir?.goal ?? "",
    ...(promptObject?.constraints ?? []),
    ...(promptObject?.ir?.steps ?? []),
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
  const matches = patterns.filter((pattern) => includesPattern(text, pattern));

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

  const results = {
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
      outcome_steering: results.outcome_steering.matches,
      vendor_bias: results.vendor_bias.matches,
      advocacy_language: results.advocacy_language.matches,
      forced_recommendation: results.forced_recommendation.matches,
    },
    recommendations: [],
    rules_version: rules.version,
  };

  bias.recommendations = buildRecommendations(bias);

  return bias;
}
