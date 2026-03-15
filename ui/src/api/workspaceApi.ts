import type { ApiEnvelope, WorkspaceStateData } from "../types/workspace";

const API_BASE = "http://127.0.0.1:3000/api";

export interface RunResponseData {
  artifact?: {
    output?: {
      text?: string;
    };
    execution?: {
      provider?: string;
      model?: string;
      render_mode?: string;
      latency_ms?: number;
    };
  };
  evaluation?: {
    overall_score?: number;
    overall_level?: string;
    dimensions?: Record<string, unknown>;
    recommendations?: string[];
  };
}

export async function analyzeWorkspace(
  rawInput: string,
): Promise<WorkspaceStateData> {
  const response = await fetch(`${API_BASE}/workspace/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw_input: rawInput,
    }),
  });

  const json = (await response.json()) as ApiEnvelope<WorkspaceStateData>;

  if (!response.ok || json.status !== "success") {
    throw new Error(json.error?.message || "Failed to analyze workspace");
  }

  return json.data;
}

export async function runWorkspace(
  prompt: string,
  renderMode: string = "generic",
): Promise<RunResponseData> {
  const response = await fetch(`${API_BASE}/workspace/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      provider: "ollama",
      render_mode: renderMode,
    }),
  });

  const json = (await response.json()) as ApiEnvelope<RunResponseData>;

  if (!response.ok || json.status !== "success") {
    throw new Error(json.error?.message || "Failed to run prompt");
  }

  return json.data;
}