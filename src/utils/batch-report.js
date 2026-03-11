export function renderBatchReport(batchResult, format = "json") {
  if (format === "json") {
    return `${JSON.stringify(batchResult, null, 2)}\n`;
  }

  const lines = [];

  lines.push("# PromptWash Batch Check Report");
  lines.push("");
  lines.push(`Generated: ${batchResult.generated_at}`);
  lines.push(`Target: ${batchResult.target}`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`- Total files: ${batchResult.summary.total_files}`);
  lines.push(`- Successful: ${batchResult.summary.successful}`);
  lines.push(`- Failed: ${batchResult.summary.failed}`);
  lines.push(`- Total warnings: ${batchResult.summary.total_warnings}`);
  lines.push(`- Total errors: ${batchResult.summary.total_errors}`);
  lines.push("");

  lines.push("## Files");
  lines.push("");

  for (const item of batchResult.results) {
    lines.push(`### ${item.path}`);
    lines.push("");

    if (!item.ok) {
      lines.push(`- Status: failed`);
      lines.push(`- Error: ${item.error.message}`);
      lines.push(`- Code: ${item.error.code ?? "UNKNOWN"}`);
      lines.push("");
      continue;
    }

    lines.push(`- Status: ok`);
    lines.push(`- Source: ${item.result.source}`);
    lines.push(`- Intent: ${item.result.intent}`);
    lines.push(`- Complexity score: ${item.result.complexity_score}`);
    lines.push(`- Token estimate: ${item.result.tokens?.input ?? "n/a"}`);
    lines.push(
      `- Lint summary: ${item.result.lint_summary?.errors ?? 0} errors, ${item.result.lint_summary?.warnings ?? 0} warnings`,
    );

    if (item.result.benchmark?.efficiency_summary?.lowest_token_variant) {
      lines.push(
        `- Lowest token variant: ${item.result.benchmark.efficiency_summary.lowest_token_variant.provider}`,
      );
    }

    if (Array.isArray(item.result.lint_warnings) && item.result.lint_warnings.length > 0) {
      lines.push("- Lint warnings:");
      for (const warning of item.result.lint_warnings) {
        lines.push(`  - [${warning.code}] ${warning.message}`);
      }
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}