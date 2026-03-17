import type {
  AnalyzePromptRequest,
  ApiEnvelope,
  PromptIR,
  VariantKey,
  WorkspaceAnalysis,
  WorkspaceInsights,
} from "../types/workspace";

const ANALYZE_ENDPOINT = "/api/workspace/analyze";

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

      return (await response.json()) as ApiEnvelope<WorkspaceAnalysis>;
    } catch {
      return {
        status: "success",
        data: createMockAnalysis(payload.raw_input),
      };
    }
  },
};