import { printInfo, printJson, printSuccess } from "../utils/display.js";
import { resolveInputSource, writeFileUtf8 } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { adaptPrompt } from "../pipeline/adapt.js";
import { buildBenchmarkResult } from "../benchmark/providers.js";
import { renderCheckReport } from "../utils/report.js";
import {
  buildBundleManifest,
  buildBundlePaths,
  sanitizeBundleName,
} from "../utils/bundle.js";

export function registerBundleCommand(program) {
  program
    .command("bundle")
    .description("Export a complete PromptWash bundle for one prompt")
    .argument(
      "[input]",
      "Prompt text, PromptWash JSON, Prompt IR, or path to a file",
    )
    .option("-f, --file", "Treat input as a file path")
    .option("--name <name>", "Bundle name", "promptwash-bundle")
    .option(
      "-p, --provider <provider>",
      "Rendered provider: openai|claude|generic|compact",
      "generic",
    )
    .option("--dir <path>", "Base output directory", "bundle")
    .option("--enrich", "Use Ollama enrichment before bundling", false)
    .option(
      "--benchmark",
      "Include benchmark data in the generated check report",
      true,
    )
    .option("--report-mode <mode>", "Check report mode: summary|full", "full")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: options.enrich },
      );

      const rendered = adaptPrompt(promptObject, options.provider);
      const benchmark = options.benchmark
        ? await buildBenchmarkResult(promptObject)
        : null;

      const checkResult = {
        command: "check",
        source: sourceType,
        path: resolved.path,
        benchmark_requested: options.benchmark,
        enrich_requested: options.enrich,
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
        comparison: null,
        report_metadata: {
          generated_at: new Date().toISOString(),
          fingerprint: promptObject.fingerprint ?? null,
          report_mode: options.reportMode,
        },
      };

      const bundleName = sanitizeBundleName(options.name);
      const files = buildBundlePaths(options.dir, bundleName, options.provider);

      await writeFileUtf8(
        files.prompt_json,
        `${JSON.stringify(promptObject, null, 2)}\n`,
      );
      await writeFileUtf8(files.rendered_txt, `${rendered}\n`);
      await writeFileUtf8(
        files.check_report,
        renderCheckReport(checkResult, "markdown", options.reportMode),
      );

      const manifest = buildBundleManifest({
        name: bundleName,
        provider: options.provider,
        source: sourceType,
        inputPath: resolved.path,
        files,
        promptObject,
      });

      await writeFileUtf8(
        files.manifest_json,
        `${JSON.stringify(manifest, null, 2)}\n`,
      );

      const result = {
        command: "bundle",
        name: bundleName,
        provider: options.provider,
        source: sourceType,
        path: resolved.path,
        files,
        fingerprint: promptObject.fingerprint,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("PromptWash bundle created successfully");
      printInfo(`Bundle: ${bundleName}`);
      printInfo(`Provider: ${options.provider}`);
      printInfo(`Source: ${sourceType}`);
      printInfo(`Directory: ${files.bundle_dir}`);
      console.log("");
      console.log("Files:");
      console.log(`- ${files.prompt_json}`);
      console.log(`- ${files.rendered_txt}`);
      console.log(`- ${files.check_report}`);
      console.log(`- ${files.manifest_json}`);
    });
}
