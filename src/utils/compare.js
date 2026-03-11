function getLintCounts(promptObject) {
  const warnings = Array.isArray(promptObject.lint_warnings)
    ? promptObject.lint_warnings
    : [];

  return {
    total: warnings.length,
    errors: warnings.filter((item) => item.level === "error").length,
    warnings: warnings.filter((item) => item.level === "warning").length,
  };
}

function getBenchmarkVariant(benchmark, variantName = "generic") {
  return benchmark?.variants?.[variantName] ?? null;
}

function getEstimatedCost(benchmark, variantName = "generic") {
  const variant = getBenchmarkVariant(benchmark, variantName);
  return typeof variant?.estimated_cost === "number" ? variant.estimated_cost : null;
}

function getTokenCount(benchmark, variantName = "generic") {
  const variant = getBenchmarkVariant(benchmark, variantName);
  return typeof variant?.tokens === "number" ? variant.tokens : null;
}

function chooseLower(a, b, labelA, labelB) {
  if (a === null && b === null) {
    return null;
  }

  if (a === null) {
    return labelB;
  }

  if (b === null) {
    return labelA;
  }

  if (a < b) {
    return labelA;
  }

  if (b < a) {
    return labelB;
  }

  return "tie";
}

export function buildComparisonResult(leftResult, rightResult, options = {}) {
  const leftLabel = options.leftLabel ?? "left";
  const rightLabel = options.rightLabel ?? "right";

  const leftLint = leftResult.lint_summary ?? getLintCounts(leftResult);
  const rightLint = rightResult.lint_summary ?? getLintCounts(rightResult);

  const leftGenericTokens = getTokenCount(leftResult.benchmark, "generic");
  const rightGenericTokens = getTokenCount(rightResult.benchmark, "generic");

  const leftCompactTokens = getTokenCount(leftResult.benchmark, "compact");
  const rightCompactTokens = getTokenCount(rightResult.benchmark, "compact");

  const leftGenericCost = getEstimatedCost(leftResult.benchmark, "generic");
  const rightGenericCost = getEstimatedCost(rightResult.benchmark, "generic");

  const leftCompactCost = getEstimatedCost(leftResult.benchmark, "compact");
  const rightCompactCost = getEstimatedCost(rightResult.benchmark, "compact");

  return {
    left: {
      label: leftLabel,
      source: leftResult.source,
      path: leftResult.path,
      intent: leftResult.intent,
      complexity_score: leftResult.complexity_score,
      semantic_drift_risk: leftResult.semantic_drift_risk,
      lint_summary: leftLint,
      generic_tokens: leftGenericTokens,
      compact_tokens: leftCompactTokens,
      generic_cost: leftGenericCost,
      compact_cost: leftCompactCost,
    },
    right: {
      label: rightLabel,
      source: rightResult.source,
      path: rightResult.path,
      intent: rightResult.intent,
      complexity_score: rightResult.complexity_score,
      semantic_drift_risk: rightResult.semantic_drift_risk,
      lint_summary: rightLint,
      generic_tokens: rightGenericTokens,
      compact_tokens: rightCompactTokens,
      generic_cost: rightGenericCost,
      compact_cost: rightCompactCost,
    },
    deltas: {
      generic_tokens:
        leftGenericTokens !== null && rightGenericTokens !== null
          ? leftGenericTokens - rightGenericTokens
          : null,
      compact_tokens:
        leftCompactTokens !== null && rightCompactTokens !== null
          ? leftCompactTokens - rightCompactTokens
          : null,
      generic_cost:
        leftGenericCost !== null && rightGenericCost !== null
          ? Number((leftGenericCost - rightGenericCost).toFixed(6))
          : null,
      compact_cost:
        leftCompactCost !== null && rightCompactCost !== null
          ? Number((leftCompactCost - rightCompactCost).toFixed(6))
          : null,
      lint_total: leftLint.total - rightLint.total,
      lint_errors: leftLint.errors - rightLint.errors,
      lint_warnings: leftLint.warnings - rightLint.warnings,
    },
    winners: {
      generic_tokens: chooseLower(
        leftGenericTokens,
        rightGenericTokens,
        leftLabel,
        rightLabel,
      ),
      compact_tokens: chooseLower(
        leftCompactTokens,
        rightCompactTokens,
        leftLabel,
        rightLabel,
      ),
      generic_cost: chooseLower(
        leftGenericCost,
        rightGenericCost,
        leftLabel,
        rightLabel,
      ),
      compact_cost: chooseLower(
        leftCompactCost,
        rightCompactCost,
        leftLabel,
        rightLabel,
      ),
      lint_total: chooseLower(leftLint.total, rightLint.total, leftLabel, rightLabel),
    },
  };
}