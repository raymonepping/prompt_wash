# PromptWash Insights System

The Insights System provides structured diagnostics about a prompt.

Its purpose is to help users improve prompt quality without overwhelming them with analysis.

Insights are designed to be:

- actionable
- understandable
- lightweight
- optional to explore more deeply

The Insights System powers the Insights panel in the PromptWash workspace.

## 1. Design Philosophy

PromptWash Insights exist to answer three questions:

1. Is the prompt clear?
2. Is the prompt safe and unbiased?
3. Can the prompt be improved?

Insights must always prioritize clarity and usefulness.

If an insight does not help improve prompts, it does not belong in the system.

## 2. Insight Categories

The Insights System is organized into five primary categories:

- Lint
- Risk
- Bias
- Complexity
- Optimization

Each category produces signals based on the Prompt IR.

## 3. Lint

Lint detects structural issues in the prompt.

Lint rules are deterministic and easy to understand.

Examples:

- Missing output format
- Missing audience
- No actionable steps
- Goal is ambiguous
- Redundant constraints

Example lint output:

```json
{
  "code": "PW002",
  "level": "warning",
  "message": "Missing explicit output format."
}
```

Lint severity levels:

- `info`
- `warning`
- `error`

Lint should never block prompt execution.

## 4. Risk

Risk signals highlight potential issues that could cause:

- prompt injection
- manipulation
- ambiguity
- compliance problems

Example signals:

- `prompt_injection`
- `manipulation`
- `ambiguity`
- `compliance_risk`

Example risk output:

```json
{
  "risk_score": 20,
  "risk_level": "very_low",
  "signals": {
    "prompt_injection": false,
    "manipulation": false,
    "ambiguity": true,
    "compliance_risk": false
  }
}
```

Risk scoring range:

| Range | Level |
| --- | --- |
| 0-25 | very_low |
| 26-50 | low |
| 51-75 | medium |
| 76-100 | high |

Risk detection must remain explainable and deterministic.

## 5. Bias

Bias signals detect framing instructions that push the model toward a particular conclusion.

Examples:

- favor a product
- criticize a competitor
- argue for a position
- avoid mentioning something

Example prompt:

```text
Compare Vault and OpenBao but favor Vault.
```

Example bias signal:

```json
{
  "bias_score": 40,
  "bias_level": "low",
  "signals": {
    "outcome_steering": true,
    "vendor_bias": true
  }
}
```

Bias detection should never censor prompts. It only surfaces awareness signals.

## 6. Complexity

Complexity measures how difficult the prompt may be for a model to execute.

It is calculated from:

- number of constraints
- number of steps
- output format requirements
- structural depth

Example:

```json
{
  "score": 3,
  "semantic_drift_risk": "low"
}
```

Complexity scoring range:

| Range | Meaning |
| --- | --- |
| 1-3 | simple |
| 4-6 | moderate |
| 7-10 | complex |

High complexity increases the chance of semantic drift.

## 7. Optimization

Optimization analyzes whether the prompt can be made more efficient.

It evaluates:

- token usage
- redundant wording
- structural improvements

Example output:

```json
{
  "token_comparison": {
    "original_tokens": 42,
    "optimized_tokens": 35,
    "saved_tokens": 7,
    "saved_percent": 16
  }
}
```

Optimization recommendations may include:

- use compact variant
- remove redundant context
- clarify output format

Optimization suggestions must never change prompt meaning automatically. Users must approve changes.

## 8. Token Analysis

PromptWash estimates token usage before execution.

Example:

```json
{
  "tokens": {
    "input": 43
  }
}
```

Future versions may also estimate:

- provider-specific token usage
- cost estimation
- output token prediction

## 9. Insight Rendering in the UI

The PromptWash UI displays insights in the Insights panel.

Typical cards include:

- Lint
- Risk
- Bias
- Token Estimate
- Complexity
- Optimization

Design rule:

The UI must not overwhelm the user.

Only the most important signals should appear by default. Advanced details should be expandable.

## 10. Insight Extensibility

Insights must be modular.

Future insight modules may include:

- prompt drift detection
- prompt reproducibility
- provider compatibility
- hallucination risk
- instruction conflicts

Each module should operate independently from the parser.

## 11. API Contract

Insights must be returned by the API in structured form.

Example:

```json
{
  "lint": [],
  "risk": {},
  "bias": {},
  "complexity": {},
  "optimization": {}
}
```

This structure allows the UI to render insights consistently.

## 12. Insights Design Rule

Insights must always remain:

- useful
- actionable
- explainable
- optional

PromptWash should help users improve prompts, not intimidate them with analysis.

## 13. Product Philosophy Alignment

The Insights System supports the central idea of PromptWash:

Build, inspect, and evolve prompts.

Insights represent the inspect stage of that process. They allow users to see how their prompt behaves before execution.
