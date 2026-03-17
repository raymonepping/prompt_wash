export type AnalysisStatus = "idle" | "typing" | "analyzing" | "parsed" | "error";

export type VariantKey = "generic" | "compact" | "openai" | "claude";

export interface PromptIR {
  goal: string;
  audience: string;
  context: string;
  constraints: string[];
  steps: string[];
  output_format: string;
  tone: string;
  language: string;
  tokens: {
    input: number;
  };
  metadata: Record<string, unknown>;
}

export interface WorkspaceInsights {
  lint: string[];
  risk: {
    score: number;
    level: "low" | "medium" | "high";
    notes: string[];
  };
  bias: {
    score: number;
    detected: boolean;
    notes: string[];
  };
  complexity: {
    score: number;
    level: "low" | "medium" | "high";
  };
  optimization: {
    suggestions: string[];
    token_savings_estimate?: number;
    semantic_drift_risk?: "low" | "medium" | "high";
  };
}

export interface WorkspaceExecution {
  model: string;
  provider: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  result: string;
  timestamp?: string;
}

export interface WorkspaceAnalysis {
  raw_input: string;
  normalized_prompt: string;
  structured_prompt: PromptIR;
  variants: Record<VariantKey, string>;
  insights: WorkspaceInsights;
  tokens: {
    input: number;
    compact?: number;
  };
  execution: WorkspaceExecution | null;
  metadata: Record<string, unknown>;
}

export interface ApiEnvelope<T> {
  status: "success" | "error";
  data: T;
  error?: string;
}

export interface AnalyzePromptRequest {
  raw_input: string;
}

export interface WorkspaceStateData {
  rawInput: string;
  normalizedPrompt: string;
  structuredPrompt: PromptIR;
  variants: Record<VariantKey, string>;
  insights: WorkspaceInsights;
  tokens: {
    input: number;
    compact?: number;
  };
  execution: WorkspaceExecution | null;
  metadata: Record<string, unknown>;
  activeVariant: VariantKey;
  analysisStatus: AnalysisStatus;
  errorMessage: string | null;
  lastAnalyzedAt: string | null;
  promptId: string;
}

export interface WorkspaceStore extends WorkspaceStateData {
  setRawInput: (value: string) => void;
  setActiveVariant: (variant: VariantKey) => void;
  analyzePrompt: (rawInputOverride?: string) => Promise<void>;
  clearError: () => void;
}

export const EMPTY_PROMPT_IR: PromptIR = {
  goal: "",
  audience: "",
  context: "",
  constraints: [],
  steps: [],
  output_format: "",
  tone: "",
  language: "",
  tokens: {
    input: 0,
  },
  metadata: {},
};

export const EMPTY_INSIGHTS: WorkspaceInsights = {
  lint: [],
  risk: {
    score: 0,
    level: "low",
    notes: [],
  },
  bias: {
    score: 0,
    detected: false,
    notes: [],
  },
  complexity: {
    score: 0,
    level: "low",
  },
  optimization: {
    suggestions: [],
    token_savings_estimate: 0,
    semantic_drift_risk: "low",
  },
};

export const EMPTY_VARIANTS: Record<VariantKey, string> = {
  generic: "",
  compact: "",
  openai: "",
  claude: "",
};