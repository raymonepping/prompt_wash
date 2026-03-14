import { printInfo, printJson, printSuccess } from "../utils/display.js";
import {
  listExperimentArtifacts,
  loadExperimentArtifact,
} from "../services/experiments/storage.js";
import { createValidationError } from "../utils/errors.js";

export function registerExperimentsCommand(program) {
  const experiments = program
    .command("experiments")
    .description("List and inspect saved PromptWash experiments");

  experiments
    .command("list")
    .description("List saved experiments")
    .option("--limit <count>", "Maximum number of experiments to show", "20")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const limit = Number.parseInt(options.limit, 10);
      const all = await listExperimentArtifacts();
      const limited =
        Number.isInteger(limit) && limit > 0 ? all.slice(0, limit) : all;

      const result = {
        command: "experiments list",
        total: all.length,
        limit: Number.isInteger(limit) && limit > 0 ? limit : null,
        experiments: limited,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Experiments loaded");
      printInfo(`Total experiments: ${all.length}`);
      printInfo(`Showing: ${limited.length}`);
      console.log("");

      if (limited.length === 0) {
        console.log("(none)");
        return;
      }

      for (const item of limited) {
        console.log(`- ${item.experiment_id}`);
        console.log(`  provider: ${item.provider}`);
        console.log(`  variants: ${item.variants.join(", ")}`);
        console.log(`  winner: ${item.winner}`);
        console.log(`  runs: ${item.run_count}`);
        console.log(`  created: ${item.created_at}`);
      }
    });

  experiments
    .command("view")
    .description("View a saved experiment")
    .argument("<experimentId>", "Experiment id")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (experimentId, options) => {
      const artifact = await loadExperimentArtifact(experimentId);

      if (!artifact) {
        throw createValidationError(`Experiment not found: ${experimentId}`);
      }

      const result = {
        command: "experiments view",
        experiment_id: experimentId,
        artifact,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Experiment loaded");
      printInfo(`Experiment ID: ${artifact.experiment_id}`);
      printInfo(`Provider: ${artifact.provider}`);
      printInfo(`Winner: ${artifact.winner}`);
      printInfo(`Variants: ${artifact.variants.join(", ")}`);
      printInfo(`Created: ${artifact.created_at}`);
      console.log("");

      console.log("Runs:");
      for (const run of artifact.runs) {
        console.log(
          `- ${run.variant}: score=${run.overall_score}, latency=${run.latency_ms} ms, run_id=${run.run_id}`,
        );
      }

      console.log("");
      console.log("Recommendations:");
      for (const recommendation of artifact.recommendations) {
        console.log(`- ${recommendation}`);
      }
    });
}
