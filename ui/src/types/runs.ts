export interface RunSummary {
  run_id: string;
  created_at: string | null;
  provider: string | null;
  model: string | null;
  render_mode: string | null;
  latency_ms: number | null;
  fingerprint: string | null;
  intent: string;
  source_type: string | null;
  source_path: string | null;
  success: boolean | null;
}

export interface RunLineageRef {
  family: string;
  node_id: string;
}

export interface RunSource {
  type?: string | null;
  path?: string | null;
  lineage?: RunLineageRef | null;
  [key: string]: unknown;
}

export interface RunPrompt {
  fingerprint?: string | null;
  intent?: string;
  audience?: string;
  output_format?: string;
  [key: string]: unknown;
}

export interface RunExecution {
  provider?: string | null;
  model?: string | null;
  render_mode?: string | null;
  latency_ms?: number | null;
  [key: string]: unknown;
}

export interface RunArtifact {
  version: number;
  run_id: string;
  created_at: string;
  source: RunSource;
  prompt: RunPrompt;
  execution: RunExecution;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface RunListData {
  runs: RunSummary[];
}

export interface RunDetailData {
  run: RunArtifact;
}
