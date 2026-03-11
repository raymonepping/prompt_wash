# PromptWash Check Report

## Summary

- Source: argument
- Path: n/a
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

- Enabled providers: ollama
- Compact saved 5 tokens (19%)
- generic: 27 tokens | model: generic-default | estimated cost: 0
- compact: 22 tokens | model: compact-default | estimated cost: 0
- openai: 27 tokens | model: gpt-4.1-mini | estimated cost: 0.000054
- claude: 35 tokens | model: claude-3.5-sonnet | estimated cost: 0.000105
- Lowest token variant: compact
- Lowest cost variant: generic
- Ollama reachable: yes
- Ollama configured model installed: yes

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

