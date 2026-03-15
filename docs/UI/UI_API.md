# PromptWash UI API Contract

The PromptWash UI communicates with the backend through a small set of endpoints.

The workspace relies on a single canonical response structure to minimize API chatter.

## Canonical Workspace Response

All workspace updates should return one object describing the current prompt state.

```json
{
  "raw_input": "...",
  "normalized_prompt": "...",
  "structured_prompt": {},
  "variants": {},
  "lint": [],
  "risk": {},
  "bias": {},
  "tokens": {},
  "complexity": {},
  "optimization": {},
  "execution": {}
}
```

## Workspace Endpoints

### `POST /workspace/analyze`

Input:

```json
{
  "raw_input": "...",
  "context": {}
}
```

Returns the canonical workspace state.

### `POST /workspace/run`

Runs a prompt against the selected model.

Input:

```json
{
  "prompt": "...",
  "model": "llama3:latest"
}
```

### `GET /workspace/state`

Returns the last known workspace state.

## Experiment Endpoints

- `GET /experiments`
- `POST /experiments/run`
- `GET /experiments/{id}`

## Intelligence Endpoints

- `GET /intelligence/models`
- `GET /intelligence/runs`
- `GET /intelligence/optimization`
- `GET /intelligence/lineage`

## Governance Endpoints

- `GET /governance/rules`
- `POST /governance/rules`

## Future Extensions

- Prompt memory
- Prompt collaboration
- Remote experiment execution
