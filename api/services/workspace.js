import { runPipeline } from "../../src/pipeline/index.js";
import { adaptPrompt } from "../../src/pipeline/adapt.js";
import { analyzePromptRisk } from "../../src/services/governance/risk_scoring.js";
import { analyzePromptBias } from "../../src/services/governance/bias_detection.js";
import { optimizePromptObject } from "../../src/services/optimization/optimize.js";
import { executePromptObject } from "../../src/services/execution/execute.js";
import { evaluateRunArtifact } from "../../src/services/evaluation/evaluate.js";

let lastWorkspaceState = {
  raw_input: "",
  normalized_prompt: "",
  structured_prompt: null,
  variants: {},
  lint: [],
  risk: null,
  bias: null,
  tokens: {},
  complexity: null,
  optimization: null,
  execution: null,
};

export async function analyzeWorkspaceState({ rawInput, context = {} }) {
  if (!rawInput || typeof rawInput !== "string") {
    const error = new Error("raw_input must be a non-empty string");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const promptObject = await runPipeline(rawInput, {
    source: "api_workspace",
    path: null,
    enrich: Boolean(context.enrich),
  });

  const [risk, bias] = await Promise.all([
    analyzePromptRisk(promptObject),
    analyzePromptBias(promptObject),
  ]);

  const variants = {
    generic: adaptPrompt(promptObject, "generic"),
    compact: adaptPrompt(promptObject, "compact"),
    openai: adaptPrompt(promptObject, "openai"),
    claude: adaptPrompt(promptObject, "claude"),
  };

  const optimization = await optimizePromptObject(promptObject, {
    originalMode: "generic",
    optimizedMode: "compact",
  });

  lastWorkspaceState = {
    raw_input: rawInput,
    normalized_prompt: promptObject.cleaned,
    structured_prompt: {
      goal: promptObject.ir?.goal ?? "",
      audience: promptObject.ir?.audience ?? "",
      context: promptObject.ir?.context ?? "",
      constraints: promptObject.ir?.constraints ?? [],
      steps: promptObject.ir?.steps ?? [],
      output_format: promptObject.ir?.output_format ?? "",
      tone: promptObject.ir?.tone ?? "",
      language: promptObject.ir?.language ?? "",
    },
    variants,
    lint: promptObject.lint_warnings ?? [],
    risk,
    bias,
    tokens: promptObject.tokens ?? {},
    complexity: {
      score: promptObject.complexity_score ?? null,
      semantic_drift_risk: promptObject.semantic_drift_risk ?? null,
    },
    optimization,
    execution: null,
  };

  return lastWorkspaceState;
}

export async function runPromptFromWorkspace({
  prompt,
  model = null,
  provider = "ollama",
  renderMode = "generic",
}) {
  if (!prompt || typeof prompt !== "string") {
    const error = new Error("prompt must be a non-empty string");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const promptObject = await runPipeline(prompt, {
    source: "api_run",
    path: null,
    enrich: false,
  });

  const executionResult = await executePromptObject(promptObject, {
    provider,
    renderMode,
    persist: false,
    source: {
      type: "api_run",
      path: null,
      lineage: null,
    },
  });

  const evaluation = evaluateRunArtifact(executionResult.artifact);

  const execution = {
    artifact: executionResult.artifact,
    saved_path: executionResult.saved_path,
    evaluation,
  };

  lastWorkspaceState = {
    ...lastWorkspaceState,
    execution,
  };

  return execution;
}

export async function getWorkspaceSnapshot() {
  return lastWorkspaceState;
}
