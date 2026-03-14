import {
  printInfo,
  printJson,
  printSuccess,
  printWarning,
} from "../utils/display.js";
import { writeFileUtf8 } from "../utils/input.js";
import { createValidationError } from "../utils/errors.js";
import { loadExecutionArtifact } from "../services/execution/storage.js";
import { evaluateRunArtifact } from "../services/evaluation/evaluate.js";
import {
  getEvaluationReportFormatFromPath,
  renderEvaluationReport,
} from "../utils/evaluation-report.js";

export function registerEvaluateCommand(program) {
  program
    .command("evaluate")
    .description("Evaluate a saved execution run deterministically")
    .argument("<runId>", "Execution run id")
    .option("--report <path>", "Write a JSON or Markdown evaluation report to a file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (runId, options) => {
      const runArtifact = await loadExecutionArtifact(runId);

      if (!runArtifact) {
        throw createValidationError(`Execution run not found: ${runId}`);
      }

      const evaluation = evaluateRunArtifact(runArtifact);

      if (options.report) {
        const reportFormat = getEvaluationReportFormatFromPath(options.report);
        const reportContent = renderEvaluationReport(
          runArtifact,
          evaluation,
          reportFormat,
        );
        await writeFileUtf8(options.report, reportContent);
      }

      const result = {
        command: "evaluate",
        run_id: runId,
        report_path: options.report ?? null,
        evaluation,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (evaluation.overall_score < 50) {
        printWarning("Run evaluated with weak overall quality");
      } else {
        printSuccess("Run evaluated successfully");
      }

      printInfo(`Run ID: ${runArtifact.run_id}`);
      printInfo(`Overall score: ${evaluation.overall_score}`);
      printInfo(`Overall level: ${evaluation.overall_level}`);
      if (options.report) {
        printInfo(`Evaluation report written: ${options.report}`);
      }

      console.log("");
      console.log("Dimension scores:");
      for (const [name, data] of Object.entries(evaluation.dimensions)) {
        console.log(`- ${name}: ${data.score}`);
      }

      console.log("");
      console.log("Recommendations:");
      if (evaluation.recommendations.length === 0) {
        console.log("(none)");
      } else {
        for (const recommendation of evaluation.recommendations) {
          console.log(`- ${recommendation}`);
        }
      }
    });
}
