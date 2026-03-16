# PromptWash Prompt IR (Instruction Representation)

The Prompt IR defines the canonical structured representation of a prompt inside PromptWash.

All prompts processed by PromptWash must be transformed into this structure.

The Prompt IR acts as the contract between all system components, including:

- the parser
- the API
- the UI workspace
- the CLI
- enrichment modules
- optimization modules
- benchmarking systems

This ensures all parts of the system operate on a consistent and predictable data structure.

## 1. Core Design Goals

The Prompt IR must be:

- deterministic
- stable over time
- easy to understand
- model-agnostic
- provider-agnostic

It represents the user's intent, not the final prompt sent to a model.

## 2. Core Prompt IR Structure

The Prompt IR is composed of the following fields:

```json
{
  "goal": "string",
  "audience": "string",
  "context": "string",
  "constraints": [],
  "steps": [],
  "output_format": "string",
  "tone": "string",
  "language": "string",
  "tokens": {
    "input": 0
  },
  "metadata": {}
}
```

This structure is the canonical prompt representation. All prompt variants are derived from it.

## 3. Field Definitions

### `goal`

The primary task the model should perform.

Example:

```text
Explain Vault PKI to a beginner.
```

There must always be exactly one goal.

If multiple goals are detected, they should be converted into steps.

### `audience`

The intended reader or user of the generated output.

Examples:

- `general`
- `developer`
- `beginner`
- `executive`
- `student`

If no audience is detected, the default is `general`.

### `context`

Additional information that helps the model understand the environment or situation.

Examples:

- for a presentation
- for a blog post
- in a security architecture context

Context should remain concise.

If none exists, this field should be an empty string.

### `constraints`

Rules that limit how the response should be generated.

Examples:

- use simple language
- be concise
- include examples
- avoid jargon

Constraints are stored as a list of strings.

### `steps`

Optional ordered instructions describing how the response should be constructed.

Example:

```text
1. Explain what Vault PKI is
2. Describe how certificate signing works
3. Provide a simple example
```

If no procedural instructions exist, this list remains empty.

### `output_format`

Specifies the expected output structure.

Examples:

- `paragraph`
- `bullet list`
- `table`
- `json`
- `markdown`
- `code`

If unspecified, this field remains empty.

### `tone`

Describes the communication style.

Examples:

- `neutral`
- `professional`
- `casual`
- `critical`
- `brutally honest`

Tone should contain a single descriptive phrase.

### `language`

The detected language of the prompt.

Examples:

- `en`
- `nl`
- `de`
- `fr`

PromptWash should default to `en` when uncertain.

### `tokens`

Token estimation for the prompt input.

Example:

```json
{
  "input": 42
}
```

Token counts may be estimated locally and do not need to be exact.

### `metadata`

Additional structured information produced by the system.

Examples include:

- parser signals
- bias requests
- document detection
- prompt fingerprints
- enrichment results

Metadata is intentionally flexible and may evolve over time.

## 4. Prompt Object vs. Prompt IR

PromptWash internally uses two related structures.

### Prompt Object

The full internal object used by the pipeline.

Example:

```json
{
  "raw": "...",
  "cleaned": "...",
  "ir": { "goal": "..." },
  "tokens": {},
  "complexity_score": 0,
  "semantic_drift_risk": "low",
  "fingerprint": "...",
  "metadata": {}
}
```

### Prompt IR

The structured prompt instructions only.

The IR is nested inside the Prompt Object.

## 5. Prompt Variants

Prompt variants are rendered forms of the IR optimized for specific providers.

Examples:

- `generic`
- `compact`
- `openai`
- `claude`

Variants are generated using the Prompt IR and must never modify it.

Example:

```text
Context:
...

Task:
...

Constraints:
...
```

## 6. Parser Responsibility

The parser's job is to populate the Prompt IR fields.

It must never:

- generate prompt variants
- call language models
- infer provider-specific syntax

The parser only performs instruction extraction.

## 7. Enrichment Responsibility

Enrichment modules may add metadata to the Prompt Object.

Examples:

- code language detection
- image style detection
- bias detection
- risk signals

Enrichment must not modify the Prompt IR fields directly.

This ensures parser stability.

## 8. API Contract

All API endpoints returning prompt analysis must include the structured IR.

Example API response:

```json
{
  "status": "success",
  "data": {
    "raw_input": "...",
    "normalized_prompt": "...",
    "structured_prompt": {},
    "variants": {},
    "lint": [],
    "risk": {},
    "bias": {},
    "tokens": {},
    "complexity": {},
    "optimization": {}
  }
}
```

The UI workspace relies on this structure.

## 9. UI Dependency

The PromptWash UI is designed around the Prompt IR.

The workspace visualizes:

```text
Raw Input
  ->
Prompt IR
  ->
Variants
  ->
Insights
```

The UI must never depend on raw text parsing. It must always rely on the structured IR returned by the API.

## 10. Backwards Compatibility

The Prompt IR schema must remain stable.

Future changes should only add fields to:

- `metadata`
- `enrichment`
- `insights`

Core fields must remain unchanged to avoid breaking:

- saved prompts
- experiments
- benchmarking data
- stored repositories

## 11. Versioning

The Prompt IR may optionally include a version identifier.

Example:

```json
{
  "ir_version": 1
}
```

This allows future evolution without breaking existing data.

## 12. Design Philosophy

The Prompt IR exists to support the core idea behind PromptWash:

The moment messy text becomes a structured prompt.

The IR should therefore always prioritize:

- clarity
- stability
- transparency

It is the foundation of the PromptWash workspace.
