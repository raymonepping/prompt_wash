import type {
  AnalyzePromptRequest,
  ApiEnvelope,
  PromptIR,
  RunPromptRequest,
  VariantKey,
  WorkspaceExecution,
  WorkspaceAnalysis,
  WorkspaceInsights,
} from "../types/workspace";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:3000/api";
const ANALYZE_ENDPOINT = `${API_BASE_URL}/workspace/analyze`;
const RUN_ENDPOINT = `${API_BASE_URL}/workspace/run`;

function normalizePrompt(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function estimateTokens(input: string): number {
  if (!input.trim()) {
    return 0;
  }

  return Math.max(1, Math.ceil(input.trim().split(/\s+/).length * 1.3));
}

function detectLanguage(input: string): string {
  const hasDutchSignals = /\b(ik|wat|kun|graag|schrijf|maak|voor)\b/i.test(input);
  return hasDutchSignals ? "nl" : "en";
}

function detectTone(input: string): string {
  if (/brutally honest/i.test(input)) {
    return "brutally honest";
  }

  if (/professional/i.test(input)) {
    return "professional";
  }

  if (/casual/i.test(input)) {
    return "casual";
  }

  return "neutral";
}

function detectOutputFormat(input: string): string {
  if (/\bjson\b/i.test(input)) {
    return "json";
  }

  if (/\btable\b/i.test(input)) {
    return "table";
  }

  if (/\bmarkdown\b/i.test(input)) {
    return "markdown";
  }

  if (/\bbullet\b|\blist\b/i.test(input)) {
    return "bullet list";
  }

  if (/\bcode\b|\bscript\b/i.test(input)) {
    return "code";
  }

  return "";
}

function detectAudience(input: string): string {
  if (/\bbeginner\b/i.test(input)) {
    return "beginner";
  }

  if (/\bexecutive\b|\bcxo\b/i.test(input)) {
    return "executive";
  }

  if (/\bdeveloper\b|\bengineer\b/i.test(input)) {
    return "developer";
  }

  return "general";
}

function detectConstraints(input: string): string[] {
  const constraints = new Set<string>();

  if (/simple language/i.test(input)) {
    constraints.add("use simple language");
  }

  if (/include examples/i.test(input)) {
    constraints.add("include examples");
  }

  if (/avoid jargon/i.test(input)) {
    constraints.add("avoid jargon");
  }

  if (/concise|brief/i.test(input)) {
    constraints.add("be concise");
  }

  return [...constraints];
}

function detectSteps(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+[.)-]\s+/.test(line))
    .map((line) => line.replace(/^\d+[.)-]\s+/, ""));
}

function detectGoal(input: string): string {
  const cleaned = normalizePrompt(input);

  if (!cleaned) {
    return "";
  }

  const sentences = cleaned.split(/[.!?]\s+/).filter(Boolean);
  return sentences[0] ?? cleaned;
}

function buildPromptIR(rawInput: string, normalizedPrompt: string): PromptIR {
  const inputTokens = estimateTokens(normalizedPrompt);

  return {
    goal: detectGoal(rawInput),
    audience: detectAudience(rawInput),
    context: "",
    constraints: detectConstraints(rawInput),
    steps: detectSteps(rawInput),
    output_format: detectOutputFormat(rawInput),
    tone: detectTone(rawInput),
    language: detectLanguage(rawInput),
    tokens: {
      input: inputTokens,
    },
    metadata: {
      parser: "local-mock",
      fingerprint_seed: normalizedPrompt.slice(0, 24),
    },
  };
}

function renderSections(label: string, values: string[]): string {
  if (values.length === 0) {
    return "";
  }

  return `${label}:\n${values.map((value) => `- ${value}`).join("\n")}`;
}

function renderSteps(values: string[]): string {
  if (values.length === 0) {
    return "";
  }

  return `Steps:\n${values.map((value, index) => `${index + 1}. ${value}`).join("\n")}`;
}

function renderVariant(ir: PromptIR, variant: VariantKey): string {
  const orderedSections: string[] = [];

  if (variant === "claude") {
    orderedSections.push("You are a careful assistant.");
  }

  if (ir.context) {
    orderedSections.push(`Context:\n${ir.context}`);
  }

  orderedSections.push(
    `${variant === "claude" ? "Request" : "Task"}:\n${ir.goal || "Describe the user intent clearly."}`,
  );

  if (ir.audience) {
    orderedSections.push(`Audience:\n${ir.audience}`);
  }

  const constraintBlock = renderSections("Constraints", ir.constraints);
  if (constraintBlock) {
    orderedSections.push(constraintBlock);
  }

  const stepsBlock = renderSteps(ir.steps);
  if (stepsBlock) {
    orderedSections.push(stepsBlock);
  }

  if (ir.output_format) {
    orderedSections.push(`Output Format:\n${ir.output_format}`);
  }

  if (ir.tone) {
    orderedSections.push(`Tone:\n${ir.tone}`);
  }

  if (ir.language) {
    orderedSections.push(`Language:\n${ir.language}`);
  }

  const generic = orderedSections.filter(Boolean).join("\n\n");

  if (variant === "generic" || variant === "openai" || variant === "claude") {
    return generic;
  }

  const compactParts = [
    ir.context ? `Context: ${ir.context}` : "",
    ir.goal,
    ir.audience ? `Audience: ${ir.audience}` : "",
    ir.constraints.length > 0 ? `Constraints: ${ir.constraints.join("; ")}` : "",
    ir.steps.length > 0 ? `Steps: ${ir.steps.join("; ")}` : "",
    ir.output_format ? `Output: ${ir.output_format}` : "",
    ir.tone ? `Tone: ${ir.tone}` : "",
    ir.language ? `Language: ${ir.language}` : "",
  ].filter(Boolean);

  return compactParts.join(". ");
}

function buildInsights(rawInput: string, normalizedPrompt: string, compactVariant: string): WorkspaceInsights {
  const lint: string[] = [];

  if (rawInput.trim().length < 20) {
    lint.push("Prompt is very short. Intent may be underspecified.");
  }

  if (!/[.!?]$/.test(normalizedPrompt) && normalizedPrompt.length > 0) {
    lint.push("Prompt has no terminal punctuation. This is fine, but structure may improve with clearer sentence boundaries.");
  }

  const inputTokens = estimateTokens(normalizedPrompt);
  const compactTokens = estimateTokens(compactVariant);
  const savings = Math.max(0, inputTokens - compactTokens);

  return {
    lint,
    risk: {
      score: rawInput.toLowerCase().includes("favor") ? 42 : 18,
      level: rawInput.toLowerCase().includes("favor") ? "medium" : "low",
      notes: rawInput.toLowerCase().includes("favor")
        ? ["Prompt may contain directional bias requests."]
        : ["No major risk signals detected."],
    },
    bias: {
      score: rawInput.toLowerCase().includes("favor") ? 58 : 8,
      detected: rawInput.toLowerCase().includes("favor"),
      notes: rawInput.toLowerCase().includes("favor")
        ? ["Biasing language detected."]
        : ["No explicit bias signal detected."],
    },
    complexity: {
      score: Math.min(100, Math.max(8, Math.round(inputTokens / 2))),
      level: inputTokens > 80 ? "high" : inputTokens > 35 ? "medium" : "low",
    },
    optimization: {
      suggestions: [
        "Clarify the target audience if the response needs a specific reading level.",
        "Convert multiple goals into explicit ordered steps when exact output control matters.",
        "Use the compact variant only after verifying that structure is still clear.",
      ],
      token_savings_estimate: savings,
      semantic_drift_risk: savings > 20 ? "medium" : "low",
    },
  };
}

function createMockAnalysis(rawInput: string): WorkspaceAnalysis {
  const normalizedPrompt = normalizePrompt(rawInput);
  const structuredPrompt = buildPromptIR(rawInput, normalizedPrompt);

  const variants = {
    generic: renderVariant(structuredPrompt, "generic"),
    compact: renderVariant(structuredPrompt, "compact"),
    openai: renderVariant(structuredPrompt, "openai"),
    claude: renderVariant(structuredPrompt, "claude"),
  };

  return {
    raw_input: rawInput,
    normalized_prompt: normalizedPrompt,
    structured_prompt: structuredPrompt,
    variants,
    insights: buildInsights(rawInput, normalizedPrompt, variants.compact),
    tokens: {
      input: structuredPrompt.tokens.input,
      compact: estimateTokens(variants.compact),
    },
    execution: null,
    metadata: {
      source: "mock-local-analysis",
    },
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
  const structuredPrompt = payload.structured_prompt as PromptIR;
  const variants = payload.variants as Record<VariantKey, string>;
  const tokens = (payload.tokens ?? {
    input: structuredPrompt?.tokens?.input ?? 0,
  }) as WorkspaceAnalysis["tokens"];

  const insights: WorkspaceInsights =
    "insights" in payload && payload.insights
      ? (payload.insights as WorkspaceInsights)
      : {
          lint: Array.isArray(payload.lint) ? (payload.lint as string[]) : [],
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
    tokens,
    execution: (payload.execution ?? null) as WorkspaceExecution | null,
    metadata: (payload.metadata ?? {}) as Record<string, unknown>,
  };
}

function normalizeExecutionPayload(payload: Record<string, unknown>): WorkspaceExecution {
  const artifact =
    payload.artifact && typeof payload.artifact === "object"
      ? (payload.artifact as Record<string, unknown>)
      : null;

  const execution =
    artifact?.execution && typeof artifact.execution === "object"
      ? (artifact.execution as Record<string, unknown>)
      : payload.execution && typeof payload.execution === "object"
        ? (payload.execution as Record<string, unknown>)
        : null;

  const output =
    artifact?.output && typeof artifact.output === "object"
      ? (artifact.output as Record<string, unknown>)
      : payload.output && typeof payload.output === "object"
        ? (payload.output as Record<string, unknown>)
        : null;

  return {
    model: String(execution?.model ?? "unknown"),
    provider: String(execution?.provider ?? "unknown"),
    input_tokens: Number(payload.input_tokens ?? 0),
    output_tokens: Number(payload.output_tokens ?? 0),
    latency_ms: Number(execution?.latency_ms ?? payload.latency_ms ?? 0),
    result: String(output?.text ?? payload.result ?? ""),
    timestamp: typeof payload.created_at === "string" ? payload.created_at : undefined,
  };
}

export const workspaceApi = {
  async analyzePrompt(
    payload: AnalyzePromptRequest,
  ): Promise<ApiEnvelope<WorkspaceAnalysis>> {
    try {
      const response = await fetch(ANALYZE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Analyze request failed with status ${response.status}`);
      }

      const envelope = (await response.json()) as ApiEnvelope<Record<string, unknown>>;

      if (envelope.status !== "success") {
        throw new Error(envelope.error || "Analyze request failed");
      }

      return {
        status: "success",
        data: normalizeAnalysisPayload(envelope.data),
      };
    } catch {
      return {
        status: "success",
        data: createMockAnalysis(payload.raw_input),
      };
    }
  },

  async runPrompt(
    payload: RunPromptRequest,
  ): Promise<ApiEnvelope<WorkspaceExecution>> {
    const response = await fetch(RUN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Run request failed with status ${response.status}`);
    }

    const envelope = (await response.json()) as ApiEnvelope<Record<string, unknown>>;

    if (envelope.status !== "success") {
      throw new Error(envelope.error || "Run request failed");
    }

    return {
      status: "success",
      data: normalizeExecutionPayload(envelope.data),
    };
  },
};
