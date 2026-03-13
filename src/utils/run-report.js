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

function renderExecutionMarkdown(artifact) {
  const lines = [];

  lines.push("# PromptWash Execution Report");
  lines.push("");
  lines.push(`Generated: ${artifact.created_at}`);
  lines.push(`Run ID: ${artifact.run_id}`);
  lines.push("");

  lines.push("## Prompt");
  lines.push("");
  lines.push(`- Fingerprint: ${formatValue(artifact.prompt?.fingerprint)}`);
  lines.push(`- Intent: ${formatValue(artifact.prompt?.intent)}`);
  lines.push(`- Audience: ${formatValue(artifact.prompt?.audience)}`);
  lines.push(`- Output format: ${formatValue(artifact.prompt?.output_format)}`);
  lines.push("");

  lines.push("## Source");
  lines.push("");
  lines.push(`- Type: ${formatValue(artifact.source?.type)}`);
  lines.push(`- Path: ${formatValue(artifact.source?.path)}`);
  lines.push("");

  lines.push("## Execution");
  lines.push("");
  lines.push(`- Provider: ${formatValue(artifact.execution?.provider)}`);
  lines.push(`- Model: ${formatValue(artifact.execution?.model)}`);
  lines.push(`- Render mode: ${formatValue(artifact.execution?.render_mode)}`);
  lines.push(`- Latency: ${formatValue(artifact.execution?.latency_ms)} ms`);
  lines.push("");

  lines.push("## Rendered Prompt");
  lines.push("");
  lines.push("```text");
  lines.push(artifact.input?.rendered_prompt ?? "");
  lines.push("```");
  lines.push("");

  lines.push("## Response");
  lines.push("");
  lines.push("```text");
  lines.push(artifact.output?.text ?? "");
  lines.push("```");
  lines.push("");

  lines.push("## Metadata");
  lines.push("");
  lines.push(`- Success: ${artifact.metadata?.success ? "yes" : "no"}`);
  lines.push(`- Error: ${formatValue(artifact.metadata?.error)}`);
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function renderExecutionReport(artifact, format = "json") {
  if (format === "json") {
    return `${JSON.stringify(artifact, null, 2)}\n`;
  }

  return renderExecutionMarkdown(artifact);
}

export function getExecutionReportFormatFromPath(pathValue) {
  return detectReportFormat(pathValue);
}
