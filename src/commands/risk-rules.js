import { printInfo, printJson, printSuccess } from "../utils/display.js";
import {
  initializeProjectRiskRules,
  loadProjectRiskRules,
  PROJECT_RISK_RULES_PATH,
  resolveRiskRules,
  validateRiskRulesObject,
} from "../services/governance/risk_loader.js";

export function registerRiskRulesCommand(program) {
  const riskRules = program
    .command("risk-rules")
    .description("Initialize, view, and validate PromptWash risk rules");

  riskRules
    .command("init")
    .description("Initialize project risk rules")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const pathValue = await initializeProjectRiskRules();

      const result = {
        command: "risk-rules init",
        path: pathValue,
        status: "created",
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess(`Created risk rules file: ${pathValue}`);
    });

  riskRules
    .command("view")
    .description("View resolved risk rules")
    .option(
      "--project-only",
      "Show only project risk rules when present",
      false,
    )
    .option("-o, --output <format>", "Output format: text|json", "json")
    .action(async (options) => {
      const rules = options.projectOnly
        ? await loadProjectRiskRules()
        : await resolveRiskRules();

      const result = {
        command: "risk-rules view",
        source: options.projectOnly ? "project_only" : "resolved",
        path: options.projectOnly ? PROJECT_RISK_RULES_PATH : null,
        rules,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printInfo("Resolved PromptWash risk rules");
      console.log("");
      console.log(JSON.stringify(result, null, 2));
    });

  riskRules
    .command("validate")
    .description("Validate project risk rules")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const rules = await loadProjectRiskRules();
      const errors = rules ? validateRiskRulesObject(rules) : [];

      const result = {
        command: "risk-rules validate",
        path: PROJECT_RISK_RULES_PATH,
        valid: errors.length === 0,
        errors,
        exists: rules !== null,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (!result.exists) {
        printInfo(`No project risk rules found at: ${PROJECT_RISK_RULES_PATH}`);
        printInfo("Using built-in default risk rules.");
        return;
      }

      if (result.valid) {
        printSuccess("Risk rules are valid");
      } else {
        printInfo("Risk rules validation failed");
      }

      console.log("");
      console.log(JSON.stringify(result, null, 2));
    });
}
