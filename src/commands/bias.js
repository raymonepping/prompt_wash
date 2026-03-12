import {
  printInfo,
  printJson,
  printSuccess,
  printWarning,
} from "../utils/display.js";
import { resolveInputSource } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { analyzePromptBias } from "../services/governance/bias_detection.js";

export function registerBiasCommand(program) {
  program
    .command("bias")
    .description("Analyze prompt bias using PromptWash governance rules")
    .argument("[input]", "Prompt text, PromptWash JSON, Prompt IR, or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const bias = await analyzePromptBias(promptObject);

      const result = {
        command: "bias",
        source: sourceType,
        path: resolved.path,
        intent: promptObject.intent,
        bias,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (bias.bias_score >= 61) {
        printWarning("Prompt bias analysis completed with elevated bias");
      } else {
        printSuccess("Prompt bias analysis completed");
      }

      printInfo(`Source: ${sourceType}`);
      printInfo(`Intent: ${promptObject.intent || "(not detected)"}`);

      console.log("");
      console.log("Bias Analysis");
      console.log("");
      console.log(`Bias Score: ${bias.bias_score} / 100`);
      console.log(`Bias Level: ${bias.bias_level.toUpperCase()}`);
      console.log("");
      console.log("Detected Signals");
      console.log("");
      console.log(
        `Outcome Steering: ${bias.signals.outcome_steering ? "detected" : "none detected"}`,
      );
      console.log(
        `Vendor Bias: ${bias.signals.vendor_bias ? "detected" : "none detected"}`,
      );
      console.log(
        `Advocacy Language: ${bias.signals.advocacy_language ? "detected" : "none detected"}`,
      );
      console.log(
        `Forced Recommendation: ${bias.signals.forced_recommendation ? "detected" : "none detected"}`,
      );

      console.log("");
      console.log("Matches");
      console.log("");

      for (const [category, matches] of Object.entries(bias.matches)) {
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

      if (!bias.recommendations.length) {
        console.log("(none)");
      } else {
        for (const recommendation of bias.recommendations) {
          console.log(`- ${recommendation}`);
        }
      }
    });
}