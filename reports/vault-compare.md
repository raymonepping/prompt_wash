# PromptWash Check Report

Generated: 2026-03-11T08:51:08.100Z
Fingerprint: pw_42d7f7c1
Report mode: full

## Summary

- Source: promptwash_json
- Path: examples/vault.json
- Intent: Explain Vault PKI.
- Complexity score: 6
- Semantic drift risk: low
- Token estimate: 19
- Lint summary: 0 errors, 0 warnings

## Lint Warnings

(none)

## Enrichment

(not requested)

## Baseline Diff

(not requested)

## Benchmark

### Variants

- **generic**: 27 tokens | model: generic-default | estimated cost: 0
- **compact**: 22 tokens | model: compact-default | estimated cost: 0
- **openai**: 27 tokens | model: gpt-4.1-mini | estimated cost: 0.000054
- **claude**: 35 tokens | model: claude-3.5-sonnet | estimated cost: 0.000105

### Efficiency

- Compact saved 5 tokens (19%)
- Lowest token variant: compact
- Highest token variant: claude
- Lowest cost variant: generic

### Provider Health

- Ollama reachable: yes
- Ollama configured model installed: yes

## Comparison

- Left label: examples/vault.json
- Right label: examples/vault-verbose.json

### Winners

- Generic tokens: examples/vault-verbose.json
- Compact tokens: examples/vault-verbose.json
- Generic cost: tie
- Compact cost: tie
- Lint total: tie

### Deltas

- Generic tokens delta: 6
- Compact tokens delta: 5
- Generic cost delta: 0
- Compact cost delta: 0
- Lint total delta: 0
- Lint errors delta: 0
- Lint warnings delta: 0

## Metadata

```json
{
  "source": "argument",
  "path": null,
  "document_signals": {
    "heading_count": 0,
    "bullet_count": 0,
    "command_count": 0,
    "looks_like_document": false
  },
  "sentence_classification": {
    "tasks": [
      "Explain Vault PKI."
    ],
    "constraints": [
      "Do not use jargon."
    ],
    "outputInstructions": [
      "Use a markdown summary for executives."
    ],
    "audienceHints": [],
    "context": []
  },
  "enrichment": {
    "requested": false,
    "succeeded": false,
    "merged": false,
    "used": false,
    "reason": null,
    "health": null,
    "applied_fields": {},
    "raw": null
  }
}
```

