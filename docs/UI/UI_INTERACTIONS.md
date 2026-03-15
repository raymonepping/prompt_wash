# PromptWash UI Interactions

This document defines how the UI behaves.

## Live Transformation

Typing in Raw Input triggers:

- Normalize
- Clean
- Analyze
- Lint
- Adapt

Updates:

- Structured prompt
- Insights panel
- Variant preview

## Run Execution

Action:

- Click `Run`

Request:

- `POST /workspace/run`

Updates:

- Execution panel
- Run registry
- Model intelligence

## Experiment Execution

Action:

- Click `Experiment`

Request:

- `POST /experiments/run`

Updates:

- Experiment registry
- Leaderboard
- Lineage graph
