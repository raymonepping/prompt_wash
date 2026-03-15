
export interface StructuredPrompt {
  goal: string;
  audience: string;
  context: string;
  constraints: string[];
  steps: string[];
  output_format: string;
  tone: string;
  language: string;
}

export interface WorkspaceStateData {
  raw_input: string;
  normalized_prompt: string;
  structured_prompt: StructuredPrompt | null;
  variants: Record<string, string>;
  lint: Array<{
    code: string;
    level: string;
    message: string;
  }>;
  risk: unknown;
  bias: unknown;
  tokens: Record<string, unknown>;
  complexity: Record<string, unknown>;
  optimization: unknown;
  execution: unknown;
}

export interface ApiEnvelope<T> {
  status: "success" | "error";
  data: T;
  meta?: {
    timestamp?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}