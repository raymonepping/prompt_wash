import { printInfo, printJson, printSuccess } from "../utils/display.js";
import { resolveInputSource, writeFileUtf8 } from "../utils/input.js";
import { adaptPrompt, scoreRenderedVariants } from "../pipeline/adapt.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";

export function registerRenderCommand(program) {
  program
    .command("render")
    .description("Render Prompt IR into provider-specific prompt variants")
    .argument(
      "[input]",
      "Prompt IR, PromptWash JSON, raw prompt, or path to a file",
    )
    .option("-f, --file", "Treat input as a file path")
    .option(
      "-p, --provider <provider>",
      "Target provider: openai|claude|generic|compact",
      "generic",
    )
    .option("--write <path>", "Write rendered output to a file")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const variants = {
        generic: adaptPrompt(promptObject, "generic"),
        compact: adaptPrompt(promptObject, "compact"),
        openai: adaptPrompt(promptObject, "openai"),
        claude: adaptPrompt(promptObject, "claude"),
      };

      const rendered = variants[options.provider] ?? variants.generic;
      const compactScore = scoreRenderedVariants(variants);

      if (options.write) {
        await writeFileUtf8(options.write, `${rendered}\n`);
      }

      const result = {
        provider: options.provider,
        source: sourceType,
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
      printInfo(`Source: ${sourceType}`);
      if (resolved.path) {
        printInfo(`Path: ${resolved.path}`);
      }
      if (options.write) {
        printInfo(`Rendered output written: ${options.write}`);
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
