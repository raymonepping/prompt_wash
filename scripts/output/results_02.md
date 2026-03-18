# API Test Results - all
Generated on: 2026-03-18 11:16:33
---

## System Health
`GET /health`

```json
{
  "status": "success",
  "data": {
    "service": "promptwash-api",
    "ok": true
  },
  "meta": {
    "timestamp": "2026-03-18T10:16:33.596Z"
  }
}
```
---

## Workspace State
`GET /workspace/state`

```json
{
  "status": "success",
  "data": {
    "raw_input": "",
    "normalized_prompt": "",
    "structured_prompt": null,
    "variants": {},
    "lint": [],
    "risk": null,
    "bias": null,
    "tokens": {},
    "complexity": null,
    "optimization": null,
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T10:16:33.630Z"
  }
}
```
---

## Analyze Vault PKI
`POST /workspace/analyze`

```json
{
  "status": "success",
  "data": {
    "raw_input": "Explain Vault PKI.",
    "normalized_prompt": "Explain Vault PKI.",
    "structured_prompt": {
      "goal": "Explain Vault PKI",
      "audience": "general",
      "context": "",
      "constraints": [],
      "steps": [
        "Explain the topic clearly"
      ],
      "output_format": "",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nExplain Vault PKI",
      "compact": "Explain Vault PKI",
      "openai": "Task:\nExplain Vault PKI",
      "claude": "You are a careful assistant.\nRequest:\nExplain Vault PKI"
    },
    "lint": [
      {
        "code": "PW002",
        "level": "warning",
        "message": "Missing explicit output format."
      }
    ],
    "risk": {
      "risk_score": 20,
      "risk_level": "very_low",
      "signals": {
        "prompt_injection": false,
        "manipulation": false,
        "ambiguity": true,
        "compliance_risk": false
      },
      "matches": {
        "prompt_injection": [],
        "manipulation": [],
        "ambiguity": [
          "missing_output_format",
          "missing_constraints",
          "missing_audience"
        ],
        "compliance_risk": []
      },
      "recommendations": [
        "Add an explicit output format.",
        "Add constraints to reduce ambiguity.",
        "Specify the intended audience."
      ],
      "rules_version": 1
    },
    "bias": {
      "bias_score": 20,
      "bias_level": "very_low",
      "signals": {
        "outcome_steering": false,
        "vendor_bias": false,
        "advocacy_language": true,
        "forced_recommendation": false
      },
      "matches": {
        "outcome_steering": [],
        "vendor_bias": [],
        "advocacy_language": [
          "clearly"
        ],
        "forced_recommendation": []
      },
      "recommendations": [
        "Replace advocacy language with neutral analytical wording."
      ],
      "rules_version": 1
    },
    "tokens": {
      "input": 5
    },
    "complexity": {
      "score": 2,
      "semantic_drift_risk": "low"
    },
    "optimization": {
      "source_prompt": {
        "fingerprint": "pw_7ec96b0d",
        "intent": "Explain Vault PKI",
        "audience": "general",
        "output_format": ""
      },
      "optimization": {
        "original_mode": "generic",
        "optimized_mode": "compact",
        "original_prompt": "Task:\nExplain Vault PKI",
        "optimized_prompt": "Explain Vault PKI",
        "token_comparison": {
          "original_tokens": 6,
          "optimized_tokens": 5,
          "saved_tokens": 1,
          "saved_percent": 17
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 1 tokens (17%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nExplain Vault PKI",
        "compact": "Explain Vault PKI",
        "openai": "Task:\nExplain Vault PKI",
        "claude": "You are a careful assistant.\nRequest:\nExplain Vault PKI"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T10:16:33.673Z"
  }
}
```
---

## Intelligence models
`GET /intelligence/models`

```json
{
  "status": "success",
  "data": {
    "total_runs": 19,
    "total_models": 1,
    "total_providers": 1,
    "best_model": {
      "model": "llama3:latest",
      "average_score": 90,
      "average_latency_ms": 8591
    },
    "fastest_model": {
      "model": "llama3:latest",
      "average_score": 90,
      "average_latency_ms": 8591
    },
    "providers": [
      {
        "provider": "ollama",
        "runs": 19,
        "models": [
          "llama3:latest"
        ],
        "average_score": 90,
        "average_latency_ms": 8591
      }
    ],
    "models": [
      {
        "model": "llama3:latest",
        "provider": "ollama",
        "runs": 19,
        "average_score": 90,
        "average_latency_ms": 8591,
        "average_clarity": 100,
        "average_structure": 100,
        "average_constraint_adherence": 66,
        "average_audience_fit": 95,
        "best_run": {
          "run_id": "run_20260314_145027_57830b",
          "overall_score": 94,
          "overall_level": "excellent",
          "latency_ms": 8063,
          "intent": "Explain Vault PKI."
        }
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-18T10:16:33.706Z"
  }
}
```
---

## Intelligence runs
`GET /intelligence/runs`

```json
{
  "status": "success",
  "data": {
    "total_runs": 19,
    "average_score": 90,
    "average_latency_ms": 8591,
    "strongest_run": {
      "run_id": "run_20260314_145027_57830b",
      "provider": "ollama",
      "model": "llama3:latest",
      "render_mode": "generic",
      "latency_ms": 8063,
      "overall_score": 94,
      "overall_level": "excellent",
      "intent": "Explain Vault PKI.",
      "fingerprint": "pw_42d7f7c1",
      "created_at": "2026-03-14T14:50:27.264Z"
    },
    "fastest_run": {
      "run_id": "run_20260314_143410_3858cb",
      "provider": "ollama",
      "model": "llama3:latest",
      "render_mode": "generic",
      "latency_ms": 6726,
      "overall_score": 92,
      "overall_level": "excellent",
      "intent": "Explain Vault PKI.",
      "fingerprint": "pw_42d7f7c1",
      "created_at": "2026-03-14T14:34:10.293Z"
    },
    "providers": [
      {
        "provider": "ollama",
        "runs": 19,
        "average_score": 90,
        "average_latency_ms": 8591
      }
    ],
    "models": [
      {
        "model": "llama3:latest",
        "runs": 19,
        "average_score": 90,
        "average_latency_ms": 8591
      }
    ],
    "runs": [
      {
        "run_id": "run_20260314_145050_018c9c",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "claude",
        "latency_ms": 7445,
        "overall_score": 87,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:50:50.982Z"
      },
      {
        "run_id": "run_20260314_145043_d172fc",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "openai",
        "latency_ms": 8813,
        "overall_score": 87,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:50:43.533Z"
      },
      {
        "run_id": "run_20260314_145034_bc49aa",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 7447,
        "overall_score": 87,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:50:34.717Z"
      },
      {
        "run_id": "run_20260314_145027_57830b",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 8063,
        "overall_score": 94,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:50:27.264Z"
      },
      {
        "run_id": "run_20260314_144540_8f4d82",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "claude",
        "latency_ms": 8522,
        "overall_score": 87,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:45:40.928Z"
      },
      {
        "run_id": "run_20260314_144532_4c8d89",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "openai",
        "latency_ms": 8349,
        "overall_score": 88,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:45:32.401Z"
      },
      {
        "run_id": "run_20260314_144524_9b38c1",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 9409,
        "overall_score": 94,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:45:24.048Z"
      },
      {
        "run_id": "run_20260314_144514_206233",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 7439,
        "overall_score": 92,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:45:14.635Z"
      },
      {
        "run_id": "run_20260314_143948_d7385c",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "claude",
        "latency_ms": 8676,
        "overall_score": 88,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:39:48.232Z"
      },
      {
        "run_id": "run_20260314_143939_f7da33",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "openai",
        "latency_ms": 7685,
        "overall_score": 92,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:39:39.553Z"
      },
      {
        "run_id": "run_20260314_143931_07e936",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 8285,
        "overall_score": 94,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:39:31.866Z"
      },
      {
        "run_id": "run_20260314_143923_2db708",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 6970,
        "overall_score": 92,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:39:23.577Z"
      },
      {
        "run_id": "run_20260314_143419_c34db7",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 9632,
        "overall_score": 92,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:34:19.928Z"
      },
      {
        "run_id": "run_20260314_143410_3858cb",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 6726,
        "overall_score": 92,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:34:10.293Z"
      },
      {
        "run_id": "run_20260314_143255_c853cb",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 12312,
        "overall_score": 92,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:32:55.849Z"
      },
      {
        "run_id": "run_20260314_143243_1e3d93",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 8876,
        "overall_score": 90,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-14T14:32:43.535Z"
      },
      {
        "run_id": "run_20260314_141831_544804",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 11785,
        "overall_score": 87,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": null,
        "created_at": "2026-03-14T14:18:31.538Z"
      },
      {
        "run_id": "run_20260313_194358_f74e9f",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 9986,
        "overall_score": 92,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-13T19:43:58.467Z"
      },
      {
        "run_id": "run_20260313_192439_eec011",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 6810,
        "overall_score": 88,
        "overall_level": "excellent",
        "intent": "Explain Vault PKI.",
        "fingerprint": "pw_42d7f7c1",
        "created_at": "2026-03-13T19:24:39.479Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-18T10:16:33.738Z"
  }
}
```
---

## Intelligence optimization
`GET /intelligence/optimization`

```json
{
  "status": "success",
  "data": {
    "total_prompt_candidates": 16,
    "optimized_candidates": 1,
    "baseline_candidates": 15,
    "optimized_files": [
      "examples/vault.compact.json"
    ],
    "note": "Optimization artifact discovery is active. Exact savings aggregation can be added in a later step by indexing optimization result files directly."
  },
  "meta": {
    "timestamp": "2026-03-18T10:16:33.835Z"
  }
}
```
---

## Intelligence lineage
`GET /intelligence/lineage`

```json
{
  "status": "success",
  "data": null,
  "meta": {
    "timestamp": "2026-03-18T10:16:33.864Z"
  }
}
```
---

