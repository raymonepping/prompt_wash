import { adaptPrompt, scoreRenderedVariants } from "../pipeline/adapt.js";
import { resolveConfig } from "../config/loader.js";
import { createOllamaClient } from "../ollama/client.js";

function tokenCount(text) {
  return Math.ceil((text ?? "").length / 4);
}

export async function buildBenchmarkResult(promptObject) {
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
        tokens: tokenCount(variants.generic)
      },
      compact: {
        tokens: tokenCount(variants.compact)
      },
      openai: {
        tokens: tokenCount(variants.openai)
      },
      claude: {
        tokens: tokenCount(variants.claude)
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