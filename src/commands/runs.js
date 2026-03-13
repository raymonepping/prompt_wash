import {
  printInfo,
  printJson,
  printSuccess,
} from "../utils/display.js";
import {
  listExecutionArtifacts,
  loadExecutionArtifact,
} from "../services/execution/storage.js";
import { createValidationError } from "../utils/errors.js";

export function registerRunsCommand(program) {
  const runs = program
    .command("runs")
    .description("List and inspect PromptWash execution runs");

  runs
    .command("list")
    .description("List saved execution runs")
    .option("--limit <count>", "Maximum number of runs to show", "20")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const limit = Number.parseInt(options.limit, 10);
      const runsList = await listExecutionArtifacts();
      const limitedRuns = Number.isInteger(limit) && limit > 0
        ? runsList.slice(0, limit)
        : runsList;

      const result = {
        command: "runs list",
        total: runsList.length,
        limit: Number.isInteger(limit) && limit > 0 ? limit : null,
        runs: limitedRuns,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Execution runs loaded");
      printInfo(`Total runs: ${runsList.length}`);
      printInfo(`Showing: ${limitedRuns.length}`);
      console.log("");

      if (limitedRuns.length === 0) {
        console.log("(none)");
        return;
      }

      for (const item of limitedRuns) {
        console.log(`- ${item.run_id}`);
        console.log(`  provider: ${item.provider}`);
        console.log(`  model: ${item.model}`);
        console.log(`  render mode: ${item.render_mode}`);
        console.log(`  latency: ${item.latency_ms} ms`);
        console.log(`  fingerprint: ${item.fingerprint ?? "(none)"}`);
        console.log(`  intent: ${item.intent || "(none)"}`);
        console.log(`  created: ${item.created_at}`);
      }
    });

  runs
    .command("latest")
    .description("View the most recent saved execution run")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const runsList = await listExecutionArtifacts();

      if (runsList.length === 0) {
        throw createValidationError("No execution runs found.");
      }

      const latestRun = runsList[0];
      const artifact = await loadExecutionArtifact(latestRun.run_id);

      if (!artifact) {
        throw createValidationError(`Execution run not found: ${latestRun.run_id}`);
      }

      const result = {
        command: "runs latest",
        run_id: latestRun.run_id,
        artifact,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Latest execution run loaded");
      printInfo(`Run ID: ${artifact.run_id}`);
      printInfo(`Provider: ${artifact.execution.provider}`);
      printInfo(`Model: ${artifact.execution.model}`);
      printInfo(`Render mode: ${artifact.execution.render_mode}`);
      printInfo(`Latency: ${artifact.execution.latency_ms} ms`);
      printInfo(`Created: ${artifact.created_at}`);
      console.log("");
      console.log("Response:");
      console.log("");
      console.log(artifact.output.text);
    });

  runs
    .command("view")
    .description("View a saved execution run")
    .argument("<runId>", "Execution run id")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (runId, options) => {
      const artifact = await loadExecutionArtifact(runId);

      if (!artifact) {
        throw createValidationError(`Execution run not found: ${runId}`);
      }

      const result = {
        command: "runs view",
        run_id: runId,
        artifact,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Execution run loaded");
      printInfo(`Run ID: ${artifact.run_id}`);
      printInfo(`Provider: ${artifact.execution.provider}`);
      printInfo(`Model: ${artifact.execution.model}`);
      printInfo(`Render mode: ${artifact.execution.render_mode}`);
      printInfo(`Latency: ${artifact.execution.latency_ms} ms`);
      printInfo(`Created: ${artifact.created_at}`);
      console.log("");
      console.log("Prompt:");
      console.log(`- Fingerprint: ${artifact.prompt.fingerprint ?? "(none)"}`);
      console.log(`- Intent: ${artifact.prompt.intent || "(none)"}`);
      console.log(`- Audience: ${artifact.prompt.audience || "(none)"}`);
      console.log(`- Output format: ${artifact.prompt.output_format || "(none)"}`);
      console.log("");
      console.log("Rendered prompt:");
      console.log("");
      console.log(artifact.input.rendered_prompt ?? "");
      console.log("");
      console.log("Response:");
      console.log("");
      console.log(artifact.output.text);
    });
}
