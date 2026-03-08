import { printInfo } from "../utils/display.js";

export function registerCheckCommand(program) {
  program
    .command("check")
    .description("Lint, analyze, compare, and benchmark prompts")
    .argument("[input]", "Prompt text, Prompt IR, or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option("--benchmark", "Run benchmark flow if configured", false)
    .option("--baseline <path>", "Optional baseline prompt or IR file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      printInfo("check command scaffold is ready");
      console.log({ command: "check", input: input ?? null, options });
    });
}
