import { getEnvelope, postEnvelope } from "./client";
import type { ApiEnvelope } from "../types/api";
import type {
  AnalyzePromptRequest,
  PromptIR,
  RunPromptRequest,
  VariantKey,
  WorkspaceAnalysis,
  WorkspaceExecution,
  WorkspaceInsights,
} from "../types/workspace";
import { EMPTY_INSIGHTS, EMPTY_PROMPT_IR, EMPTY_VARIANTS } from "../types/workspace";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function toNumberValue(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizePromptIr(value: unknown): PromptIR {
  if (!isRecord(value)) {
    return EMPTY_PROMPT_IR;
  }

  return {
    goal: toStringValue(value.goal),
    audience: toStringValue(value.audience),
    context: toStringValue(value.context),
    constraints: toStringArray(value.constraints),
    steps: toStringArray(value.steps),
    output_format: toStringValue(value.output_format),
    tone: toStringValue(value.tone),
    language: toStringValue(value.language),
    tokens: {
      input: toNumberValue(isRecord(value.tokens) ? value.tokens.input : undefined),
    },
    metadata: isRecord(value.metadata) ? value.metadata : {},
  };
}

function normalizeVariants(value: unknown): Record<VariantKey, string> {
  if (!isRecord(value)) {
    return EMPTY_VARIANTS;
  }

  return {
    generic: toStringValue(value.generic),
    compact: toStringValue(value.compact),
    openai: toStringValue(value.openai),
    claude: toStringValue(value.claude),
  };
}

function normalizeRisk(rawRisk: unknown): WorkspaceInsights["risk"] {
  if (!rawRisk || typeof rawRisk !== "object") {
    return {
      score: 0,
      level: "low",
      notes: [],
    };
  }

  const value = rawRisk as Record<string, unknown>;

  return {
    score: Number(value.score ?? value.risk_score ?? 0),
    level: (value.level ?? value.risk_level ?? "low") as
      | "low"
      | "medium"
      | "high",
    notes: Array.isArray(value.notes)
      ? (value.notes as string[])
      : Array.isArray(value.recommendations)
        ? (value.recommendations as string[])
        : [],
  };
}

function normalizeBias(rawBias: unknown): WorkspaceInsights["bias"] {
  if (!rawBias || typeof rawBias !== "object") {
    return {
      score: 0,
      detected: false,
      notes: [],
    };
  }

  const value = rawBias as Record<string, unknown>;
  const signals =
    value.signals && typeof value.signals === "object"
      ? (value.signals as Record<string, unknown>)
      : {};

  return {
    score: Number(value.score ?? value.bias_score ?? 0),
    detected:
      typeof value.detected === "boolean"
        ? value.detected
        : Object.values(signals).some(Boolean),
    notes: Array.isArray(value.notes)
      ? (value.notes as string[])
      : Array.isArray(value.recommendations)
        ? (value.recommendations as string[])
        : [],
  };
}

function normalizeComplexity(
  rawComplexity: unknown,
): WorkspaceInsights["complexity"] {
  if (!rawComplexity || typeof rawComplexity !== "object") {
    return {
      score: 0,
      level: "low",
    };
  }

  const value = rawComplexity as Record<string, unknown>;

  return {
    score: Number(value.score ?? 0),
    level: (value.level ?? "low") as "low" | "medium" | "high",
  };
}

function normalizeOptimization(
  rawOptimization: unknown,
): WorkspaceInsights["optimization"] {
  if (!rawOptimization || typeof rawOptimization !== "object") {
    return {
      suggestions: [],
      token_savings_estimate: 0,
      semantic_drift_risk: "low",
    };
  }

  const value = rawOptimization as Record<string, unknown>;
  const nested =
    value.optimization && typeof value.optimization === "object"
      ? (value.optimization as Record<string, unknown>)
      : null;

  const suggestions = Array.isArray(value.suggestions)
    ? (value.suggestions as string[])
    : Array.isArray(nested?.recommendations)
      ? (nested.recommendations as string[])
      : Array.isArray(value.recommendations)
        ? (value.recommendations as string[])
        : [];

  const tokenComparison =
    nested?.token_comparison && typeof nested.token_comparison === "object"
      ? (nested.token_comparison as Record<string, unknown>)
      : null;

  return {
    suggestions,
    token_savings_estimate: Number(
      value.token_savings_estimate ??
        nested?.token_savings_estimate ??
        tokenComparison?.saved_tokens ??
        0,
    ),
    semantic_drift_risk: (value.semantic_drift_risk ??
      nested?.semantic_drift_risk ??
      "low") as "low" | "medium" | "high",
  };
}

function normalizeAnalysisPayload(payload: Record<string, unknown>): WorkspaceAnalysis {
  const structuredPrompt = normalizePromptIr(payload.structured_prompt);
  const variants = normalizeVariants(payload.variants);
  const rawTokens = isRecord(payload.tokens) ? payload.tokens : {};
  const insights: WorkspaceInsights = {
    ...EMPTY_INSIGHTS,
    lint: toStringArray(payload.lint),
    risk: normalizeRisk(payload.risk),
    bias: normalizeBias(payload.bias),
    complexity: normalizeComplexity(payload.complexity),
    optimization: normalizeOptimization(payload.optimization),
  };

  return {
    raw_input: String(payload.raw_input ?? ""),
    normalized_prompt: String(payload.normalized_prompt ?? ""),
    structured_prompt: structuredPrompt,
    variants,
    insights,
    tokens: {
      input: toNumberValue(rawTokens.input, structuredPrompt.tokens.input),
      compact: toNumberValue(rawTokens.compact, 0),
    },
    execution: normalizeExecutionPayload(payload.execution),
    metadata: (payload.metadata ?? {}) as Record<string, unknown>,
  };
}

function normalizeExecutionPayload(payload: unknown): WorkspaceExecution | null {
  if (!isRecord(payload)) {
    return null;
  }

  const artifact = isRecord(payload.artifact) ? payload.artifact : null;
  const artifactExecution = artifact && isRecord(artifact.execution) ? artifact.execution : null;
  const payloadExecution = isRecord(payload.execution) ? payload.execution : null;
  const execution = artifactExecution ?? payloadExecution;

  const artifactOutput = artifact && isRecord(artifact.output) ? artifact.output : null;
  const payloadOutput = isRecord(payload.output) ? payload.output : null;
  const output = artifactOutput ?? payloadOutput;

  return {
    model: toStringValue(execution?.model, "unknown"),
    provider: toStringValue(execution?.provider, "unknown"),
    input_tokens: toNumberValue(payload.input_tokens),
    output_tokens: toNumberValue(payload.output_tokens),
    latency_ms: toNumberValue(execution?.latency_ms ?? payload.latency_ms),
    result: toStringValue(output?.text ?? payload.result),
    timestamp:
      toNullableString(artifact?.created_at) ??
      toNullableString(payload.created_at) ??
      undefined,
  };
}

function normalizeRequiredExecutionPayload(payload: unknown): WorkspaceExecution {
  return (
    normalizeExecutionPayload(payload) ?? {
      model: "unknown",
      provider: "unknown",
      input_tokens: 0,
      output_tokens: 0,
      latency_ms: 0,
      result: "",
    }
  );
}

export const workspaceApi = {
  async analyzePrompt(
    payload: AnalyzePromptRequest,
  ): Promise<ApiEnvelope<WorkspaceAnalysis>> {
    const envelope = await postEnvelope<UnknownRecord, AnalyzePromptRequest>(
      "/workspace/analyze",
      payload,
    );

    return {
      ...envelope,
      data: normalizeAnalysisPayload(envelope.data),
    };
  },

  async fetchWorkspaceState(): Promise<ApiEnvelope<WorkspaceAnalysis>> {
    const envelope = await getEnvelope<UnknownRecord>("/workspace/state");

    return {
      ...envelope,
      data: normalizeAnalysisPayload(envelope.data),
    };
  },

  async runPrompt(
    payload: RunPromptRequest,
  ): Promise<ApiEnvelope<WorkspaceExecution>> {
    const envelope = await postEnvelope<UnknownRecord, RunPromptRequest>(
      "/workspace/run",
      payload,
    );

    return {
      ...envelope,
      data: normalizeRequiredExecutionPayload(envelope.data),
    };
  },
};
