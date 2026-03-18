export interface ModelIntelligenceBestRun {
  run_id: string;
  overall_score: number;
  overall_level: string;
  latency_ms: number;
  intent: string;
}

export interface ModelIntelligenceModelSummary {
  model: string;
  provider: string;
  runs: number;
  average_score: number;
  average_latency_ms: number;
  average_clarity: number;
  average_structure: number;
  average_constraint_adherence: number;
  average_audience_fit: number;
  best_run: ModelIntelligenceBestRun | null;
}

export interface ModelIntelligenceProviderSummary {
  provider: string;
  runs: number;
  models: string[];
  average_score: number;
  average_latency_ms: number;
}

export interface ModelIntelligenceHighlight {
  model: string;
  average_score: number;
  average_latency_ms: number;
}

export interface ModelIntelligenceData {
  total_runs: number;
  total_models: number;
  total_providers: number;
  best_model: ModelIntelligenceHighlight | null;
  fastest_model: ModelIntelligenceHighlight | null;
  providers: ModelIntelligenceProviderSummary[];
  models: ModelIntelligenceModelSummary[];
}

export interface RunIntelligenceRun {
  run_id: string;
  provider: string;
  model: string;
  render_mode: string;
  latency_ms: number;
  overall_score: number;
  overall_level: string;
  intent: string;
  fingerprint: string | null;
  created_at: string;
}

export interface RunIntelligenceAggregate {
  model?: string;
  provider?: string;
  runs: number;
  average_score: number;
  average_latency_ms: number;
}

export interface RunIntelligenceData {
  total_runs: number;
  average_score: number;
  average_latency_ms: number;
  strongest_run: RunIntelligenceRun | null;
  fastest_run: RunIntelligenceRun | null;
  providers: Array<RunIntelligenceAggregate & { provider: string }>;
  models: Array<RunIntelligenceAggregate & { model: string }>;
  runs: RunIntelligenceRun[];
}

export interface OptimizationIntelligenceData {
  total_prompt_candidates: number;
  optimized_candidates: number;
  baseline_candidates: number;
  optimized_files: string[];
  note: string;
}

export interface LineageNodeDepthGroup {
  depth: number;
  count: number;
  nodes: string[];
}

export interface LineageLatestNode {
  id: string;
  created_at: string;
  artifact: string;
  label?: string;
  fingerprint?: string | null;
}

export interface LineageOptimizedNode {
  id: string;
  artifact: string;
  label?: string;
  notes?: string;
  fingerprint?: string | null;
}

export interface LineageCoverageItem {
  node_id: string;
  fingerprint: string | null;
}

export interface LineageCoveredNode extends LineageCoverageItem {
  runs: string[];
  matched_by: string[];
}

export interface LineageBestEvaluatedNode {
  node_id: string;
  fingerprint: string | null;
  run_id: string;
  matched_by: string;
  overall_score: number;
  overall_level: string;
}

export interface LineageExecutionCoverage {
  covered_count: number;
  uncovered_count: number;
  covered: LineageCoveredNode[];
  uncovered: LineageCoverageItem[];
}

export interface LineageIntelligenceData {
  family: string;
  root: string;
  total_nodes: number;
  latest_node: LineageLatestNode | null;
  max_depth: number;
  nodes_by_depth: LineageNodeDepthGroup[];
  optimized_nodes: LineageOptimizedNode[];
  execution_coverage: LineageExecutionCoverage;
  best_evaluated_node: LineageBestEvaluatedNode | null;
}
