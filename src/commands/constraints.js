import {
  printInfo,
  printJson,
  printSuccess,
  printWarning,
} from "../utils/display.js";
import {
  initializeConstraints,
  loadConstraints,
  validateConstraintsObject,
  CONSTRAINTS_JSON_PATH,
} from "../constraints/loader.js";

export function registerConstraintsCommand(program) {
  const constraints = program
    .command("constraints")
    .description("Initialize, view, and validate PromptWash constraints");

  constraints
    .command("init")
    .description("Initialize default constraints files")
    .action(async () => {
      const pathValue = await initializeConstraints();
      printSuccess(`Created constraints file: ${pathValue}`);
    });

  constraints
    .command("view")
    .description("View resolved constraints")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const resolved = await loadConstraints();

      if (options.output === "json") {
        printJson(resolved);
        return;
      }

      printInfo("Resolved PromptWash constraints");
      printJson(resolved);
    });

  constraints
    .command("validate")
    .description("Validate constraints files")
    .action(async () => {
      const resolved = await loadConstraints();
      const errors = validateConstraintsObject(resolved);

      if (errors.length > 0) {
        printWarning(
          `Constraints validation failed for ${CONSTRAINTS_JSON_PATH}`,
        );
        printJson({ valid: false, errors });
        process.exitCode = 1;
        return;
      }

      printSuccess("Constraints are valid");
      printJson({ valid: true, errors: [] });
    });
}
