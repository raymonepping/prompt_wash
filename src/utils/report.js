function formatValue(value) {
  if (value === null || value === undefined) {
    return "n/a";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function detectReportFormat(pathValue) {
  const lower = pathValue.toLowerCase();

  if (lower.endsWith(".json")) {
    return "json";
  }

  if (lower.endsWith(".md") || lower.endsWith(".markdown")) {
    return "markdown";
  }

  return "json";
}

function renderLintWarningsMarkdown(lintWarnings) {
  if (!Array.isArray(lintWarnings) || lintWarnings.length === 0) {
    return "(none)";
  }

  return lintWarnings
    .map((warning) => `- [${warning.code}] ${warning.message}`)
    .join("\n");
}

function renderBenchmarkMarkdown(benchmark) {
  if (!benchmark) {
    return "(not requested)";
  }

  const lines = [];

  lines.push("### Variants");
  lines.push("");

  for (const [name, data] of Object.entries(benchmark.variants)) {
    lines.push(
      `- **${name}**: ${data.tokens} tokens | model: ${data.model} | estimated cost: ${data.estimated_cost ?? "n/a"}`,
    );
  }

  lines.push("");
  lines.push("### Efficiency");
  lines.push("");
  lines.push(
    `- Compact saved ${benchmark.compact_score.saved_tokens} tokens (${benchmark.compact_score.saved_percent}%)`,
  );

  if (benchmark.efficiency_summary?.lowest_token_variant) {
    lines.push(
      `- Lowest token variant: ${benchmark.efficiency_summary.lowest_token_variant.provider}`,
    );
  }

  if (benchmark.efficiency_summary?.highest_token_variant) {
    lines.push(
      `- Highest token variant: ${benchmark.efficiency_summary.highest_token_variant.provider}`,
    );
  }

  if (benchmark.efficiency_summary?.lowest_cost_variant) {
    lines.push(
      `- Lowest cost variant: ${benchmark.efficiency_summary.lowest_cost_variant.provider}`,
    );
  }

  lines.push("");
  lines.push("### Provider Health");
  lines.push("");

  if (benchmark.provider_health?.ollama) {
    lines.push(
      `- Ollama reachable: ${benchmark.provider_health.ollama.reachable ? "yes" : "no"}`,
    );
    lines.push(
      `- Ollama configured model installed: ${benchmark.provider_health.ollama.installed_model ? "yes" : "no"}`,
    );
  } else {
    lines.push("(not available)");
  }

  return lines.join("\n");
}

function renderBaselineMarkdown(baselineDiff) {
  if (!baselineDiff) {
    return "(not requested)";
  }

  const lines = [];

  lines.push(`- Intent change risk: ${baselineDiff.intent_change_risk}`);
  lines.push(`- Baseline intent: ${baselineDiff.baseline_intent}`);
  lines.push(`- Current intent: ${baselineDiff.current_intent}`);

  lines.push("- Added sentences:");
  if (!baselineDiff.added_sentences?.length) {
    lines.push("  - (none)");
  } else {
    for (const sentence of baselineDiff.added_sentences) {
      lines.push(`  - ${sentence}`);
    }
  }

  lines.push("- Removed sentences:");
  if (!baselineDiff.removed_sentences?.length) {
    lines.push("  - (none)");
  } else {
    for (const sentence of baselineDiff.removed_sentences) {
      lines.push(`  - ${sentence}`);
    }
  }

  return lines.join("\n");
}

function renderEnrichmentMarkdown(metadata, enrichRequested) {
  const enrichment = metadata?.enrichment ?? null;

  if (!enrichRequested && !enrichment?.requested) {
    return "(not requested)";
  }

  const lines = [];
  lines.push(`- Requested: ${enrichment?.requested ? "yes" : "no"}`);
  lines.push(`- Succeeded: ${enrichment?.succeeded ? "yes" : "no"}`);
  lines.push(`- Merged: ${enrichment?.merged ? "yes" : "no"}`);

  if (enrichment?.reason) {
    lines.push(`- Note: ${enrichment.reason}`);
  }

  const appliedFields = enrichment?.applied_fields ?? {};
  if (Object.keys(appliedFields).length > 0) {
    lines.push("- Applied fields:");
    for (const [field, applied] of Object.entries(appliedFields)) {
      lines.push(`  - ${field}: ${applied ? "accepted" : "not accepted"}`);
    }
  }

  return lines.join("\n");
}

function renderSummaryMarkdown(result) {
  const lines = [];

  lines.push("# PromptWash Check Report");
  lines.push("");
  lines.push(`Generated: ${result.report_metadata.generated_at}`);
  lines.push(`Fingerprint: ${result.report_metadata.fingerprint ?? "n/a"}`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Source: ${formatValue(result.source)}`);
  lines.push(`- Path: ${formatValue(result.path)}`);
  lines.push(`- Intent: ${formatValue(result.intent)}`);
  lines.push(`- Complexity score: ${formatValue(result.complexity_score)}`);
  lines.push(
    `- Semantic drift risk: ${formatValue(result.semantic_drift_risk)}`,
  );
  lines.push(`- Token estimate: ${formatValue(result.tokens?.input)}`);
  lines.push(
    `- Lint summary: ${formatValue(result.lint_summary?.errors)} errors, ${formatValue(result.lint_summary?.warnings)} warnings`,
  );
  lines.push("");

  lines.push("## Lint Warnings");
  lines.push("");
  lines.push(renderLintWarningsMarkdown(result.lint_warnings));
  lines.push("");

  lines.push("## Benchmark");
  lines.push("");
  lines.push(renderBenchmarkMarkdown(result.benchmark));
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function renderFullMarkdown(result) {
  const lines = [];

  lines.push("# PromptWash Check Report");
  lines.push("");
  lines.push(`Generated: ${result.report_metadata.generated_at}`);
  lines.push(`Fingerprint: ${result.report_metadata.fingerprint ?? "n/a"}`);
  lines.push(`Report mode: ${result.report_metadata.report_mode}`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Source: ${formatValue(result.source)}`);
  lines.push(`- Path: ${formatValue(result.path)}`);
  lines.push(`- Intent: ${formatValue(result.intent)}`);
  lines.push(`- Complexity score: ${formatValue(result.complexity_score)}`);
  lines.push(
    `- Semantic drift risk: ${formatValue(result.semantic_drift_risk)}`,
  );
  lines.push(`- Token estimate: ${formatValue(result.tokens?.input)}`);
  lines.push(
    `- Lint summary: ${formatValue(result.lint_summary?.errors)} errors, ${formatValue(result.lint_summary?.warnings)} warnings`,
  );
  lines.push("");

  lines.push("## Lint Warnings");
  lines.push("");
  lines.push(renderLintWarningsMarkdown(result.lint_warnings));
  lines.push("");

  lines.push("## Enrichment");
  lines.push("");
  lines.push(
    renderEnrichmentMarkdown(result.metadata, result.enrich_requested),
  );
  lines.push("");

  lines.push("## Baseline Diff");
  lines.push("");
  lines.push(renderBaselineMarkdown(result.baseline_diff));
  lines.push("");

  lines.push("## Benchmark");
  lines.push("");
  lines.push(renderBenchmarkMarkdown(result.benchmark));
  lines.push("");

  lines.push("## Metadata");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(result.metadata ?? {}, null, 2));
  lines.push("```");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function renderCheckReport(
  result,
  format = "json",
  reportMode = "full",
) {
  if (format === "json") {
    return `${JSON.stringify(result, null, 2)}\n`;
  }

  if (reportMode === "summary") {
    return renderSummaryMarkdown(result);
  }

  return renderFullMarkdown(result);
}

export function getReportFormatFromPath(pathValue) {
  return detectReportFormat(pathValue);
}
