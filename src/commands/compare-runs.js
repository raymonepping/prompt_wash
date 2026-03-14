import {
  printInfo,
  printJson,
  printSuccess,
} from "../utils/display.js";
import { writeFileUtf8 } from "../utils/input.js";
import { createValidationError } from "../utils/errors.js";
import { loadExecutionArtifact } from "../services/execution/storage.js";
import { compareRunArtifacts } from "../services/evaluation/compare-runs.js";
import {
  getRunComparisonReportFormatFromPath,
  renderRunComparisonReport,
} from "../utils/compare-runs-report.js";

export function registerCompareRunsCommand(program) {
  program
    .command("compare-runs")
    .description("Compare two saved execution runs")
    .argument("<leftRunId>", "Left execution run id")
    .argument("<rightRunId>", "Right execution run id")
    .option("--report <path>", "Write a JSON or Markdown comparison report to a file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (leftRunId, rightRunId, options) => {
      const leftArtifact = await loadExecutionArtifact(leftRunId);
      const rightArtifact = await loadExecutionArtifact(rightRunId);

      if (!leftArtifact) {
        throw createValidationError(`Execution run not found: ${leftRunId}`);
      }

      if (!rightArtifact) {
        throw createValidationError(`Execution run not found: ${rightRunId}`);
      }

      const comparison = compareRunArtifacts(leftArtifact, rightArtifact);

      if (options.report) {
        const reportFormat = getRunComparisonReportFormatFromPath(options.report);
        const reportContent = renderRunComparisonReport(comparison, reportFormat);
        await writeFileUtf8(options.report, reportContent);
      }

      const result = {
        command: "compare-runs",
        left_run_id: leftRunId,
        right_run_id: rightRunId,
        report_path: options.report ?? null,
        comparison,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Run comparison completed successfully");
      printInfo(`Left run: ${leftRunId}`);
      printInfo(`Right run: ${rightRunId}`);
      if (options.report) {
        printInfo(`Comparison report written: ${options.report}`);
      }

      console.log("");
      console.log("Winners:");
      console.log(
        `- Latency: ${comparison.winners.latency_ms === "tie" ? "tie" : comparison[comparison.winners.latency_ms].run_id}`,
      );
      console.log(
        `- Overall score: ${comparison.winners.overall_score === "tie" ? "tie" : comparison[comparison.winners.overall_score].run_id}`,
      );
      console.log(
        `- Constraint adherence: ${comparison.winners.constraint_adherence === "tie" ? "tie" : comparison[comparison.winners.constraint_adherence].run_id}`,
      );

      console.log("");
      console.log("Recommendations:");
      for (const recommendation of comparison.recommendations) {
        console.log(`- ${recommendation}`);
      }
    });
}
