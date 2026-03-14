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

function renderWinner(label, side, leftId, rightId) {
  if (side === "left") {
    return `${label}: ${leftId}`;
  }

  if (side === "right") {
    return `${label}: ${rightId}`;
  }

  return `${label}: tie`;
}

function renderMarkdown(result) {
  const lines = [];

  lines.push("# PromptWash Run Comparison Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");

  lines.push("## Runs");
  lines.push("");
  lines.push(`- Left: ${result.left.run_id}`);
  lines.push(`- Right: ${result.right.run_id}`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Left overall score: ${result.left.overall_score} (${result.left.overall_level})`);
  lines.push(`- Right overall score: ${result.right.overall_score} (${result.right.overall_level})`);
  lines.push("");

  lines.push("## Winners");
  lines.push("");
  lines.push(`- ${renderWinner("Latency", result.winners.latency_ms, result.left.run_id, result.right.run_id)}`);
  lines.push(`- ${renderWinner("Rendered prompt tokens", result.winners.rendered_prompt_tokens, result.left.run_id, result.right.run_id)}`);
  lines.push(`- ${renderWinner("Overall score", result.winners.overall_score, result.left.run_id, result.right.run_id)}`);
  lines.push(`- ${renderWinner("Clarity", result.winners.clarity, result.left.run_id, result.right.run_id)}`);
  lines.push(`- ${renderWinner("Structure", result.winners.structure, result.left.run_id, result.right.run_id)}`);
  lines.push(`- ${renderWinner("Constraint adherence", result.winners.constraint_adherence, result.left.run_id, result.right.run_id)}`);
  lines.push(`- ${renderWinner("Audience fit", result.winners.audience_fit, result.left.run_id, result.right.run_id)}`);
  lines.push("");

  lines.push("## Deltas");
  lines.push("");
  lines.push(`- Latency delta: ${result.deltas.latency_ms}`);
  lines.push(`- Rendered prompt token delta: ${result.deltas.rendered_prompt_tokens}`);
  lines.push(`- Overall score delta: ${result.deltas.overall_score}`);
  lines.push(`- Clarity delta: ${result.deltas.clarity}`);
  lines.push(`- Structure delta: ${result.deltas.structure}`);
  lines.push(`- Constraint adherence delta: ${result.deltas.constraint_adherence}`);
  lines.push(`- Audience fit delta: ${result.deltas.audience_fit}`);
  lines.push("");

  lines.push("## Recommendations");
  lines.push("");
  for (const recommendation of result.recommendations) {
    lines.push(`- ${recommendation}`);
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function renderRunComparisonReport(result, format = "json") {
  if (format === "json") {
    return `${JSON.stringify(result, null, 2)}\n`;
  }

  return renderMarkdown(result);
}

export function getRunComparisonReportFormatFromPath(pathValue) {
  return detectReportFormat(pathValue);
}
