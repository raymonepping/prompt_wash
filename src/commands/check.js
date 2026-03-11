import {
  printInfo,
  printJson,
  printSuccess,
  printWarning,
} from "../utils/display.js";
import { resolveInputSource, readFileUtf8, writeFileUtf8 } from "../utils/input.js";
import { buildBenchmarkResult } from "../benchmark/providers.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { runPipeline } from "../pipeline/index.js";
import { renderCheckReport, getReportFormatFromPath } from "../utils/report.js";

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function computeBaselineDiff(currentPrompt, baselinePrompt) {
  const currentSentences = new Set(splitSentences(currentPrompt.cleaned));
  const baselineSentences = new Set(splitSentences(baselinePrompt.cleaned));

  const added = [...currentSentences].filter(
    (item) => !baselineSentences.has(item),
  );
  const removed = [...baselineSentences].filter(
    (item) => !currentSentences.has(item),
  );

  let intentChangeRisk = "low";

  if (currentPrompt.intent !== baselinePrompt.intent) {
    intentChangeRisk = "medium";
  }

  if (removed.length > 0 && currentPrompt.intent !== baselinePrompt.intent) {
    intentChangeRisk = "high";
  }

  return {
    added_sentences: added,
    removed_sentences: removed,
    intent_change_risk: intentChangeRisk,
    baseline_intent: baselinePrompt.intent,
    current_intent: currentPrompt.intent,
  };
}

export function registerCheckCommand(program) {
  program
    .command("check")
    .description("Lint, analyze, compare, and benchmark prompts")
    .argument(
      "[input]",
      "Prompt text, Prompt IR, PromptWash JSON, or path to a file",
    )
    .option("-f, --file", "Treat input as a file path")
    .option("--benchmark", "Run benchmark flow if configured", false)
    .option("--baseline <path>", "Optional baseline prompt or IR file")
    .option(
      "--enrich",
      "Use Ollama to enrich the deterministic parse before checking",
      false,
    )
    .option("--enrich-debug", "Show raw enrichment acceptance/rejection details", false)
    .option("--report <path>", "Write a JSON or Markdown report to a file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: options.enrich || options.enrichDebug },
      );

      let baselineDiff = null;

      if (options.baseline) {
        const baselineRaw = await readFileUtf8(options.baseline);
        const baselinePrompt = await runPipeline(baselineRaw, {
          source: "baseline_file",
          path: options.baseline,
          enrich: false,
        });

        baselineDiff = computeBaselineDiff(promptObject, baselinePrompt);
      }

      let benchmark = null;
      if (options.benchmark) {
        benchmark = await buildBenchmarkResult(promptObject);
      }

      const result = {
        command: "check",
        source: sourceType,
        path: resolved.path,
        benchmark_requested: options.benchmark,
        enrich_requested: options.enrich || options.enrichDebug,
        baseline: options.baseline ?? null,
        intent: promptObject.intent,
        complexity_score: promptObject.complexity_score,
        semantic_drift_risk: promptObject.semantic_drift_risk,
        lint_warnings: promptObject.lint_warnings,
        lint_summary: {
          total: promptObject.lint_warnings.length,
          errors: promptObject.lint_warnings.filter(
            (item) => item.level === "error",
          ).length,
          warnings: promptObject.lint_warnings.filter(
            (item) => item.level === "warning",
          ).length,
        },
        tokens: promptObject.tokens,
        metadata: promptObject.metadata,
        baseline_diff: baselineDiff,
        benchmark,
      };

      if (options.report) {
        const reportFormat = getReportFormatFromPath(options.report);
        const reportContent = renderCheckReport(result, reportFormat);
        await writeFileUtf8(options.report, reportContent);
      }

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (promptObject.lint_warnings.length > 0) {
        printWarning("Prompt checks completed with warnings");
      } else {
        printSuccess("Prompt checks completed successfully");
      }

      printInfo(`Source: ${sourceType}`);
      printInfo(`Intent: ${promptObject.intent || "(not detected)"}`);
      printInfo(`Complexity score: ${promptObject.complexity_score}`);
      printInfo(`Semantic drift risk: ${promptObject.semantic_drift_risk}`);
      printInfo(`Token estimate: ${promptObject.tokens.input}`);
      printInfo(
        `Lint summary: ${result.lint_summary.errors} errors, ${result.lint_summary.warnings} warnings`,
      );
      if (options.report) {
        printInfo(`Report written: ${options.report}`);
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
              console.log(`  - ${field}: ${applied ? "accepted" : "not accepted"}`);
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
      console.log("Lint warnings:");
      if (promptObject.lint_warnings.length === 0) {
        console.log("(none)");
      } else {
        for (const warning of promptObject.lint_warnings) {
          console.log(`- [${warning.code}] ${warning.message}`);
        }
      }

      if (baselineDiff) {
        console.log("");
        console.log("Baseline diff:");
        console.log(`- Intent change risk: ${baselineDiff.intent_change_risk}`);
        console.log(`- Baseline intent: ${baselineDiff.baseline_intent}`);
        console.log(`- Current intent: ${baselineDiff.current_intent}`);
        console.log("- Added sentences:");
        if (baselineDiff.added_sentences.length === 0) {
          console.log("  (none)");
        } else {
          for (const sentence of baselineDiff.added_sentences) {
            console.log(`  - ${sentence}`);
          }
        }
        console.log("- Removed sentences:");
        if (baselineDiff.removed_sentences.length === 0) {
          console.log("  (none)");
        } else {
          for (const sentence of baselineDiff.removed_sentences) {
            console.log(`  - ${sentence}`);
          }
        }
      }

      if (benchmark) {
        console.log("");
        console.log("Benchmark:");
        console.log(
          `- Enabled providers: ${benchmark.enabled_providers.join(", ")}`,
        );
        console.log(
          `- Compact saved ${benchmark.compact_score.saved_tokens} tokens (${benchmark.compact_score.saved_percent}%)`,
        );

        for (const [name, data] of Object.entries(benchmark.variants)) {
          const costText =
            data.estimated_cost === null ? "n/a" : data.estimated_cost;
          console.log(
            `- ${name}: ${data.tokens} tokens | model: ${data.model} | estimated cost: ${costText}`,
          );
        }

        if (benchmark.efficiency_summary?.lowest_token_variant) {
          console.log(
            `- Lowest token variant: ${benchmark.efficiency_summary.lowest_token_variant.provider}`,
          );
        }

        if (benchmark.efficiency_summary?.lowest_cost_variant) {
          console.log(
            `- Lowest cost variant: ${benchmark.efficiency_summary.lowest_cost_variant.provider}`,
          );
        }

        if (benchmark.provider_health.ollama) {
          console.log(
            `- Ollama reachable: ${benchmark.provider_health.ollama.reachable ? "yes" : "no"}`,
          );
          console.log(
            `- Ollama configured model installed: ${benchmark.provider_health.ollama.installed_model ? "yes" : "no"}`,
          );
        }
      }
    });
}