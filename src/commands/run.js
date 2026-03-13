import { printInfo, printJson, printSuccess } from "../utils/display.js";
import { resolveInputSource, writeFileUtf8 } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { executePromptObject } from "../services/execution/execute.js";
import {
  getExecutionReportFormatFromPath,
  renderExecutionReport,
} from "../utils/run-report.js";

export function registerRunCommand(program) {
  program
    .command("run")
    .description("Execute a prompt using a local provider")
    .argument(
      "[input]",
      "Prompt text, PromptWash JSON, Prompt IR, or path to a file",
    )
    .option("-f, --file", "Treat input as a file path")
    .option("--provider <name>", "Execution provider", "ollama")
    .option(
      "--render-mode <mode>",
      "Render mode: generic|compact|openai|claude",
      "generic",
    )
    .option("--save", "Persist execution artifact to .promptwash/runs", false)
    .option(
      "--report <path>",
      "Write a JSON or Markdown execution report to a file",
    )
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const execution = await executePromptObject(promptObject, {
        provider: options.provider,
        renderMode: options.renderMode,
        persist: options.save,
        source: {
          type: sourceType,
          path: resolved.path,
        },
      });

      if (options.report) {
        const reportFormat = getExecutionReportFormatFromPath(options.report);
        const reportContent = renderExecutionReport(
          execution.artifact,
          reportFormat,
        );
        await writeFileUtf8(options.report, reportContent);
      }

      const result = {
        command: "run",
        source: sourceType,
        path: resolved.path,
        saved_path: execution.saved_path,
        report_path: options.report ?? null,
        artifact: execution.artifact,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Prompt executed successfully");
      printInfo(`Provider: ${execution.artifact.execution.provider}`);
      printInfo(`Model: ${execution.artifact.execution.model}`);
      printInfo(`Render mode: ${execution.artifact.execution.render_mode}`);
      printInfo(`Latency: ${execution.artifact.execution.latency_ms} ms`);
      if (execution.saved_path) {
        printInfo(`Execution artifact written: ${execution.saved_path}`);
      }
      if (options.report) {
        printInfo(`Execution report written: ${options.report}`);
      }

      console.log("");
      console.log("Response:");
      console.log("");
      console.log(execution.artifact.output.text);
    });
}
