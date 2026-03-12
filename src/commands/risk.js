import { printInfo, printJson, printSuccess, printWarning } from "../utils/display.js";
import { resolveInputSource } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { analyzePromptRisk } from "../services/governance/risk_scoring.js";

export function registerRiskCommand(program) {
  program
    .command("risk")
    .description("Analyze prompt risk using PromptWash governance rules")
    .argument("[input]", "Prompt text, PromptWash JSON, Prompt IR, or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const risk = await analyzePromptRisk(promptObject);

      const result = {
        command: "risk",
        source: sourceType,
        path: resolved.path,
        intent: promptObject.intent,
        risk,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (risk.risk_score >= 61) {
        printWarning("Prompt risk analysis completed with elevated risk");
      } else {
        printSuccess("Prompt risk analysis completed");
      }

      printInfo(`Source: ${sourceType}`);
      printInfo(`Intent: ${promptObject.intent || "(not detected)"}`);

      console.log("");
      console.log("Prompt Risk Analysis");
      console.log("");
      console.log(`Overall Risk Score: ${risk.risk_score} / 100`);
      console.log(`Risk Level: ${risk.risk_level.toUpperCase()}`);
      console.log("");
      console.log("Detected Signals");
      console.log("");
      console.log(`Prompt Injection Risk: ${risk.signals.prompt_injection ? "detected" : "none detected"}`);
      console.log(`Manipulation Risk: ${risk.signals.manipulation ? "detected" : "none detected"}`);
      console.log(`Ambiguity Risk: ${risk.signals.ambiguity ? "detected" : "none detected"}`);
      console.log(`Compliance Risk: ${risk.signals.compliance_risk ? "detected" : "none detected"}`);

      console.log("");
      console.log("Matches");
      console.log("");

      for (const [category, matches] of Object.entries(risk.matches)) {
        console.log(`${category}:`);
        if (!matches.length) {
          console.log("  (none)");
        } else {
          for (const match of matches) {
            console.log(`  - ${match}`);
          }
        }
      }

      console.log("");
      console.log("Recommendations");
      console.log("");

      if (!risk.recommendations.length) {
        console.log("(none)");
      } else {
        for (const recommendation of risk.recommendations) {
          console.log(`- ${recommendation}`);
        }
      }
    });
}