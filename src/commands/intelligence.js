import { printInfo, printJson, printSuccess } from "../utils/display.js";
import { buildPromptWashStats } from "../services/intelligence/stats.js";
import { buildRunIntelligence } from "../services/intelligence/runs.js";
import { buildOptimizationIntelligence } from "../services/intelligence/optimization.js";

export function registerIntelligenceCommand(program) {
  const intelligence = program
    .command("intelligence")
    .description("Inspect PromptWash analytics and repository intelligence");

  intelligence
    .command("stats")
    .description("Show high-level PromptWash statistics")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const stats = await buildPromptWashStats();

      const result = {
        command: "intelligence stats",
        stats,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("PromptWash stats loaded");
      printInfo(`Prompt candidates: ${stats.repository.prompt_candidates}`);
      printInfo(`Lineage families: ${stats.repository.lineage_families}`);
      printInfo(`Total runs: ${stats.runs.total_runs}`);
      printInfo(`Average latency: ${stats.runs.average_latency_ms} ms`);
      printInfo(
        `Average rendered prompt tokens: ${stats.runs.average_rendered_prompt_tokens}`,
      );
      printInfo(
        `Average response tokens: ${stats.runs.average_response_tokens}`,
      );
      printInfo(
        `Optimized artifacts: ${stats.optimization.optimized_artifact_count}`,
      );
      console.log("");
      console.log("Models:");
      if (stats.runs.models.length === 0) {
        console.log("(none)");
      } else {
        for (const item of stats.runs.models) {
          console.log(`- ${item.model}: ${item.count}`);
        }
      }
    });

  intelligence
    .command("runs")
    .description("Show analytics derived from saved execution runs")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const data = await buildRunIntelligence();

      const result = {
        command: "intelligence runs",
        runs: data,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Run intelligence loaded");
      printInfo(`Total runs: ${data.total_runs}`);
      printInfo(`Average score: ${data.average_score}`);
      printInfo(`Average latency: ${data.average_latency_ms} ms`);
      if (data.strongest_run) {
        printInfo(
          `Strongest run: ${data.strongest_run.run_id} (${data.strongest_run.overall_score})`,
        );
      }
      if (data.fastest_run) {
        printInfo(
          `Fastest run: ${data.fastest_run.run_id} (${data.fastest_run.latency_ms} ms)`,
        );
      }

      console.log("");
      console.log("Models:");
      if (data.models.length === 0) {
        console.log("(none)");
      } else {
        for (const model of data.models) {
          console.log(
            `- ${model.model}: runs=${model.runs}, avg_score=${model.average_score}, avg_latency=${model.average_latency_ms} ms`,
          );
        }
      }
    });

  intelligence
    .command("optimization")
    .description("Show optimization-related prompt intelligence")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const data = await buildOptimizationIntelligence();

      const result = {
        command: "intelligence optimization",
        optimization: data,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Optimization intelligence loaded");
      printInfo(`Total prompt candidates: ${data.total_prompt_candidates}`);
      printInfo(`Optimized candidates: ${data.optimized_candidates}`);
      printInfo(`Baseline candidates: ${data.baseline_candidates}`);
      console.log("");
      console.log("Optimized files:");
      if (data.optimized_files.length === 0) {
        console.log("(none)");
      } else {
        for (const filePath of data.optimized_files) {
          console.log(`- ${filePath}`);
        }
      }
      console.log("");
      console.log(`Note: ${data.note}`);
    });
}
