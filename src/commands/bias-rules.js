import {
  printInfo,
  printJson,
  printSuccess,
} from "../utils/display.js";
import {
  initializeProjectBiasRules,
  loadProjectBiasRules,
  PROJECT_BIAS_RULES_PATH,
  resolveBiasRules,
  validateBiasRulesObject,
} from "../services/governance/bias_loader.js";

export function registerBiasRulesCommand(program) {
  const biasRules = program
    .command("bias-rules")
    .description("Initialize, view, and validate PromptWash bias rules");

  biasRules
    .command("init")
    .description("Initialize project bias rules")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const pathValue = await initializeProjectBiasRules();

      const result = {
        command: "bias-rules init",
        path: pathValue,
        status: "created",
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess(`Created bias rules file: ${pathValue}`);
    });

  biasRules
    .command("view")
    .description("View resolved bias rules")
    .option("--project-only", "Show only project bias rules when present", false)
    .option("-o, --output <format>", "Output format: text|json", "json")
    .action(async (options) => {
      const rules = options.projectOnly
        ? await loadProjectBiasRules()
        : await resolveBiasRules();

      const result = {
        command: "bias-rules view",
        source: options.projectOnly ? "project_only" : "resolved",
        path: options.projectOnly ? PROJECT_BIAS_RULES_PATH : null,
        rules,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printInfo("Resolved PromptWash bias rules");
      console.log("");
      console.log(JSON.stringify(result, null, 2));
    });

  biasRules
    .command("validate")
    .description("Validate project bias rules")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const rules = await loadProjectBiasRules();
      const errors = rules ? validateBiasRulesObject(rules) : [];

      const result = {
        command: "bias-rules validate",
        path: PROJECT_BIAS_RULES_PATH,
        valid: errors.length === 0,
        errors,
        exists: rules !== null,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (!result.exists) {
        printInfo(`No project bias rules found at: ${PROJECT_BIAS_RULES_PATH}`);
        printInfo("Using built-in default bias rules.");
        return;
      }

      if (result.valid) {
        printSuccess("Bias rules are valid");
      } else {
        printInfo("Bias rules validation failed");
      }

      console.log("");
      console.log(JSON.stringify(result, null, 2));
    });
}