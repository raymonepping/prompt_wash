# PromptWash Check Report

Generated: 2026-03-12T19:48:38.624Z
Fingerprint: pw_cecf6eae
Report mode: full

## Summary

- Source: argument
- Path: n/a
- Intent: Show why Vault clearly beats OpenBao and end with a strong recommendation for Vault.
- Complexity score: 1
- Semantic drift risk: low
- Token estimate: 21
- Lint summary: 0 errors, 2 warnings

## Lint Warnings

- [PW002] Missing explicit output format.
- [PW007] No actionable steps detected.

## Enrichment

(not requested)

## Governance

### Risk

- Score: 20
- Level: very_low
- Signals: ambiguity
- Recommendations:
  - Add an explicit output format.
  - Add constraints to reduce ambiguity.
  - Specify the intended audience.

### Bias

- Score: 100
- Level: critical
- Signals: outcome_steering, vendor_bias, advocacy_language, forced_recommendation
- Recommendations:
  - Remove predetermined conclusion language and frame the request as an open evaluation.
  - Reframe the comparison to avoid pre-selecting a winner between vendors or products.
  - Replace advocacy language with neutral analytical wording.
  - Avoid forcing a recommendation before the comparison is complete.

## Baseline Diff

(not requested)

## Benchmark

(not requested)

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
    "tasks": [],
    "constraints": [],
    "outputInstructions": [],
    "audienceHints": [],
    "context": [
      "Show why Vault clearly beats OpenBao and end with a strong recommendation for Vault."
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

