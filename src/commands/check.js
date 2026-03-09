import { printInfo, printJson, printSuccess, printWarning } from "../utils/display.js";
import { resolveInputSource, readFileUtf8 } from "../utils/input.js";
import { runPipeline } from "../pipeline/index.js";
import { adaptPrompt, scoreRenderedVariants } from "../pipeline/adapt.js";
import { resolveConfig } from "../config/loader.js";
import { createOllamaClient } from "../ollama/client.js";

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function computeBaselineDiff(currentPrompt, baselinePrompt) {
  const currentSentences = new Set(splitSentences(currentPrompt.cleaned));
  const baselineSentences = new Set(splitSentences(baselinePrompt.cleaned));

  const added = [...currentSentences].filter((item) => !baselineSentences.has(item));
  const removed = [...baselineSentences].filter((item) => !currentSentences.has(item));

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
    current_intent: currentPrompt.intent
  };
}

async function buildBenchmarkResult(promptObject) {
  const config = await resolveConfig();
  const providers = config.benchmark?.enableProviders ?? ["ollama"];

  const variants = {
    generic: adaptPrompt(promptObject, "generic"),
    compact: adaptPrompt(promptObject, "compact"),
    openai: adaptPrompt(promptObject, "openai"),
    claude: adaptPrompt(promptObject, "claude")
  };

  const compactScore = scoreRenderedVariants(variants);

  const benchmark = {
    enabled_providers: providers,
    variants: {
      generic: {
        tokens: Math.ceil(variants.generic.length / 4)
      },
      compact: {
        tokens: Math.ceil(variants.compact.length / 4)
      },
      openai: {
        tokens: Math.ceil(variants.openai.length / 4)
      },
      claude: {
        tokens: Math.ceil(variants.claude.length / 4)
      }
    },
    compact_score: compactScore,
    provider_health: {}
  };

  if (providers.includes("ollama")) {
    const client = createOllamaClient(config.ollama);
    benchmark.provider_health.ollama = await client.healthCheck();
  }

  return benchmark;
}

export function registerCheckCommand(program) {
  program
    .command("check")
    .description("Lint, analyze, compare, and benchmark prompts")
    .argument("[input]", "Prompt text, Prompt IR, or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option("--benchmark", "Run benchmark flow if configured", false)
    .option("--baseline <path>", "Optional baseline prompt or IR file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const promptObject = await runPipeline(resolved.value, {
        source: resolved.kind,
        path: resolved.path
      });

      let baselineDiff = null;

      if (options.baseline) {
        const baselineRaw = await readFileUtf8(options.baseline);
        const baselinePrompt = await runPipeline(baselineRaw, {
          source: "baseline_file",
          path: options.baseline
        });

        baselineDiff = computeBaselineDiff(promptObject, baselinePrompt);
      }

      let benchmark = null;
      if (options.benchmark) {
        benchmark = await buildBenchmarkResult(promptObject);
      }

      const result = {
        command: "check",
        source: resolved.kind,
        path: resolved.path,
        benchmark_requested: options.benchmark,
        baseline: options.baseline ?? null,
        intent: promptObject.intent,
        complexity_score: promptObject.complexity_score,
        semantic_drift_risk: promptObject.semantic_drift_risk,
        lint_warnings: promptObject.lint_warnings,
        lint_summary: {
          total: promptObject.lint_warnings.length,
          errors: promptObject.lint_warnings.filter((item) => item.level === "error").length,
          warnings: promptObject.lint_warnings.filter((item) => item.level === "warning").length
        },
        tokens: promptObject.tokens,
        metadata: promptObject.metadata,
        baseline_diff: baselineDiff,
        benchmark
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (promptObject.lint_warnings.length > 0) {
        printWarning("Prompt checks completed with warnings");
      } else {
        printSuccess("Prompt checks completed successfully");
      }

      printInfo(`Intent: ${promptObject.intent || "(not detected)"}`);
      printInfo(`Complexity score: ${promptObject.complexity_score}`);
      printInfo(`Semantic drift risk: ${promptObject.semantic_drift_risk}`);
      printInfo(`Token estimate: ${promptObject.tokens.input}`);
      printInfo(
        `Lint summary: ${result.lint_summary.errors} errors, ${result.lint_summary.warnings} warnings`
      );

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
        console.log(`- Enabled providers: ${benchmark.enabled_providers.join(", ")}`);
        console.log(
          `- Compact saved ${benchmark.compact_score.saved_tokens} tokens (${benchmark.compact_score.saved_percent}%)`
        );
        for (const [name, data] of Object.entries(benchmark.variants)) {
          console.log(`- ${name}: ${data.tokens} tokens`);
        }
        if (benchmark.provider_health.ollama) {
          console.log(
            `- Ollama reachable: ${benchmark.provider_health.ollama.reachable ? "yes" : "no"}`
          );
          console.log(
            `- Ollama configured model installed: ${benchmark.provider_health.ollama.installed_model ? "yes" : "no"}`
          );
        }
      }
    });
}