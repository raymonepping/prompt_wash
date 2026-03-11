import { adaptPrompt, scoreRenderedVariants } from "../pipeline/adapt.js";
import { resolveConfig } from "../config/loader.js";
import { createOllamaClient } from "../ollama/client.js";

function tokenCount(text) {
  return Math.ceil((text ?? "").length / 4);
}

function getConfiguredModel(provider, config) {
  const model = config.benchmark?.models?.[provider];

  if (typeof model === "string" && model.trim()) {
    return model;
  }

  if (provider === "ollama") {
    return config.ollama?.model ?? "ollama-default";
  }

  return `${provider}-default`;
}

function getConfiguredPrice(provider, config) {
  const price = config.benchmark?.pricing?.[provider];

  if (typeof price === "number" && !Number.isNaN(price) && price >= 0) {
    return price;
  }

  return null;
}

function estimateVariantCost(tokens, provider, config) {
  const configuredPrice = getConfiguredPrice(provider, config);

  if (configuredPrice === null) {
    return null;
  }

  return Number((tokens * configuredPrice).toFixed(6));
}

function estimateCostPer1k(provider, config) {
  const configuredPrice = getConfiguredPrice(provider, config);

  if (configuredPrice === null) {
    return null;
  }

  return Number((configuredPrice * 1000).toFixed(6));
}

function buildVariantMetrics(variants, config) {
  const result = {};

  for (const [provider, text] of Object.entries(variants)) {
    const tokens = tokenCount(text);
    const estimatedCost = estimateVariantCost(tokens, provider, config);

    result[provider] = {
      provider,
      model: getConfiguredModel(provider, config),
      tokens,
      estimated_cost: estimatedCost,
      estimated_cost_per_1k_tokens: estimateCostPer1k(provider, config),
    };
  }

  return result;
}

function buildEfficiencySummary(variants) {
  const entries = Object.entries(variants);

  if (entries.length === 0) {
    return {
      lowest_token_variant: null,
      highest_token_variant: null,
      lowest_cost_variant: null,
    };
  }

  let lowestToken = null;
  let highestToken = null;
  let lowestCost = null;

  for (const [provider, metrics] of entries) {
    if (!lowestToken || metrics.tokens < lowestToken.tokens) {
      lowestToken = { provider, ...metrics };
    }

    if (!highestToken || metrics.tokens > highestToken.tokens) {
      highestToken = { provider, ...metrics };
    }

    if (
      metrics.estimated_cost !== null &&
      (!lowestCost || metrics.estimated_cost < lowestCost.estimated_cost)
    ) {
      lowestCost = { provider, ...metrics };
    }
  }

  return {
    lowest_token_variant: lowestToken,
    highest_token_variant: highestToken,
    lowest_cost_variant: lowestCost,
  };
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
  const variantMetrics = buildVariantMetrics(variants, config);

  const benchmark = {
    enabled_providers: providers,
    variants: variantMetrics,
    compact_score: compactScore,
    efficiency_summary: buildEfficiencySummary(variantMetrics),
    provider_health: {},
  };

  if (providers.includes("ollama")) {
    const client = createOllamaClient(config.ollama);
    benchmark.provider_health.ollama = await client.healthCheck();
  }

  return benchmark;
}