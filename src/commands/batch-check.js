import { printInfo, printJson, printSuccess, printWarning } from "../utils/display.js";
import { readFileUtf8, writeFileUtf8 } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { buildBenchmarkResult } from "../benchmark/providers.js";
import { listBatchFiles, summarizeBatchResults } from "../utils/batch.js";
import { getReportFormatFromPath } from "../utils/report.js";
import { renderBatchReport } from "../utils/batch-report.js";

async function buildSingleBatchCheckResult(filePath, options) {
  try {
    const resolved = {
      kind: "batch_file",
      value: await readFileUtf8(filePath),
      path: filePath,
    };

    const { promptObject, sourceType } = await resolvePromptObjectFromSource(
      resolved,
      { enrich: options.enrich || options.enrichDebug },
    );

    let benchmark = null;
    if (options.benchmark) {
      benchmark = await buildBenchmarkResult(promptObject);
    }

    return {
      ok: true,
      path: filePath,
      result: {
        command: "check",
        source: sourceType,
        path: filePath,
        benchmark_requested: options.benchmark,
        enrich_requested: options.enrich || options.enrichDebug,
        baseline: null,
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
        baseline_diff: null,
        benchmark,
      },
    };
  } catch (error) {
    return {
      ok: false,
      path: filePath,
      error: {
        message: error.message,
        code: error.code ?? "UNKNOWN",
        details: error.details ?? null,
      },
    };
  }
}

export function registerBatchCheckCommand(program) {
  program
    .command("batch-check")
    .description("Run PromptWash checks across multiple prompt files or artifacts")
    .argument("<target>", "Directory or file to process")
    .option("--benchmark", "Run benchmark flow for each file", false)
    .option("--enrich", "Use Ollama enrichment before checking", false)
    .option("--enrich-debug", "Enable enrichment during batch checking", false)
    .option("--report <path>", "Write batch report to a file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (target, options) => {
      const files = await listBatchFiles(target);
      const results = [];

      for (const filePath of files) {
        results.push(await buildSingleBatchCheckResult(filePath, options));
      }

      const batchResult = {
        command: "batch-check",
        target,
        generated_at: new Date().toISOString(),
        summary: summarizeBatchResults(results),
        results,
      };

      if (options.report) {
        const reportFormat = getReportFormatFromPath(options.report);
        const reportContent = renderBatchReport(batchResult, reportFormat);
        await writeFileUtf8(options.report, reportContent);
      }

      if (options.output === "json") {
        printJson(batchResult);
        return;
      }

      if (batchResult.summary.failed > 0) {
        printWarning("Batch check completed with failures");
      } else if (batchResult.summary.total_warnings > 0) {
        printWarning("Batch check completed with warnings");
      } else {
        printSuccess("Batch check completed successfully");
      }

      printInfo(`Target: ${target}`);
      printInfo(`Total files: ${batchResult.summary.total_files}`);
      printInfo(`Successful: ${batchResult.summary.successful}`);
      printInfo(`Failed: ${batchResult.summary.failed}`);
      printInfo(`Total warnings: ${batchResult.summary.total_warnings}`);
      printInfo(`Total errors: ${batchResult.summary.total_errors}`);

      if (options.report) {
        printInfo(`Report written: ${options.report}`);
      }

      console.log("");
      console.log("Files:");
      for (const item of results) {
        if (item.ok) {
          console.log(
            `- ${item.path}: ok (${item.result.lint_summary.errors} errors, ${item.result.lint_summary.warnings} warnings)`,
          );
        } else {
          console.log(`- ${item.path}: failed (${item.error.code})`);
        }
      }
    });
}