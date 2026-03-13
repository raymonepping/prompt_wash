import { performance } from "node:perf_hooks";

import { resolveConfig } from "../config/loader.js";
import { generateText } from "../ollama/client.js";
import { assertProviderResponse } from "../services/execution/provider_interface.js";

export async function runWithOllama(renderedPrompt) {
  const config = await resolveConfig();
  const model = config.ollama?.model ?? "llama3:latest";

  const started = performance.now();
  const text = await generateText({
    prompt: renderedPrompt,
    model,
  });
  const latencyMs = Math.round(performance.now() - started);

  const result = {
    provider: "ollama",
    model,
    text,
    latency_ms: latencyMs,
  };

  assertProviderResponse(result);

  return result;
}
