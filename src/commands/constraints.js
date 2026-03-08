import { printInfo } from "../utils/display.js";

export function registerConstraintsCommand(program) {
  const constraints = program
    .command("constraints")
    .description("Initialize, view, and validate PromptWash constraints");

  constraints
    .command("init")
    .description("Initialize default constraints files")
    .action(async () => {
      printInfo("constraints init scaffold is ready");
      console.log({ command: "constraints init" });
    });

  constraints
    .command("view")
    .description("View resolved constraints")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      printInfo("constraints view scaffold is ready");
      console.log({ command: "constraints view", options });
    });

  constraints
    .command("validate")
    .description("Validate constraints files")
    .action(async () => {
      printInfo("constraints validate scaffold is ready");
      console.log({ command: "constraints validate" });
    });
}