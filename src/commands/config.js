import { printInfo } from "../utils/display.js";

export function registerConfigCommand(program) {
  const config = program
    .command("config")
    .description("Initialize, show, and validate PromptWash configuration");

  config
    .command("init")
    .description("Initialize project configuration")
    .action(async () => {
      printInfo("config init scaffold is ready");
      console.log({ command: "config init" });
    });

  config
    .command("show")
    .description("Show resolved configuration")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      printInfo("config show scaffold is ready");
      console.log({ command: "config show", options });
    });

  config
    .command("validate")
    .description("Validate configuration files")
    .action(async () => {
      printInfo("config validate scaffold is ready");
      console.log({ command: "config validate" });
    });
}