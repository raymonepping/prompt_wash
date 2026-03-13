import { adaptPrompt } from "../../pipeline/adapt.js";
import { createExecutionArtifact } from "./schema.js";
import { saveExecutionArtifact } from "./storage.js";
import { runWithOllama } from "../../providers/ollama.js";

function buildRunId() {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+Z$/, "Z")
    .replace("T", "_")
    .replace("Z", "");

  const suffix = Math.random().toString(16).slice(2, 8);
  return `run_${timestamp}_${suffix}`;
}

export async function executePromptObject(promptObject, options = {}) {
  const provider = options.provider ?? "ollama";
  const renderMode = options.renderMode ?? "generic";
  const persist = options.persist ?? false;
  const source = options.source ?? {
    type: "argument",
    path: null,
  };

  if (provider !== "ollama") {
    throw new Error(`Unsupported execution provider for Step 1: ${provider}`);
  }

  const renderedPrompt = adaptPrompt(promptObject, renderMode);
  const providerResult = await runWithOllama(renderedPrompt);

  const artifact = createExecutionArtifact({
    runId: buildRunId(),
    source,
    prompt: {
      fingerprint: promptObject.fingerprint ?? null,
      intent: promptObject.intent ?? "",
      audience: promptObject.audience ?? "",
      output_format: promptObject.ir?.output_format ?? "",
    },
    execution: {
      provider: providerResult.provider,
      model: providerResult.model,
      render_mode: renderMode,
      latency_ms: providerResult.latency_ms,
    },
    input: {
      rendered_prompt: renderedPrompt,
    },
    output: {
      text: providerResult.text,
    },
    metadata: {
      success: true,
      error: null,
    },
  });

  let savedPath = null;
  if (persist) {
    savedPath = await saveExecutionArtifact(artifact);
  }

  return {
    artifact,
    saved_path: savedPath,
  };
}
