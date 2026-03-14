function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "n/a";
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

function renderNotes(notes) {
  if (!notes || notes.length === 0) {
    return "(none)";
  }

  return notes.map((note) => `- ${note}`).join("\n");
}

function renderEvaluationMarkdown(runArtifact, evaluation) {
  const lines = [];

  lines.push("# PromptWash Evaluation Report");
  lines.push("");
  lines.push(`Run ID: ${runArtifact.run_id}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Provider: ${formatValue(runArtifact.execution?.provider)}`);
  lines.push(`- Model: ${formatValue(runArtifact.execution?.model)}`);
  lines.push(`- Intent: ${formatValue(runArtifact.prompt?.intent)}`);
  lines.push(`- Audience: ${formatValue(runArtifact.prompt?.audience)}`);
  lines.push(`- Overall score: ${evaluation.overall_score}`);
  lines.push(`- Overall level: ${evaluation.overall_level}`);
  lines.push("");

  lines.push("## Dimension Scores");
  lines.push("");
  for (const [name, data] of Object.entries(evaluation.dimensions)) {
    lines.push(`### ${name}`);
    lines.push("");
    lines.push(`- Score: ${data.score}`);
    lines.push(`- Notes:`);
    lines.push(renderNotes(data.notes));
    lines.push("");
  }

  lines.push("## Recommendations");
  lines.push("");
  lines.push(renderNotes(evaluation.recommendations));
  lines.push("");

  lines.push("## Response");
  lines.push("");
  lines.push("```text");
  lines.push(runArtifact.output?.text ?? "");
  lines.push("```");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function renderEvaluationReport(runArtifact, evaluation, format = "json") {
  if (format === "json") {
    return `${JSON.stringify({ run: runArtifact, evaluation }, null, 2)}\n`;
  }

  return renderEvaluationMarkdown(runArtifact, evaluation);
}

export function getEvaluationReportFormatFromPath(pathValue) {
  return detectReportFormat(pathValue);
}
