# PromptWash UI Data Contracts

This document defines the shared data shapes between the UI and backend.

It ensures both sides operate with the same mental model.

## WorkspaceResponse

Canonical response powering the Live Transformation Workspace.

Fields:

- `raw_input`
- `normalized_prompt`
- `structured_prompt`
- `variants`
- `lint`
- `risk`
- `bias`
- `tokens`
- `complexity`
- `optimization`
- `execution`

## RunRecord

- `run_id`
- `timestamp`
- `model`
- `provider`
- `prompt_fingerprint`
- `scores`
- `latency`
- `artifact_path`

## ExperimentRecord

- `experiment_id`
- `name`
- `matrix`
- `runs`
- `results`
- `best_variant`
- `created_at`

## LineageNode

- `id`
- `parent`
- `depth`
- `artifact`
- `fingerprint`
- `optimized`
- `created_at`

## ModelIntelligence

- `models`
- `providers`
- `runs`
- `avg_score`
- `avg_latency`
- `best_run`
