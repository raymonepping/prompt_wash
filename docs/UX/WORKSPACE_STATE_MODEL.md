# PromptWash Workspace State Model

The Workspace State Model defines how prompts move through the PromptWash system from raw input to execution and experimentation.

It provides a consistent lifecycle for:

- prompt editing
- prompt analysis
- prompt execution
- prompt comparison
- prompt iteration

This model ensures the UI, CLI, and API behave consistently.

## 1. Core Philosophy

The PromptWash workspace is designed around a simple principle:

A prompt evolves through stages.

Each stage enriches the prompt with additional information. The original prompt must always remain preserved.

## 2. Prompt Lifecycle

A prompt moves through the following stages:

```text
RAW INPUT
  ->
NORMALIZED PROMPT
  ->
PROMPT IR
  ->
INSIGHTS
  ->
VARIANTS
  ->
EXECUTION
  ->
RUN HISTORY
```

Each stage adds information without mutating earlier stages.

## 3. Workspace State Object

The workspace maintains a structured state object.

Example:

```json
{
  "raw_input": "",
  "normalized_prompt": "",
  "structured_prompt": {},
  "variants": {},
  "insights": {
    "lint": [],
    "risk": {},
    "bias": {},
    "complexity": {},
    "optimization": {}
  },
  "tokens": {},
  "execution": null,
  "runs": [],
  "metadata": {}
}
```

This object represents the current prompt session.

## 4. Raw Input State

The raw input is the exact text entered by the user.

Example:

```text
Tell me the differences between vault and openbao
be brutally honest
favor vault
```

Rules:

- must remain unchanged
- must always be preserved
- acts as the source of truth

## 5. Normalized Prompt State

Normalization performs lightweight cleaning.

Examples:

- trimming whitespace
- collapsing duplicate spaces
- removing accidental line breaks

Example:

```text
Tell me the differences between Vault and OpenBao. Be brutally honest.
```

Normalization must not change meaning.

## 6. Prompt IR State

The parser converts normalized input into structured instructions.

Example:

```json
{
  "goal": "Tell me the differences between HashiCorp Vault and OpenBao",
  "audience": "general",
  "context": "",
  "constraints": [
    "provide as much detail as possible",
    "be specific"
  ],
  "steps": [],
  "output_format": "",
  "tone": "brutally honest",
  "language": "en"
}
```

This structure is defined in `PROMPT_IR_SPEC.md`.

The IR is the core internal representation.

## 7. Insight State

Insights provide diagnostics about the prompt.

Example:

- Lint warnings
- Risk signals
- Bias signals
- Complexity score
- Optimization suggestions

Insights do not modify the prompt. They only provide analysis and guidance.

Insight rules are defined in `INSIGHTS_SYSTEM.md`.

## 8. Variant State

Prompt variants are generated from the Prompt IR.

Example variants:

- `generic`
- `compact`
- `openai`
- `claude`

Variants represent different renderings of the same prompt. They must never modify the Prompt IR.

Example:

```text
Task:
Explain the differences between Vault and OpenBao

Constraints:
- be specific
- provide detail
```

## 9. Execution State

Execution represents an actual model run.

Example:

```json
{
  "model": "gpt-4.1",
  "provider": "openai",
  "input_tokens": 42,
  "output_tokens": 610,
  "latency_ms": 1340,
  "result": "...model output..."
}
```

Execution is optional. PromptWash can be used without executing prompts.

## 10. Run History

Every execution produces a run entry.

Example:

```json
{
  "run_id": "run_001",
  "timestamp": "2026-03-15T20:15:00Z",
  "variant": "openai",
  "model": "gpt-4.1",
  "tokens": {
    "input": 42,
    "output": 610
  },
  "result": "...model output..."
}
```

Runs allow:

- comparison
- benchmarking
- reproducibility

## 11. Experiment State

Experiments group multiple runs together.

Example:

```json
{
  "experiment_id": "exp_001",
  "prompt_fingerprint": "pw_0f948831",
  "runs": [
    "run_001",
    "run_002"
  ],
  "models": [
    "gpt-4.1",
    "claude-sonnet"
  ]
}
```

Experiments allow users to evaluate:

- model differences
- prompt variant performance
- cost versus quality

## 12. Workspace UI Mapping

The workspace UI maps directly to the state model.

Typical layout:

```text
LEFT PANEL
Raw Input Editor

CENTER PANEL
Structured Prompt (Prompt IR)

RIGHT PANEL
Insights

BOTTOM PANEL
Variants + Execution
```

This ensures the UI reflects the underlying architecture.

## 13. Stateless API Design

The PromptWash API is designed to be stateless.

Every request contains the prompt input.

Example:

```text
POST /api/workspace/analyze
```

Response fields:

- `raw_input`
- `normalized_prompt`
- `structured_prompt`
- `variants`
- `insights`
- `tokens`
- `complexity`
- `optimization`

State persistence is handled by the client or repository features.

## 14. Prompt Fingerprints

Each prompt may generate a fingerprint.

Example:

```text
pw_0f948831
```

The fingerprint allows:

- run tracking
- experiment grouping
- version history

Fingerprints are derived from the Prompt IR.

## 15. Workspace Persistence (Future)

Future versions of PromptWash may support persistent workspaces.

Example:

```text
.promptwash/workspace.json
```

This would store:

- prompt history
- runs
- experiments
- variants
- metadata

Persistence must never overwrite the original prompt.

## 16. State Integrity Rules

The workspace must follow strict rules:

- `raw_input` is immutable
- Prompt IR is deterministic
- insights never mutate prompts
- variants never mutate the IR
- execution never mutates variants

These rules guarantee reproducibility.

## 17. Prompt Evolution

PromptWash supports iterative improvement.

Typical flow:

1. edit prompt
2. analyze
3. review insights
4. adjust prompt
5. run experiment
6. compare results

This turns prompt engineering into an observable workflow.

## 18. Summary

The Workspace State Model ensures that PromptWash behaves predictably.

It defines how prompts evolve from raw text into structured instructions, insights, and executions.

This model enables PromptWash to function as a prompt engineering environment, not just a prompt editor.
