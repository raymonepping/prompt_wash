import { printInfo } from "../utils/display.js";

export function registerParseCommand(program) {
  program
    .command("parse")
    .description("Clean raw prompt input, detect intent, and generate Prompt IR")
    .argument("[input]", "Prompt text or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      printInfo("parse command scaffold is ready");
      console.log({ command: "parse", input: input ?? null, options });
    });
}