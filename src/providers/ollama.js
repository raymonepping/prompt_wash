import { performance } from "node:perf_hooks";

import { resolveConfig } from "../config/loader.js";
import { createOllamaClient } from "../ollama/client.js";
import { assertProviderResponse } from "../services/execution/provider_interface.js";

export async function runWithOllama(renderedPrompt) {
  const config = await resolveConfig();
  const model = config.ollama?.model ?? "llama3:latest";

  const client = createOllamaClient({
    baseUrl: config.ollama?.baseUrl,
    model,
    timeoutMs: config.ollama?.timeoutMs,
  });

  const started = performance.now();
  const response = await client.generateText({
    prompt: renderedPrompt,
  });
  const latencyMs = Math.round(performance.now() - started);

  const result = {
    provider: "ollama",
    model,
    text: response.text,
    latency_ms: latencyMs,
  };

  assertProviderResponse(result);

  return result;
}
