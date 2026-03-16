# PromptWash Variant Rendering System

The Variant Rendering System defines how PromptWash transforms a structured Prompt IR into model-facing prompt variants.

The Prompt IR is the canonical internal representation. Variants are derived renderings of that representation.

PromptWash supports multiple prompt variants to:

- improve prompt portability
- optimize for token efficiency
- adapt to provider conventions
- help users inspect prompt structure

## 1. Core Principle

PromptWash does not store multiple prompts as the source of truth.

It stores one Prompt IR and renders multiple variants from it.

This ensures:

- consistency
- reproducibility
- lower maintenance
- easier comparison

Relationship:

```text
Raw Input
  ->
Prompt IR
  ->
Variant Rendering
  ->
generic / compact / openai / claude
```

## 2. Rendering Goals

Variants exist to support different use cases.

- `generic`: readable, explicit, provider-neutral prompt
- `compact`: shorter version optimized for fewer tokens
- `openai`: rendering style suitable for OpenAI-style prompt formatting
- `claude`: rendering style suitable for Claude-style prompt formatting

Variants must remain semantically aligned with the Prompt IR.

They may differ in wording, formatting, and compactness, but they must not change meaning.

## 3. Input Contract

The renderer always accepts a valid Prompt IR.

Example:

```json
{
  "goal": "Tell me the differences between HashiCorp Vault and OpenBao",
  "audience": "general",
  "context": "",
  "constraints": [
    "provide as much detail as possible",
    "be as specific as possible"
  ],
  "steps": [],
  "output_format": "",
  "tone": "brutally honest",
  "language": "en"
}
```

The renderer must not mutate this object.

## 4. Variant Types

### 4.1 Generic

The generic variant is the default human-readable rendering.

Purpose:

- inspection
- portability
- provider-neutral execution
- debugging

Rendering rules:

- use explicit labeled sections
- include only non-empty fields
- prioritize readability over token efficiency

Example:

```text
Task:
Tell me the differences between HashiCorp Vault and OpenBao

Constraints:
- provide as much detail as possible
- be as specific as possible

Tone:
brutally honest
```

### 4.2 Compact

The compact variant reduces verbosity while preserving intent.

Purpose:

- token efficiency
- shorter execution prompts
- optimization experiments

Rendering rules:

- inline sections when possible
- collapse structure into fewer lines
- preserve all required signals
- avoid semantic drift

Example:

```text
Tell me the differences between HashiCorp Vault and OpenBao. Constraints: provide as much detail as possible; be as specific as possible. Tone: brutally honest.
```

Compact rendering must be evaluated carefully because token reduction can weaken structure.

### 4.3 OpenAI

The OpenAI variant adapts the Prompt IR into a style that works well in OpenAI-style prompt environments.

Purpose:

- OpenAI model execution
- API prompt preparation
- copy and paste into OpenAI tools

Rendering rules:

- explicit task framing
- preserve structured sections
- avoid excessive verbosity
- remain clean and deterministic

Example:

```text
Task:
Tell me the differences between HashiCorp Vault and OpenBao

Constraints:
- provide as much detail as possible
- be as specific as possible

Tone:
brutally honest
```

In v1, the OpenAI rendering may remain close to `generic` if no provider-specific benefit is proven.

### 4.4 Claude

The Claude variant adapts the Prompt IR into a style suitable for Claude-style prompting.

Purpose:

- Claude model execution
- copy and paste into Claude tools
- variant comparison

Rendering rules:

- may use `Request` instead of `Task`
- should remain conversational but structured
- preserve explicit constraints

Example:

```text
You are a careful assistant.

Request:
Tell me the differences between HashiCorp Vault and OpenBao

Constraints:
- provide as much detail as possible
- be as specific as possible

Tone:
brutally honest
```

## 5. Rendering Rules

All variants follow these baseline rules.

### 5.1 Only Render Non-Empty Fields

Do not render empty sections.

Bad:

```text
Context:

Output format:
```

Good:

```text
Only include fields that contain values.
```

### 5.2 Preserve Semantic Meaning

Variants may not change:

- the goal
- the order of explicit steps
- the meaning of constraints
- the intended tone

### 5.3 Keep Field Order Stable

Recommended rendering order:

1. Context
2. Task or Request
3. Audience
4. Constraints
5. Steps
6. Output Format
7. Tone
8. Language

This order improves consistency across variants.

### 5.4 Avoid Unnecessary Duplication

A field must not be repeated in multiple sections unless explicitly required.

Bad:

```text
Task:
Explain Vault PKI

Context:
Explain Vault PKI
```

Good:

```text
Only render the instruction once.
```

### 5.5 Favor Clarity Over Optimization by Default

The default displayed variant should remain `generic`, not `compact`.

PromptWash is a workspace first and an optimizer second.

## 6. Output Contract

Variant rendering returns a dictionary of strings.

Example:

```json
{
  "generic": "Task:\n...",
  "compact": "...",
  "openai": "Task:\n...",
  "claude": "You are a careful assistant.\n..."
}
```

This structure is returned by the API and used by the UI.

## 7. UI Behavior

The PromptWash UI displays variants in the Variant Preview panel.

Tabs include:

- Generic
- Compact
- OpenAI
- Claude

Users may:

- inspect variants
- copy variants
- run the active variant
- compare variant readability

The active variant must not modify the Prompt IR.

## 8. Optimization Relationship

The compact variant is closely tied to optimization.

Optimization may report:

- original token count
- compact token count
- token savings
- semantic drift risk

However, optimization logic is separate from rendering logic.

The renderer only generates the string. The optimizer evaluates efficiency.

## 9. Execution Relationship

Execution always uses a rendered variant.

Example:

```text
Prompt IR
  ->
claude variant
  ->
execute against model
```

The execution layer should always record:

- which variant was used
- which model was used
- which provider was used

This enables later comparison and debugging.

## 10. Future Variant Types

The system should allow new variants later.

Possible future variants:

- `system_prompt`
- `json_safe`
- `markdown_strict`
- `image_prompt`
- `code_prompt`
- `provider_custom`

New variants must still derive from the same Prompt IR.

## 11. Determinism Requirement

Variant rendering must be deterministic.

The same Prompt IR must always render the same variants.

This is critical for:

- benchmarking
- experiments
- testing
- reproducibility

## 12. Product Philosophy Alignment

Variant rendering supports the PromptWash philosophy:

Build, inspect, and evolve prompts.

Variants help users inspect how one prompt structure behaves across different rendering styles.

PromptWash should make this visible without overwhelming the user.

## 13. Summary

Variant rendering is the bridge between structured prompt intent and model-facing prompt text.

It must remain:

- deterministic
- readable
- stable
- semantically faithful

The Prompt IR remains the source of truth. Variants are only views of that structure.
