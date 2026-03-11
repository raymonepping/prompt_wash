import {
  printInfo,
  printJson,
  printSuccess,
  printWarning,
} from "../utils/display.js";
import { resolveInputSource, writeFileUtf8 } from "../utils/input.js";
import { runPipeline } from "../pipeline/index.js";
import { validatePromptIr } from "../ir/schema.js";
import { createValidationError } from "../utils/errors.js";

export function registerParseCommand(program) {
  program
    .command("parse")
    .description(
      "Clean raw prompt input, detect intent, and generate Prompt IR",
    )
    .argument("[input]", "Prompt text or path to a file")
    .option(
      "--enrich-debug",
      "Show raw enrichment acceptance/rejection details",
      false,
    )
    .option("-f, --file", "Treat input as a file path")
    .option("--enrich", "Use Ollama to enrich the deterministic parse", false)
    .option("--write <path>", "Write PromptWash JSON artifact to a file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const promptObject = await runPipeline(resolved.value, {
        source: resolved.kind,
        path: resolved.path,
        enrich: options.enrich || options.enrichDebug,
      });

      const irErrors = validatePromptIr(promptObject.ir);

      if (irErrors.length > 0) {
        throw createValidationError("Generated Prompt IR is invalid", irErrors);
      }

      if (options.write) {
        await writeFileUtf8(
          options.write,
          `${JSON.stringify(promptObject, null, 2)}\n`,
        );
      }

      if (options.output === "json") {
        printJson(promptObject);
        return;
      }

      if (promptObject.lint_warnings.length > 0) {
        printWarning("Prompt parsed with warnings");
      } else {
        printSuccess("Prompt parsed successfully");
      }

      printInfo(`Source: ${resolved.kind}`);

      if (resolved.path) {
        printInfo(`Path: ${resolved.path}`);
      }

      if (options.write) {
        printInfo(`Artifact written: ${options.write}`);
      }

      if (options.enrich || options.enrichDebug) {
        const enrichmentMeta = promptObject.metadata.enrichment ?? {};
        console.log("");
        console.log("Enrichment:");
        console.log(`- Requested: ${enrichmentMeta.requested ? "yes" : "no"}`);
        console.log(`- Succeeded: ${enrichmentMeta.succeeded ? "yes" : "no"}`);
        console.log(`- Merged: ${enrichmentMeta.merged ? "yes" : "no"}`);
        if (enrichmentMeta.reason) {
          console.log(`- Note: ${enrichmentMeta.reason}`);
        }

        if (options.enrichDebug) {
          console.log("- Applied fields:");
          const appliedFields = enrichmentMeta.applied_fields ?? {};
          if (Object.keys(appliedFields).length === 0) {
            console.log("  (none)");
          } else {
            for (const [field, applied] of Object.entries(appliedFields)) {
              console.log(
                `  - ${field}: ${applied ? "accepted" : "not accepted"}`,
              );
            }
          }

          console.log("- Rejected fields:");
          const rejectedFields = enrichmentMeta.rejected_fields ?? {};
          if (Object.keys(rejectedFields).length === 0) {
            console.log("  (none)");
          } else {
            for (const [field, reason] of Object.entries(rejectedFields)) {
              console.log(`  - ${field}: ${reason}`);
            }
          }

          console.log("- Raw enrichment:");
          console.log(JSON.stringify(enrichmentMeta.raw ?? null, null, 2));
        }
      }

      console.log("");
      console.log("Intent:");
      console.log(promptObject.intent || "(not detected)");
      console.log("");
      console.log("Audience:");
      console.log(promptObject.audience);
      console.log("");
      console.log("Language:");
      console.log(promptObject.language);
      console.log("");
      console.log("Output format:");
      console.log(promptObject.ir.output_format || "(not detected)");
      console.log("");
      console.log("Constraints:");
      if (promptObject.constraints.length === 0) {
        console.log("(none detected)");
      } else {
        for (const constraint of promptObject.constraints) {
          console.log(`- ${constraint}`);
        }
      }
      console.log("");
      console.log("Steps:");
      if (promptObject.ir.steps.length === 0) {
        console.log("(none detected)");
      } else {
        for (const step of promptObject.ir.steps) {
          console.log(`- ${step}`);
        }
      }
      console.log("");
      console.log("Lint warnings:");
      if (promptObject.lint_warnings.length === 0) {
        console.log("(none)");
      } else {
        for (const warning of promptObject.lint_warnings) {
          console.log(`- [${warning.code}] ${warning.message}`);
        }
      }
      console.log("");
      console.log("Token estimate:");
      console.log(promptObject.tokens.input);
      console.log("");
      console.log("Complexity score:");
      console.log(promptObject.complexity_score);
      console.log("");
      console.log("Fingerprint:");
      console.log(promptObject.fingerprint);
    });
}
