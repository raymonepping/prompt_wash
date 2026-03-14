import {
  printInfo,
  printJson,
  printSuccess,
} from "../utils/display.js";
import { resolveInputSource, writeFileUtf8 } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { runPromptExperiment } from "../services/experiments/run-experiment.js";
import { saveExperimentArtifact } from "../services/experiments/storage.js";
import {
  getExperimentReportFormatFromPath,
  renderExperimentReport,
} from "../utils/experiment-report.js";

function parseVariants(value) {
  if (!value || typeof value !== "string") {
    return ["generic", "compact"];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function registerExperimentCommand(program) {
  program
    .command("experiment")
    .description("Run a local experiment across prompt variants")
    .argument("[input]", "Prompt text, PromptWash JSON, Prompt IR, or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option("--provider <name>", "Execution provider", "ollama")
    .option(
      "--variants <list>",
      "Comma-separated render variants, for example generic,compact,openai,claude",
      "generic,compact",
    )
    .option("--save-runs", "Persist experiment run artifacts", false)
    .option("--save-experiment", "Persist experiment artifact", false)
    .option("--report <path>", "Write a JSON or Markdown experiment report to a file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const variants = parseVariants(options.variants);

      const result = await runPromptExperiment(promptObject, {
        provider: options.provider,
        saveRuns: options.saveRuns,
        source: {
          type: sourceType,
          path: resolved.path,
          lineage: null,
        },
        variants,
      });

      let experimentPath = null;
      if (options.saveExperiment) {
        experimentPath = await saveExperimentArtifact(result.experiment_artifact);
      }

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
        experiment_path: experimentPath,
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
      if (experimentPath) {
        printInfo(`Experiment artifact written: ${experimentPath}`);
      }
      if (options.report) {
        printInfo(`Experiment report written: ${options.report}`);
      }

      console.log("");
      console.log("Runs:");
      for (const run of result.runs) {
        console.log(
          `- ${run.variant}: score=${run.overall_score}, latency=${run.latency_ms} ms, tokens=${run.rendered_prompt_tokens}, run_id=${run.run_id}`,
        );
      }

      console.log("");
      console.log("Rankings:");
      if (result.rankings.best_overall) {
        console.log(
          `- Best overall: ${result.rankings.best_overall.variant} (${result.rankings.best_overall.overall_score})`,
        );
      }
      if (result.rankings.fastest) {
        console.log(
          `- Fastest: ${result.rankings.fastest.variant} (${result.rankings.fastest.latency_ms} ms)`,
        );
      }
      if (result.rankings.smallest_prompt) {
        console.log(
          `- Smallest prompt: ${result.rankings.smallest_prompt.variant} (${result.rankings.smallest_prompt.rendered_prompt_tokens} tokens)`,
        );
      }
      if (result.rankings.best_constraint_adherence) {
        console.log(
          `- Best constraint adherence: ${result.rankings.best_constraint_adherence.variant} (${result.rankings.best_constraint_adherence.constraint_adherence})`,
        );
      }

      console.log("");
      console.log("Recommendations:");
      for (const recommendation of result.recommendations) {
        console.log(`- ${recommendation}`);
      }
    });
}