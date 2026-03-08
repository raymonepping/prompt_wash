import { printInfo } from "../utils/display.js";

export function registerRenderCommand(program) {
  program
    .command("render")
    .description("Render Prompt IR into provider-specific prompt variants")
    .argument("[input]", "Prompt IR or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option(
      "-p, --provider <provider>",
      "Target provider: openai|claude|generic|compact",
      "generic"
    )
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      printInfo("render command scaffold is ready");
      console.log({ command: "render", input: input ?? null, options });
    });
}