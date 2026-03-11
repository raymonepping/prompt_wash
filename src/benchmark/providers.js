import { adaptPrompt, scoreRenderedVariants } from "../pipeline/adapt.js";
import { resolveConfig } from "../config/loader.js";
import { createOllamaClient } from "../ollama/client.js";

function tokenCount(text) {
  return Math.ceil((text ?? "").length / 4);
}

function estimateVariantCost(tokens, provider, config) {
  const pricing = config.benchmark?.pricing ?? {};

  const configuredPrice = pricing[provider];
  if (typeof configuredPrice !== "number") {
    return null;
  }

  return Number((tokens * configuredPrice).toFixed(6));
}

function buildVariantMetrics(variants, config) {
  const result = {};

  for (const [provider, text] of Object.entries(variants)) {
    const tokens = tokenCount(text);

    result[provider] = {
      tokens,
      estimated_cost: estimateVariantCost(tokens, provider, config),
    };
  }

  return result;
}

export async function buildBenchmarkResult(promptObject) {
  const config = await resolveConfig();
  const providers = config.benchmark?.enableProviders ?? ["ollama"];

  const variants = {
    generic: adaptPrompt(promptObject, "generic"),
    compact: adaptPrompt(promptObject, "compact"),
    openai: adaptPrompt(promptObject, "openai"),
    claude: adaptPrompt(promptObject, "claude"),
  };

  const compactScore = scoreRenderedVariants(variants);

  const benchmark = {
    enabled_providers: providers,
    variants: buildVariantMetrics(variants, config),
    compact_score: compactScore,
    provider_health: {},
  };

  if (providers.includes("ollama")) {
    const client = createOllamaClient(config.ollama);
    benchmark.provider_health.ollama = await client.healthCheck();
  }

  return benchmark;
}
