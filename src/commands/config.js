import { printInfo, printJson, printSuccess, printWarning } from "../utils/display.js";
import {
  initializeProjectConfig,
  resolveConfig,
  validateConfigObject
} from "../config/loader.js";
import { createOllamaClient } from "../ollama/client.js";

export function registerConfigCommand(program) {
  const config = program
    .command("config")
    .description("Initialize, show, and validate PromptWash configuration");

  config
    .command("init")
    .description("Initialize project configuration")
    .action(async () => {
      const pathValue = await initializeProjectConfig();
      printSuccess(`Created config file: ${pathValue}`);
    });

  config
    .command("show")
    .description("Show resolved configuration")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const resolved = await resolveConfig();

      if (options.output === "json") {
        printJson(resolved);
        return;
      }

      printInfo("Resolved PromptWash configuration");
      printJson(resolved);
    });

  config
    .command("validate")
    .description("Validate configuration files")
    .option("--check-ollama", "Also verify Ollama reachability", false)
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const resolved = await resolveConfig();
      const errors = validateConfigObject(resolved);

      let ollama = null;
      if (options.checkOllama) {
        const client = createOllamaClient(resolved.ollama);
        ollama = await client.healthCheck();
      }

      const result = {
        valid: errors.length === 0,
        errors,
        ollama
      };

      if (options.output === "json") {
        printJson(result);
        if (!result.valid) {
          process.exitCode = 1;
        }
        return;
      }

      if (errors.length > 0) {
        printWarning("Configuration validation failed");
      } else {
        printSuccess("Configuration is valid");
      }

      printJson(result);

      if (!result.valid) {
        process.exitCode = 1;
      }
    });
}