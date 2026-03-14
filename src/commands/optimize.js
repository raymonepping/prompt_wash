import {
  printInfo,
  printJson,
  printSuccess,
  printWarning,
} from "../utils/display.js";
import { resolveInputSource, writeFileUtf8 } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { optimizePromptObject } from "../services/optimization/optimize.js";
import { buildOptimizedPromptArtifactFromSource } from "../services/optimization/artifact.js";
import {
  loadLineageRecord,
  appendLineageNode,
} from "../services/lineage/storage.js";
import { createLineageNode } from "../services/lineage/schema.js";
import { nextChildNodeId } from "../services/lineage/naming.js";
import { createValidationError } from "../utils/errors.js";

export function registerOptimizeCommand(program) {
  program
    .command("optimize")
    .description("Optimize a prompt deterministically for lower token usage")
    .argument(
      "[input]",
      "Prompt text, PromptWash JSON, Prompt IR, or path to a file",
    )
    .option("-f, --file", "Treat input as a file path")
    .option(
      "--original-mode <mode>",
      "Baseline mode: generic|compact|openai|claude",
      "generic",
    )
    .option(
      "--optimized-mode <mode>",
      "Optimized mode: generic|compact|openai|claude",
      "compact",
    )
    .option("--write <path>", "Write optimization result to a JSON file")
    .option(
      "--artifact <path>",
      "Write optimized PromptWash artifact to a file",
    )
    .option(
      "--lineage <family>",
      "Append optimized artifact to an existing lineage family",
    )
    .option("--parent <nodeId>", "Optional lineage parent node id")
    .option("--label <value>", "Optional lineage label for optimized node", "")
    .option("--notes <value>", "Optional lineage notes for optimized node", "")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const optimized = optimizePromptObject(promptObject, {
        originalMode: options.originalMode,
        optimizedMode: options.optimizedMode,
      });

      let optimizedArtifact = null;
      if (options.artifact) {
        optimizedArtifact = buildOptimizedPromptArtifactFromSource(
          promptObject,
          optimized,
          {
            sourceType: "optimized_prompt",
            path: options.artifact,
            method: "deterministic_compact",
            preserveFingerprint: false,
          },
        );

        await writeFileUtf8(
          options.artifact,
          `${JSON.stringify(optimizedArtifact, null, 2)}\n`,
        );
      }

      let lineage = null;
      if (options.lineage) {
        if (!options.artifact) {
          throw createValidationError(
            "Lineage append requires --artifact so the optimized node has a saved artifact path.",
          );
        }

        const record = await loadLineageRecord(options.lineage);
        if (!record) {
          throw createValidationError(
            `Lineage family not found: ${options.lineage}`,
          );
        }

        const parentId = options.parent ?? record.root;
        const nodeId = nextChildNodeId(record, parentId);

        const node = createLineageNode({
          id: nodeId,
          parent: parentId,
          artifact: options.artifact,
          label: options.label,
          notes: options.notes,
          fingerprint: optimizedArtifact?.fingerprint ?? null,
        });

        const appended = await appendLineageNode(options.lineage, node);

        lineage = {
          family: options.lineage,
          path: appended.path,
          node,
        };
      }

      const result = {
        command: "optimize",
        source: sourceType,
        path: resolved.path,
        write_path: options.write ?? null,
        artifact_path: options.artifact ?? null,
        lineage,
        result: optimized,
        optimized_artifact: optimizedArtifact,
      };

      if (options.write) {
        await writeFileUtf8(
          options.write,
          `${JSON.stringify(result, null, 2)}\n`,
        );
      }

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (optimized.optimization.semantic_drift_risk === "high") {
        printWarning("Prompt optimized with elevated semantic drift risk");
      } else {
        printSuccess("Prompt optimized successfully");
      }

      printInfo(`Source: ${sourceType}`);
      printInfo(`Original mode: ${optimized.optimization.original_mode}`);
      printInfo(`Optimized mode: ${optimized.optimization.optimized_mode}`);
      printInfo(
        `Original tokens: ${optimized.optimization.token_comparison.original_tokens}`,
      );
      printInfo(
        `Optimized tokens: ${optimized.optimization.token_comparison.optimized_tokens}`,
      );
      printInfo(
        `Saved tokens: ${optimized.optimization.token_comparison.saved_tokens}`,
      );
      printInfo(
        `Saved percent: ${optimized.optimization.token_comparison.saved_percent}%`,
      );
      printInfo(
        `Semantic drift risk: ${optimized.optimization.semantic_drift_risk}`,
      );

      if (options.write) {
        printInfo(`Optimization result written: ${options.write}`);
      }

      if (options.artifact) {
        printInfo(`Optimized artifact written: ${options.artifact}`);
      }

      if (lineage) {
        printInfo(`Lineage family updated: ${lineage.family}`);
        printInfo(`New lineage node: ${lineage.node.id}`);
      }

      console.log("");
      console.log("Original prompt:");
      console.log("");
      console.log(optimized.optimization.original_prompt);

      console.log("");
      console.log("Optimized prompt:");
      console.log("");
      console.log(optimized.optimization.optimized_prompt);

      console.log("");
      console.log("Recommendations:");
      if (optimized.optimization.recommendations.length === 0) {
        console.log("(none)");
      } else {
        for (const recommendation of optimized.optimization.recommendations) {
          console.log(`- ${recommendation}`);
        }
      }

      if (optimized.optimization.missing_signals.length > 0) {
        console.log("");
        console.log("Missing signals in optimized prompt:");
        for (const signal of optimized.optimization.missing_signals) {
          console.log(`- ${signal}`);
        }
      }
    });
}
