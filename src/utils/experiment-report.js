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

function renderMarkdown(result) {
  const lines = [];

  lines.push("# PromptWash Experiment Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Provider: ${result.provider}`);
  lines.push(`Variants: ${result.variants.join(", ")}`);
  lines.push(`Winner: ${result.winner}`);
  lines.push("");

  lines.push("## Runs");
  lines.push("");

  for (const run of result.runs) {
    lines.push(`### ${run.variant}`);
    lines.push("");
    lines.push(`- Run ID: ${run.run_id}`);
    lines.push(`- Model: ${run.model}`);
    lines.push(`- Latency: ${run.latency_ms} ms`);
    lines.push(`- Overall score: ${run.overall_score}`);
    lines.push(`- Overall level: ${run.overall_level}`);
    lines.push(`- Saved path: ${run.saved_path ?? "n/a"}`);
    lines.push("");
  }

  lines.push("## Comparison");
  lines.push("");
  lines.push(`- Latency winner: ${result.comparison.winners.latency_ms}`);
  lines.push(
    `- Overall score winner: ${result.comparison.winners.overall_score}`,
  );
  lines.push(
    `- Constraint adherence winner: ${result.comparison.winners.constraint_adherence}`,
  );
  lines.push("");

  lines.push("## Recommendations");
  lines.push("");
  for (const recommendation of result.comparison.recommendations) {
    lines.push(`- ${recommendation}`);
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function renderExperimentReport(result, format = "json") {
  if (format === "json") {
    return `${JSON.stringify(result, null, 2)}\n`;
  }

  return renderMarkdown(result);
}

export function getExperimentReportFormatFromPath(pathValue) {
  return detectReportFormat(pathValue);
}
