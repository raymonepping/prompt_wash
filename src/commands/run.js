import {
  printInfo,
  printJson,
  printSuccess,
} from "../utils/display.js";
import { resolveInputSource } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { executePromptObject } from "../services/execution/execute.js";

export function registerRunCommand(program) {
  program
    .command("run")
    .description("Execute a prompt using a local provider")
    .argument("[input]", "Prompt text, PromptWash JSON, Prompt IR, or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option("--provider <name>", "Execution provider", "ollama")
    .option("--render-mode <mode>", "Render mode: generic|compact|openai|claude", "generic")
    .option("--save", "Persist execution artifact to .promptwash/runs", false)
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

      const result = {
        command: "run",
        source: sourceType,
        path: resolved.path,
        saved_path: execution.saved_path,
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

      console.log("");
      console.log("Response:");
      console.log("");
      console.log(execution.artifact.output.text);
    });
}