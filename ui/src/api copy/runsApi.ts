export interface RunSummary {
  run_id: string;
  created_at: string | null;
  provider: string | null;
  model: string | null;
  render_mode: string | null;
  latency_ms: number | null;
  overall_score: number | null;
  overall_level: string | null;
  saved_path: string | null;
}

interface ApiEnvelope<T> {
  status: "success" | "error";
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:3000/api";

export async function fetchRuns(): Promise<RunSummary[]> {
  const response = await fetch(`${API_BASE}/runs`);
  const json = (await response.json()) as ApiEnvelope<{ runs: RunSummary[] }>;

  if (!response.ok || json.status !== "success") {
    throw new Error(json.error?.message || "Failed to load runs");
  }

  return json.data.runs;
}
