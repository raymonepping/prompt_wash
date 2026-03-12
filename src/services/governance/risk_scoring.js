import { resolveRiskRules } from "./risk_loader.js";

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

function evaluateCheck(checkName, promptObject) {
  switch (checkName) {
    case "missing_output_format":
      return !promptObject?.ir?.output_format?.trim();

    case "missing_constraints":
      return (
        !Array.isArray(promptObject?.constraints) ||
        promptObject.constraints.length === 0
      );

    case "missing_audience":
      return !promptObject?.audience || promptObject.audience === "general";

    default:
      return false;
  }
}

function evaluateCheckCategory(promptObject, category) {
  if (!category?.enabled) {
    return {
      matched: false,
      matches: [],
      score: 0,
    };
  }

  const checks = Array.isArray(category.checks) ? category.checks : [];
  const matches = checks.filter((checkName) =>
    evaluateCheck(checkName, promptObject),
  );

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

  if (results.matches.ambiguity.includes("missing_output_format")) {
    recommendations.push("Add an explicit output format.");
  }

  if (results.matches.ambiguity.includes("missing_constraints")) {
    recommendations.push("Add constraints to reduce ambiguity.");
  }

  if (results.matches.ambiguity.includes("missing_audience")) {
    recommendations.push("Specify the intended audience.");
  }

  if (results.signals.prompt_injection) {
    recommendations.push(
      "Remove instruction-override language such as attempts to ignore prior instructions.",
    );
  }

  if (results.signals.manipulation) {
    recommendations.push(
      "Remove manipulative or safeguard-bypassing language.",
    );
  }

  if (results.signals.compliance_risk) {
    recommendations.push(
      "Review the prompt for compliance-sensitive phrasing.",
    );
  }

  return recommendations;
}

export async function analyzePromptRisk(promptObject) {
  const rules = await resolveRiskRules();
  const categories = rules.categories ?? {};
  const text = normalizeText(promptObject);

  const patternResults = {
    prompt_injection: evaluatePatternCategory(
      text,
      categories.prompt_injection,
    ),
    manipulation: evaluatePatternCategory(text, categories.manipulation),
    compliance_risk: evaluatePatternCategory(text, categories.compliance_risk),
  };

  const checkResults = {
    ambiguity: evaluateCheckCategory(promptObject, categories.ambiguity),
  };

  const totalScore = Object.values(patternResults)
    .concat(Object.values(checkResults))
    .reduce((sum, item) => sum + (item.score ?? 0), 0);

  const result = {
    risk_score: Math.min(totalScore, 100),
    risk_level: scoreToLevel(Math.min(totalScore, 100), rules.thresholds),
    signals: {
      prompt_injection: patternResults.prompt_injection.matched,
      manipulation: patternResults.manipulation.matched,
      ambiguity: checkResults.ambiguity.matched,
      compliance_risk: patternResults.compliance_risk.matched,
    },
    matches: {
      prompt_injection: patternResults.prompt_injection.matches,
      manipulation: patternResults.manipulation.matches,
      ambiguity: checkResults.ambiguity.matches,
      compliance_risk: patternResults.compliance_risk.matches,
    },
    recommendations: [],
    rules_version: rules.version,
  };

  result.recommendations = buildRecommendations(result);

  return result;
}
