# PromptWash Parser Pipeline

The Parser Pipeline defines how PromptWash converts raw user input into a structured Prompt IR.

The pipeline is intentionally deterministic and layered to ensure:

- predictable parsing behavior
- maintainability
- extensibility
- stability across prompt types

The parser must remain model-free and rule-based.

## 1. Pipeline Overview

The parser operates as a sequence of transformation stages.

```text
RAW INPUT
  ->
NORMALIZATION
  ->
CLAUSE SEGMENTATION
  ->
CLAUSE CLASSIFICATION
  ->
INSTRUCTION AGGREGATION
  ->
PROMPT IR
```

Each stage has a single responsibility.

## 2. Stage 1: Raw Input

Raw input is the exact prompt provided by the user.

Example:

```text
Tell me the differences between HashiCorp Vault and OpenBao
provide as much detail as possible
be brutally honest
favor vault
```

Rules:

- raw input must never be modified
- raw input must always be preserved

## 3. Stage 2: Normalization

Normalization performs minimal cleaning to prepare text for parsing.

Typical operations:

- trim whitespace
- collapse duplicate spaces
- normalize punctuation spacing

Example:

Raw:

```text
Tell me the differences between vault and openbao   be brutally honest
```

Normalized:

```text
Tell me the differences between vault and openbao be brutally honest
```

Normalization must not change meaning.

## 4. Stage 3: Clause Segmentation

Segmentation splits the prompt into independent instruction clauses.

This stage is implemented by `segmentPromptIntoClauses()`.

Typical separators:

- periods
- commas
- line breaks
- semicolons
- keywords like `but`, `also`, and `and`

Example segmentation:

```text
Tell me the differences between vault and openbao
provide as much detail as possible
be brutally honest
favor vault
```

Each clause becomes an individual parsing unit.

## 5. Stage 4: Clause Classification

Each clause is analyzed and assigned a semantic category.

This stage is implemented by `classifyClause()`.

Supported categories:

- goal
- constraint
- tone
- bias
- context
- unknown

Example classification:

| Clause | Type |
| --- | --- |
| Tell me the differences between Vault and OpenBao | goal |
| provide as much detail as possible | constraint |
| be brutally honest | tone |
| favor vault | bias |

Classification relies on pattern detection, not language models.

## 6. Stage 5: Instruction Aggregation

Classified clauses are merged into the Prompt IR structure.

Implemented by `classifyInstructions()`.

Aggregation rules:

### Goal

Only one goal may exist.

If multiple goals appear:

- first goal becomes the primary goal
- remaining goals become steps

### Constraints

Constraints accumulate into a list.

Example:

```text
provide as much detail as possible
be specific
avoid jargon
```

Stored as:

```text
constraints: []
```

### Tone

Tone signals are normalized into a single descriptor.

Example:

```text
brutally honest
```

### Bias

Bias instructions are captured but not enforced.

Example:

```text
favor vault
```

Bias detection feeds the Insights system, not the IR.

### Context

Context signals describe the environment.

Examples:

- for executives
- for a blog post
- for a presentation

## 7. Stage 6: Prompt IR Construction

After aggregation, the parser constructs the Prompt IR.

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

The Prompt IR specification is defined in `PROMPT_IR_SPEC.md`.

## 8. Parser Responsibilities

The parser is responsible for:

- instruction extraction
- goal detection
- constraint detection
- tone detection
- bias detection
- context detection

The parser must remain fast and deterministic.

## 9. Parser Non-Responsibilities

The parser must never:

- generate prompt variants
- call language models
- optimize prompts
- score prompts
- estimate risk

Those tasks belong to other modules.

## 10. Prompt Type Independence

The parser must work for all prompt categories.

Examples:

- text prompts
- code prompts
- image prompts
- analysis prompts
- multi-step prompts

The parser extracts instructions, not domain semantics.

Example:

```text
Generate a cyberpunk robot image in Unreal Engine style
```

Possible classification:

```text
Goal:
Generate a cyberpunk robot image

Constraint:
Unreal Engine style
```

## 11. Parser Extensibility

The parser supports future extensions by expanding:

- `GOAL_VERBS`
- `CONSTRAINT_PATTERNS`
- `TONE_PATTERNS`
- `BIAS_PATTERNS`
- `CONTEXT_PATTERNS`

New patterns must not break existing behavior.

## 12. Determinism Requirement

The same prompt must always produce the same Prompt IR.

Example:

```text
input prompt -> same structured output every time
```

This ensures:

- reproducibility
- benchmarking
- prompt comparison

## 13. Error Handling

The parser must never fail completely.

Fallback behavior:

```text
goal = entire prompt
constraints = []
tone = neutral
```

This guarantees that every prompt is parseable.

## 14. Performance Requirements

The parser must operate in constant time relative to prompt length.

Target performance:

```text
< 5ms for typical prompts
```

This supports real-time UI responsiveness.

## 15. Design Principle

PromptWash parsing is designed around one key idea:

Extract intent, not meaning.

The parser identifies instructions given to the model, not the domain knowledge inside the prompt.
