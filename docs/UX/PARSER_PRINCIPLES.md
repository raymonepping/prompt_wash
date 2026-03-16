# PromptWash Parser Design Principles

The PromptWash parser transforms messy user input into a structured prompt representation.

The parser must remain:

- predictable
- understandable
- stable over time

This document defines the rules that guide parser evolution.

Its purpose is to prevent uncontrolled complexity and endless iterations.

## 1. The Parser Is Not an AI

PromptWash does not attempt to fully understand language.

The parser performs structured extraction, not deep semantic interpretation.

Its job is to detect instruction signals such as:

- goals
- constraints
- steps
- tone
- output format

It is acceptable for the parser to be imperfect but consistent.

## 2. Structure First, Meaning Second

PromptWash prioritizes extracting instruction structure.

The parser identifies:

- goal
- audience
- context
- constraints
- steps
- output_format
- tone
- language

These fields form the Prompt IR.

Semantic interpretation happens later through enrichment layers.

## 3. Heuristics Over Complexity

The parser should rely on simple deterministic heuristics.

Examples:

- clause segmentation
- keyword patterns
- sentence classification
- structural signals

Avoid:

- large NLP dependencies
- opaque machine learning models
- complex linguistic parsing

PromptWash must remain fast and transparent.

## 4. Deterministic Behavior

Given the same input, the parser must produce the same output.

No randomness is allowed inside the parser.

This ensures:

- reproducibility
- reliable debugging
- predictable UI behavior

## 5. Conservative Extraction

When the parser is uncertain, it should prefer omission over incorrect classification.

Example:

Better:

```text
context = ""
```

Than:

```text
context = "incorrect guess"
```

The UI can communicate missing structure to the user. Incorrect structure is far more damaging.

## 6. Clause-Based Parsing

PromptWash parses prompts using instruction clauses.

User prompts are segmented into clauses using:

- punctuation
- conjunction hints
- instruction markers

Each clause is classified into one of the following:

- goal
- constraint
- tone
- context
- bias
- unknown

Clause classification must remain simple and readable.

## 7. Prompt-Type Independence

The parser must remain independent from prompt type.

It must work equally for:

- text prompts
- code prompts
- image prompts
- multimodal prompts

Prompt type detection happens after parsing.

## 8. Enrichment Is Separate

Parser output is never modified by enrichment modules.

Enrichment may add metadata such as:

- code_language
- image_style
- diagram_type
- schema_detection

But the Prompt IR remains unchanged.

This keeps the parser stable.

## 9. Metadata Over Overfitting

When the parser detects something ambiguous, it should record metadata instead of forcing structure.

Example metadata:

- bias_request
- low_confidence_audience
- possible_output_format

Metadata allows the UI to surface useful insights without corrupting the structured prompt.

## 10. Parser Improvements Must Be Justified

Parser changes should only occur when one of the following is true:

1. The structured prompt is obviously incorrect.
2. The UI becomes confusing.
3. A common real-world prompt pattern fails.
4. The improvement is small and localized.

Avoid parser changes motivated by rare edge cases.

## 11. Maintain a Parser Test Corpus

PromptWash should maintain a small corpus of representative prompts.

Example categories:

- explanation prompts
- comparison prompts
- constraint-heavy prompts
- code prompts
- image prompts
- messy one-line prompts

Parser changes must be validated against this corpus.

The goal is stable improvement, not constant churn.

## 12. UI Transparency

The PromptWash UI intentionally exposes parser output.

Users can see:

- Raw Input
- Structured Prompt
- Insights
- Variants

This transparency reduces the need for parser perfection. Users can see how their prompt was interpreted.

## 13. Iterative Refinement

The parser will evolve over time, but changes should be small and controlled.

Typical evolution pattern:

- v1: basic clause parsing
- v2: improved constraint detection
- v3: better tone recognition
- v4: prompt-type enrichment

Parser development should follow incremental improvements, not large rewrites.

## 14. Parser Stability Matters

The parser is the foundation of the PromptWash workspace.

Frequent structural changes break:

- UI expectations
- prompt variants
- lint rules
- risk analysis
- optimization logic

Parser stability must therefore be prioritized.

## 15. Product Philosophy Alignment

The parser exists to support the core PromptWash philosophy:

PromptWash helps users understand how their thinking becomes a prompt.

The parser must therefore remain:

- clear
- predictable
- transparent
- educational

If a parser change makes the system harder to understand, it should not be implemented.

## Final Rule

The parser should make prompts more structured, not more mysterious.

Clarity is more valuable than cleverness.
