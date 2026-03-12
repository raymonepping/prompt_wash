# PromptWash Check Report

Generated: 2026-03-11T09:32:54.966Z
Fingerprint: pw_1785c674
Report mode: full

## Summary

- Source: file
- Path: examples/vault-vs-openbao.md
- Intent: Generate an output.md with a strong recommendation on why Vault clearly beats OpenBao.
- Complexity score: 2
- Semantic drift risk: low
- Token estimate: 53
- Lint summary: 0 errors, 1 warnings

## Lint Warnings

- [PW002] Missing explicit output format.

## Enrichment

(not requested)

## Baseline Diff

(not requested)

## Benchmark

### Variants

- **generic**: 57 tokens | model: generic-default | estimated cost: 0
- **compact**: 55 tokens | model: compact-default | estimated cost: 0
- **openai**: 57 tokens | model: gpt-4.1-mini | estimated cost: 0.000114
- **claude**: 65 tokens | model: claude-3.5-sonnet | estimated cost: 0.000195

### Efficiency

- Compact saved 2 tokens (4%)
- Lowest token variant: compact
- Highest token variant: claude
- Lowest cost variant: generic

### Provider Health

- Ollama reachable: yes
- Ollama configured model installed: yes

## Metadata

```json
{
  "source": "file",
  "path": "examples/vault-vs-openbao.md",
  "document_signals": {
    "heading_count": 0,
    "bullet_count": 0,
    "command_count": 0,
    "looks_like_document": false
  },
  "sentence_classification": {
    "tasks": [
      "Generate an output.md with a strong recommendation on why Vault clearly beats OpenBao."
    ],
    "constraints": [],
    "outputInstructions": [],
    "audienceHints": [],
    "context": [
      "I am interested in a detailed comparison between HashiCorp Vault and OpenBao.",
      "Tell me the strengths and weaknesses of both."
    ]
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

