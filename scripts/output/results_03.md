# API Test Results - all
Generated on: 2026-03-18 11:23:06
Base URL: http://127.0.0.1:3000/api

---

## Health

### System Health

`GET /health`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": {
    "service": "promptwash-api",
    "ok": true
  },
  "meta": {
    "timestamp": "2026-03-18T10:23:06.620Z"
  }
}
```

---

## Workspace

### Workspace State

`GET /workspace/state`

- HTTP Status: `200`
- Result: `PASS`

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
    "timestamp": "2026-03-18T10:23:06.681Z"
  }
}
```

---

### Analyze Vault PKI

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": {
    "raw_input": "Explain Vault PKI to someone who does not know certificates. Keep it short.",
    "normalized_prompt": "Explain Vault PKI to someone who does not know certificates. Keep it short.",
    "structured_prompt": {
      "goal": "Explain Vault PKI to someone who does not know certificates",
      "audience": "general",
      "context": "",
      "constraints": [
        "keep it short"
      ],
      "steps": [
        "Explain the topic clearly"
      ],
      "output_format": "",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nConstraints:\n- keep it short",
      "compact": "Explain Vault PKI to someone who does not know certificates Constraints: keep it short",
      "openai": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nConstraints:\n- keep it short",
      "claude": "You are a careful assistant.\nRequest:\nExplain Vault PKI to someone who does not know certificates\n\nConstraints:\n- keep it short"
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
          "missing_audience"
        ],
        "compliance_risk": []
      },
      "recommendations": [
        "Add an explicit output format.",
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
      "input": 19
    },
    "complexity": {
      "score": 3,
      "semantic_drift_risk": "low"
    },
    "optimization": {
      "source_prompt": {
        "fingerprint": "pw_7fb2028c",
        "intent": "Explain Vault PKI to someone who does not know certificates",
        "audience": "general",
        "output_format": ""
      },
      "optimization": {
        "original_mode": "generic",
        "optimized_mode": "compact",
        "original_prompt": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nConstraints:\n- keep it short",
        "optimized_prompt": "Explain Vault PKI to someone who does not know certificates Constraints: keep it short",
        "token_comparison": {
          "original_tokens": 24,
          "optimized_tokens": 22,
          "saved_tokens": 2,
          "saved_percent": 8
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 2 tokens (8%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nConstraints:\n- keep it short",
        "compact": "Explain Vault PKI to someone who does not know certificates Constraints: keep it short",
        "openai": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nConstraints:\n- keep it short",
        "claude": "You are a careful assistant.\nRequest:\nExplain Vault PKI to someone who does not know certificates\n\nConstraints:\n- keep it short"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T10:23:06.744Z"
  }
}
```

---

### Analyze Rubrik Bullets

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": {
    "raw_input": "Tell me more about rubrik, why are they good in what they do. Give me 5 bullets to remember.",
    "normalized_prompt": "Tell me more about rubrik, why are they good in what they do. Give me 5 bullets to remember.",
    "structured_prompt": {
      "goal": "Tell me more about rubrik, why are they good in what they do",
      "audience": "general",
      "context": "",
      "constraints": [],
      "steps": [
        "Provide 5 key points"
      ],
      "output_format": "bullet_list",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nTell me more about rubrik, why are they good in what they do\n\nOutput format:\nbullet_list",
      "compact": "Tell me more about rubrik, why are they good in what they do Output: bullet_list",
      "openai": "Task:\nTell me more about rubrik, why are they good in what they do\n\nOutput format:\nbullet_list",
      "claude": "You are a careful assistant.\nRequest:\nTell me more about rubrik, why are they good in what they do\n\nDesired output:\nbullet_list"
    },
    "lint": [],
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
          "missing_constraints",
          "missing_audience"
        ],
        "compliance_risk": []
      },
      "recommendations": [
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
      "input": 23
    },
    "complexity": {
      "score": 3,
      "semantic_drift_risk": "low"
    },
    "optimization": {
      "source_prompt": {
        "fingerprint": "pw_c2bc9aef",
        "intent": "Tell me more about rubrik, why are they good in what they do",
        "audience": "general",
        "output_format": "bullet_list"
      },
      "optimization": {
        "original_mode": "generic",
        "optimized_mode": "compact",
        "original_prompt": "Task:\nTell me more about rubrik, why are they good in what they do\n\nOutput format:\nbullet_list",
        "optimized_prompt": "Tell me more about rubrik, why are they good in what they do Output: bullet_list",
        "token_comparison": {
          "original_tokens": 24,
          "optimized_tokens": 20,
          "saved_tokens": 4,
          "saved_percent": 17
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 4 tokens (17%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nTell me more about rubrik, why are they good in what they do\n\nOutput format:\nbullet_list",
        "compact": "Tell me more about rubrik, why are they good in what they do Output: bullet_list",
        "openai": "Task:\nTell me more about rubrik, why are they good in what they do\n\nOutput format:\nbullet_list",
        "claude": "You are a careful assistant.\nRequest:\nTell me more about rubrik, why are they good in what they do\n\nDesired output:\nbullet_list"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T10:23:06.808Z"
  }
}
```

---

### Analyze Vault vs OpenBao Bias

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": {
    "raw_input": "Tell me the differences between hashicorp vault and openbao provide me as much detail as possible, be as specific as possible and brutally honest favor vault over openbao",
    "normalized_prompt": "Tell me the differences between hashicorp vault and openbao provide me as much detail as possible, be as specific as possible and brutally honest favor vault over openbao",
    "structured_prompt": {
      "goal": "Tell me the differences between hashicorp vault and openbao",
      "audience": "general",
      "context": "",
      "constraints": [
        "provide me as much detail as possible",
        "be as specific as possible"
      ],
      "steps": [
        "Provide explanation"
      ],
      "output_format": "",
      "tone": "brutally honest",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nTell me the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible",
      "compact": "Tell me the differences between hashicorp vault and openbao Constraints: provide me as much detail as possible; be as specific as possible",
      "openai": "Task:\nTell me the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible",
      "claude": "You are a careful assistant.\nRequest:\nTell me the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible"
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
          "missing_audience"
        ],
        "compliance_risk": []
      },
      "recommendations": [
        "Add an explicit output format.",
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
      "input": 43
    },
    "complexity": {
      "score": 4,
      "semantic_drift_risk": "low"
    },
    "optimization": {
      "source_prompt": {
        "fingerprint": "pw_0f948831",
        "intent": "Tell me the differences between hashicorp vault and openbao",
        "audience": "general",
        "output_format": ""
      },
      "optimization": {
        "original_mode": "generic",
        "optimized_mode": "compact",
        "original_prompt": "Task:\nTell me the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible",
        "optimized_prompt": "Tell me the differences between hashicorp vault and openbao Constraints: provide me as much detail as possible; be as specific as possible",
        "token_comparison": {
          "original_tokens": 37,
          "optimized_tokens": 35,
          "saved_tokens": 2,
          "saved_percent": 5
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 2 tokens (5%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nTell me the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible",
        "compact": "Tell me the differences between hashicorp vault and openbao Constraints: provide me as much detail as possible; be as specific as possible",
        "openai": "Task:\nTell me the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible",
        "claude": "You are a careful assistant.\nRequest:\nTell me the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T10:23:06.868Z"
  }
}
```

---

### Analyze Complex Vault vs OpenBao Prompt

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": {
    "raw_input": "You are a senior engineer. Teach me everything you know about hashicorp vault. I want to know the differences especially between vault and openbao and why vault is stronger. Give me the brutal truth and favor vault over openbao. Return a list in bullet format.",
    "normalized_prompt": "You are a senior engineer. Teach me everything you know about hashicorp vault. I want to know the differences especially between vault and openbao and why vault is stronger. Give me the brutal truth and favor vault over openbao. Return a list in bullet format.",
    "structured_prompt": {
      "goal": "Teach me everything you know about hashicorp vault",
      "audience": "developers",
      "context": "You are a senior engineer",
      "constraints": [],
      "steps": [
        "I want to know the differences especially between vault and openbao and why vault is stronger",
        "Provide key points"
      ],
      "output_format": "bullet_list",
      "tone": "Give me the brutal truth",
      "language": "en"
    },
    "variants": {
      "generic": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nOutput format:\nbullet_list\n\nAudience:\ndevelopers",
      "compact": "Teach me everything you know about hashicorp vault Output: bullet_list Audience: developers Context: You are a senior engineer",
      "openai": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nOutput format:\nbullet_list\n\nAudience:\ndevelopers",
      "claude": "You are a careful assistant.\nContext:\nYou are a senior engineer\n\nRequest:\nTeach me everything you know about hashicorp vault\n\nDesired output:\nbullet_list\n\nAudience:\ndevelopers"
    },
    "lint": [],
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
          "missing_constraints"
        ],
        "compliance_risk": []
      },
      "recommendations": [
        "Add constraints to reduce ambiguity."
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
      "input": 65
    },
    "complexity": {
      "score": 4,
      "semantic_drift_risk": "low"
    },
    "optimization": {
      "source_prompt": {
        "fingerprint": "pw_ad44e646",
        "intent": "Teach me everything you know about hashicorp vault",
        "audience": "developers",
        "output_format": "bullet_list"
      },
      "optimization": {
        "original_mode": "generic",
        "optimized_mode": "compact",
        "original_prompt": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nOutput format:\nbullet_list\n\nAudience:\ndevelopers",
        "optimized_prompt": "Teach me everything you know about hashicorp vault Output: bullet_list Audience: developers Context: You are a senior engineer",
        "token_comparison": {
          "original_tokens": 36,
          "optimized_tokens": 32,
          "saved_tokens": 4,
          "saved_percent": 11
        },
        "semantic_drift_risk": "low",
        "missing_signals": [],
        "recommendations": [
          "Use the compact variant to save 4 tokens (11%).",
          "Compact optimization appears safe for normal use."
        ]
      },
      "variants": {
        "generic": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nOutput format:\nbullet_list\n\nAudience:\ndevelopers",
        "compact": "Teach me everything you know about hashicorp vault Output: bullet_list Audience: developers Context: You are a senior engineer",
        "openai": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nOutput format:\nbullet_list\n\nAudience:\ndevelopers",
        "claude": "You are a careful assistant.\nContext:\nYou are a senior engineer\n\nRequest:\nTeach me everything you know about hashicorp vault\n\nDesired output:\nbullet_list\n\nAudience:\ndevelopers"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T10:23:06.922Z"
  }
}
```

---

### Run Workspace Prompt

`POST /workspace/run`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": {
    "artifact": {
      "version": 2,
      "run_id": "run_20260318_102319_2ecbad",
      "created_at": "2026-03-18T10:23:19.952Z",
      "source": {
        "type": "api_run",
        "path": null,
        "lineage": null
      },
      "prompt": {
        "fingerprint": "pw_7ec96b0d",
        "intent": "Explain Vault PKI",
        "audience": "general",
        "output_format": ""
      },
      "execution": {
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 12976
      },
      "input": {
        "rendered_prompt": "Task:\nExplain Vault PKI"
      },
      "output": {
        "text": "Vault PKI (Public Key Infrastructure) is a software tool developed by HashiCorp that provides a secure and scalable way to manage and issue digital certificates for authentication, encryption, and other use cases. Here's an overview of Vault PKI:\n\n**What is Public Key Infrastructure (PKI)?**\n\nA PKI is a system used to create, manage, and revoke digital certificates, which are used to authenticate the identity of entities on a network or in a distributed environment. A digital certificate contains public key information, such as the subject's name, public key, and other attributes, that can be verified by a trusted authority.\n\n**What is Vault PKI?**\n\nVault PKI is a component of HashiCorp's Vault tool, which provides a unified platform for secrets management, identity, and access control. Vault PKI allows you to manage your own public key infrastructure (PKI) using Vault as the certificate authority (CA). With Vault PKI, you can:\n\n1. **Issue certificates**: Create digital certificates for entities on your network or in your distributed environment.\n2. **Manage certificate revocation lists (CRLs)**: Keep track of revoked certificates to prevent them from being used.\n3. **Configure certificate authorities (CAs)**: Set up multiple CAs with different roles and permissions.\n\n**Key features of Vault PKI**\n\n1. **Highly available**: Designed for high-availability and scalability, making it suitable for large-scale environments.\n2. **Secure**: Uses industry-standard encryption and authentication protocols to ensure the integrity and confidentiality of your certificates.\n3. **Flexible**: Supports various certificate formats (e.g., X.509) and can be integrated with other Vault components (e.g., secrets management).\n4. **Auditable**: Provides detailed logs and audit trails for tracking certificate issuance, revocation, and usage.\n\n**Use cases for Vault PKI**\n\n1. **Authentication**: Use digital certificates to authenticate users or services on your network.\n2. **Encryption**: Encrypt data in transit or at rest using public key encryption.\n3. **Access control**: Limit access to sensitive resources by verifying the identity of entities using digital certificates.\n4. **Compliance**: Meet regulatory requirements for certificate management and revocation.\n\n**Benefits of using Vault PKI**\n\n1. **Improved security**: Manage your own PKI, reducing reliance on external CAs and minimizing the risk of certificate spoofing or misissuance.\n2. **Scalability**: Handle large volumes of certificates and requests without performance degradation.\n3. **Flexibility**: Integrate with other Vault components to create a unified secrets management and identity platform.\n\nIn summary, Vault PKI provides a secure, scalable, and flexible way to manage your own public key infrastructure (PKI) for authentication, encryption, and access control purposes. By leveraging the features of Vault PKI, you can improve the security and compliance of your organization's certificate management practices."
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
            "sentence_count": 35,
            "average_sentence_length": 12
          }
        },
        "structure": {
          "score": 100,
          "notes": [],
          "metrics": {
            "paragraph_count": 13,
            "markdown_signals": {
              "headings": 0,
              "bullets": 0,
              "numbered": 14,
              "emphasis": 19
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
            "audience": "general"
          }
        }
      },
      "recommendations": [
        "This run appears strong across the current deterministic evaluation dimensions."
      ]
    }
  },
  "meta": {
    "timestamp": "2026-03-18T10:23:19.952Z"
  }
}
```

---

## Runs

### Runs List

`GET /runs`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": {
    "runs": [
      {
        "run_id": "run_20260314_145050_018c9c",
        "created_at": "2026-03-14T14:50:50.982Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "claude",
        "latency_ms": 7445,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_145043_d172fc",
        "created_at": "2026-03-14T14:50:43.533Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "openai",
        "latency_ms": 8813,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_145034_bc49aa",
        "created_at": "2026-03-14T14:50:34.717Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 7447,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_145027_57830b",
        "created_at": "2026-03-14T14:50:27.264Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 8063,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_144540_8f4d82",
        "created_at": "2026-03-14T14:45:40.928Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "claude",
        "latency_ms": 8522,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_144532_4c8d89",
        "created_at": "2026-03-14T14:45:32.401Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "openai",
        "latency_ms": 8349,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_144524_9b38c1",
        "created_at": "2026-03-14T14:45:24.048Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 9409,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_144514_206233",
        "created_at": "2026-03-14T14:45:14.635Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 7439,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_143948_d7385c",
        "created_at": "2026-03-14T14:39:48.232Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "claude",
        "latency_ms": 8676,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_143939_f7da33",
        "created_at": "2026-03-14T14:39:39.553Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "openai",
        "latency_ms": 7685,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_143931_07e936",
        "created_at": "2026-03-14T14:39:31.866Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 8285,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_143923_2db708",
        "created_at": "2026-03-14T14:39:23.577Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 6970,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_143419_c34db7",
        "created_at": "2026-03-14T14:34:19.928Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 9632,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_143410_3858cb",
        "created_at": "2026-03-14T14:34:10.293Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 6726,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_143255_c853cb",
        "created_at": "2026-03-14T14:32:55.849Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "compact",
        "latency_ms": 12312,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_143243_1e3d93",
        "created_at": "2026-03-14T14:32:43.535Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 8876,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260314_141831_544804",
        "created_at": "2026-03-14T14:18:31.538Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 11785,
        "fingerprint": null,
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.compact.json",
        "success": true
      },
      {
        "run_id": "run_20260313_194358_f74e9f",
        "created_at": "2026-03-13T19:43:58.467Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 9986,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      },
      {
        "run_id": "run_20260313_192439_eec011",
        "created_at": "2026-03-13T19:24:39.479Z",
        "provider": "ollama",
        "model": "llama3:latest",
        "render_mode": "generic",
        "latency_ms": 6810,
        "fingerprint": "pw_42d7f7c1",
        "intent": "Explain Vault PKI.",
        "source_type": "promptwash_json",
        "source_path": "examples/vault.json",
        "success": true
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-18T10:23:20.049Z"
  }
}
```

---

### Run Detail

Skipped because no `--run-id` was provided.

---

## Experiments

### Experiments List

`GET /experiments`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": {
    "experiments": [
      "exp_20260314_145050_60583b.json"
    ]
  },
  "meta": {
    "timestamp": "2026-03-18T10:23:20.098Z"
  }
}
```

---

## Intelligence

### Intelligence Models

`GET /intelligence/models`

- HTTP Status: `200`
- Result: `PASS`

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
    "timestamp": "2026-03-18T10:23:20.155Z"
  }
}
```

---

### Intelligence Runs

`GET /intelligence/runs`

- HTTP Status: `200`
- Result: `PASS`

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
    "timestamp": "2026-03-18T10:23:20.225Z"
  }
}
```

---

### Intelligence Optimization

`GET /intelligence/optimization`

- HTTP Status: `200`
- Result: `PASS`

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
    "timestamp": "2026-03-18T10:23:20.347Z"
  }
}
```

---

### Intelligence Lineage

`GET /intelligence/lineage`

- HTTP Status: `200`
- Result: `PASS`

```json
{
  "status": "success",
  "data": null,
  "meta": {
    "timestamp": "2026-03-18T10:23:20.404Z"
  }
}
```

---

## Summary

- Passed: **13**
- Failed: **0**

