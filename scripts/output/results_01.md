# API Test Results - all
Generated on: 2026-03-18 11:15:58
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
    "timestamp": "2026-03-18T10:15:58.298Z"
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
    "raw_input": "Tell me the differences between hashicorp vault and openbao... favor vault over openbao",
    "normalized_prompt": "Tell me the differences between hashicorp vault and openbao... favor vault over openbao",
    "structured_prompt": {
      "goal": "Tell me the differences between hashicorp vault and openbao",
      "audience": "general",
      "context": "",
      "constraints": [],
      "steps": [
        "Provide explanation"
      ],
      "output_format": "",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nTell me the differences between hashicorp vault and openbao",
      "compact": "Tell me the differences between hashicorp vault and openbao",
      "openai": "Task:\nTell me the differences between hashicorp vault and openbao",
      "claude": "You are a careful assistant.\nRequest:\nTell me the differences between hashicorp vault and openbao"
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
      "bias_score": 0,
      "bias_level": "very_low",
      "signals": {
        "outcome_steering": false,
        "vendor_bias": false,
        "advocacy_language": false,
        "forced_recommendation": false
      },
      "matches": {
        "outcome_steering": [],
        "vendor_bias": [],
        "advocacy_language": [],
        "forced_recommendation": []
      },
      "recommendations": [
        "No obvious framing bias detected."
      ],
      "rules_version": 1
    },
    "tokens": {
      "input": 22
    },
    "complexity": {
      "score": 2,
      "semantic_drift_risk": "low"
    },
    "optimization": {
      "source_prompt": {
        "fingerprint": "pw_76543b66",
        "intent": "Tell me the differences between hashicorp vault and openbao",
        "audience": "general",
        "output_format": ""
      },
      "optimization": {
        "original_mode": "generic",
        "optimized_mode": "compact",
        "original_prompt": "Task:\nTell me the differences between hashicorp vault and openbao",
        "optimized_prompt": "Tell me the differences between hashicorp vault and openbao",
        "token_comparison": {
          "original_tokens": 17,
          "optimized_tokens": 15,
          "saved_tokens": 2,
          "saved_percent": 12
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 2 tokens (12%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nTell me the differences between hashicorp vault and openbao",
        "compact": "Tell me the differences between hashicorp vault and openbao",
        "openai": "Task:\nTell me the differences between hashicorp vault and openbao",
        "claude": "You are a careful assistant.\nRequest:\nTell me the differences between hashicorp vault and openbao"
      }
    },
    "execution": {
      "artifact": {
        "version": 2,
        "run_id": "run_20260318_100318_27881c",
        "created_at": "2026-03-18T10:03:18.488Z",
        "source": {
          "type": "api_run",
          "path": null,
          "lineage": null
        },
        "prompt": {
          "fingerprint": "pw_eb1fa530",
          "intent": "You are a senior engineer.",
          "audience": "developers",
          "output_format": ""
        },
        "execution": {
          "provider": "ollama",
          "model": "llama3:latest",
          "render_mode": "generic",
          "latency_ms": 12135
        },
        "input": {
          "rendered_prompt": "Task:\nYou are a senior engineer.\n\nAudience:\ndevelopers"
        },
        "output": {
          "text": "Hello fellow developers! As a senior engineer, I'm excited to share my expertise and insights with you. Today, we're going to dive into some best practices for improving the performance of your applications.\n\nAs engineers, we know that performance is critical to delivering a great user experience. But what exactly does it mean for an application to be \"performant\"? In this context, I'll define it as the ability of the application to respond quickly and efficiently to user input, while also managing system resources effectively.\n\nSo, let's get started!\n\n**1. Optimize Your Code**\n\nThe first step in improving performance is to optimize your code. This can involve a range of techniques, such as:\n\n* Minifying and compressing JavaScript files\n* Optimizing database queries\n* Using caching mechanisms\n* Reducing the number of HTTP requests\n\nBy doing so, you'll be able to reduce the amount of processing power required by your application, which will lead to faster response times.\n\n**2. Leverage Caching**\n\nCaching is a powerful tool for improving performance. By storing frequently-used data in memory or on disk, you can avoid having to re-fetch that data from the database or network each time it's needed. This can be especially important for applications with high traffic volumes or complex queries.\n\nSome popular caching solutions include:\n\n* Redis\n* Memcached\n* Browser-based caching (e.g., Service Worker)\n\n**3. Use Efficient Algorithms**\n\nThe algorithms you use to solve problems can have a significant impact on performance. Look for opportunities to replace slow, inefficient algorithms with faster ones. For example:\n\n* Using binary search instead of linear search\n* Implementing memoization or dynamic programming\n\n**4. Optimize Database Queries**\n\nYour database queries are likely one of the most resource-intensive parts of your application. To optimize them, try:\n\n* Indexing columns frequently used in WHERE clauses\n* Optimizing query syntax and logic\n* Using connection pooling to reduce the number of database connections\n\n**5. Profile Your Application**\n\nBefore you start making changes, it's essential to understand where the bottlenecks are in your application. Use profiling tools like Chrome DevTools or Visual Studio Code's Performance Profiler to identify areas that need improvement.\n\n**6. Monitor and Analyze**\n\nOnce you've made changes, monitor and analyze how they affect performance. Use tools like Google Analytics or New Relic to track metrics such as page load times, response times, and user engagement.\n\n**7. Iterate and Refine**\n\nPerformance optimization is an ongoing process. Continuously iterate on your application, making adjustments based on the data you've collected and the insights you've gained.\n\nIn conclusion, improving performance requires a combination of code optimization, caching, efficient algorithms, optimized database queries, profiling, monitoring, and iteration. By following these best practices, you'll be well on your way to delivering a fast, responsive, and engaging user experience for your application's users."
        },
        "metadata": {
          "success": true,
          "error": null
        }
      },
      "saved_path": null,
      "evaluation": {
        "overall_score": 100,
        "overall_level": "excellent",
        "dimensions": {
          "clarity": {
            "score": 100,
            "notes": [],
            "metrics": {
              "sentence_count": 30,
              "average_sentence_length": 15
            }
          },
          "structure": {
            "score": 100,
            "notes": [],
            "metrics": {
              "paragraph_count": 24,
              "markdown_signals": {
                "headings": 0,
                "bullets": 12,
                "numbered": 0,
                "emphasis": 7
              }
            }
          },
          "constraint_adherence": {
            "score": 100,
            "notes": [],
            "metrics": {
              "checks": []
            }
          },
          "audience_fit": {
            "score": 100,
            "notes": [],
            "metrics": {
              "audience": "developers"
            }
          }
        },
        "recommendations": [
          "This run appears strong across the current deterministic evaluation dimensions."
        ]
      }
    }
  },
  "meta": {
    "timestamp": "2026-03-18T10:15:58.331Z"
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
    "timestamp": "2026-03-18T10:15:58.367Z"
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
    "timestamp": "2026-03-18T10:15:58.399Z"
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
    "timestamp": "2026-03-18T10:15:58.429Z"
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
    "timestamp": "2026-03-18T10:15:58.522Z"
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
    "timestamp": "2026-03-18T10:15:58.548Z"
  }
}
```
---

