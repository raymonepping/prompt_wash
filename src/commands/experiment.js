import { printInfo, printJson, printSuccess } from "../utils/display.js";
import { resolveInputSource, writeFileUtf8 } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { runPromptExperiment } from "../services/experiments/run-experiment.js";
import {
  getExperimentReportFormatFromPath,
  renderExperimentReport,
} from "../utils/experiment-report.js";

export function registerExperimentCommand(program) {
  program
    .command("experiment")
    .description("Run a local experiment across prompt variants")
    .argument(
      "[input]",
      "Prompt text, PromptWash JSON, Prompt IR, or path to a file",
    )
    .option("-f, --file", "Treat input as a file path")
    .option("--provider <name>", "Execution provider", "ollama")
    .option("--save-runs", "Persist experiment run artifacts", false)
    .option(
      "--report <path>",
      "Write a JSON or Markdown experiment report to a file",
    )
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const result = await runPromptExperiment(promptObject, {
        provider: options.provider,
        saveRuns: options.saveRuns,
        source: {
          type: sourceType,
          path: resolved.path,
          lineage: null,
        },
        variants: ["generic", "compact"],
      });

      if (options.report) {
        const reportFormat = getExperimentReportFormatFromPath(options.report);
        const reportContent = renderExperimentReport(result, reportFormat);
        await writeFileUtf8(options.report, reportContent);
      }

      const payload = {
        command: "experiment",
        source: sourceType,
        path: resolved.path,
        report_path: options.report ?? null,
        result,
      };

      if (options.output === "json") {
        printJson(payload);
        return;
      }

      printSuccess("Experiment completed successfully");
      printInfo(`Provider: ${result.provider}`);
      printInfo(`Variants: ${result.variants.join(", ")}`);
      printInfo(`Winner: ${result.winner}`);
      if (options.report) {
        printInfo(`Experiment report written: ${options.report}`);
      }

      console.log("");
      console.log("Runs:");
      for (const run of result.runs) {
        console.log(
          `- ${run.variant}: score=${run.overall_score}, latency=${run.latency_ms} ms, run_id=${run.run_id}`,
        );
      }

      console.log("");
      console.log("Comparison recommendations:");
      for (const recommendation of result.comparison.recommendations) {
        console.log(`- ${recommendation}`);
      }
    });
}
