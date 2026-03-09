import { printInfo, printJson, printSuccess } from "../utils/display.js";
import { resolveInputSource } from "../utils/input.js";
import { runPipeline } from "../pipeline/index.js";
import { adaptPrompt, scoreRenderedVariants } from "../pipeline/adapt.js";

export function registerRenderCommand(program) {
  program
    .command("render")
    .description("Render Prompt IR into provider-specific prompt variants")
    .argument("[input]", "Prompt IR or path to a file")
    .option("-f, --file", "Treat input as a file path")
    .option(
      "-p, --provider <provider>",
      "Target provider: openai|claude|generic|compact",
      "generic",
    )
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const promptObject = await runPipeline(resolved.value, {
        source: resolved.kind,
        path: resolved.path,
      });

      const variants = {
        generic: adaptPrompt(promptObject, "generic"),
        compact: adaptPrompt(promptObject, "compact"),
        openai: adaptPrompt(promptObject, "openai"),
        claude: adaptPrompt(promptObject, "claude"),
      };

      const rendered = variants[options.provider] ?? variants.generic;
      const compactScore = scoreRenderedVariants(variants);

      const result = {
        provider: options.provider,
        source: resolved.kind,
        path: resolved.path,
        goal: promptObject.ir.goal,
        context: promptObject.ir.context,
        constraints: promptObject.ir.constraints,
        audience: promptObject.ir.audience,
        output_format: promptObject.ir.output_format,
        compact_score: compactScore,
        rendered,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Prompt rendered successfully");
      printInfo(`Provider: ${options.provider}`);
      if (resolved.path) {
        printInfo(`Path: ${resolved.path}`);
      }

      if (options.provider === "compact") {
        printInfo(
          `Compact saved ${compactScore.saved_tokens} tokens (${compactScore.saved_percent}%) versus generic`,
        );
      }

      console.log("");
      console.log(rendered);
    });
}
