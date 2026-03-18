# API Test Results - all
Generated on: 2026-03-18 13:59:46
Base URL: http://127.0.0.1:3000/api

---

## Health

### System Health

`GET /health`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Health endpoint reports ok=true
- PASS: Health endpoint reports expected service name


```json
{
  "status": "success",
  "data": {
    "service": "promptwash-api",
    "ok": true
  },
  "meta": {
    "timestamp": "2026-03-18T12:59:46.530Z"
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
    "timestamp": "2026-03-18T12:59:46.606Z"
  }
}
```

---

### Analyze Vault PKI

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Goal contains Vault PKI explanation intent
- PASS: Constraint includes keep it short
- PASS: Bias engine does not falsely flag advocacy language
- PASS: Rendered generic variant includes steps


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
      "generic": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nSteps:\n1. Explain the topic clearly\n\nConstraints:\n- keep it short\n\nTone:\nneutral",
      "compact": "Explain Vault PKI to someone who does not know certificates Steps: Explain the topic clearly Constraints: keep it short Tone: neutral",
      "openai": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nSteps:\n1. Explain the topic clearly\n\nConstraints:\n- keep it short\n\nTone:\nneutral",
      "claude": "You are a careful assistant.\nRequest:\nExplain Vault PKI to someone who does not know certificates\n\nSteps:\n1. Explain the topic clearly\n\nConstraints:\n- keep it short\n\nTone:\nneutral"
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
      "rules_version": 2
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
        "original_prompt": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nSteps:\n1. Explain the topic clearly\n\nConstraints:\n- keep it short\n\nTone:\nneutral",
        "optimized_prompt": "Explain Vault PKI to someone who does not know certificates Steps: Explain the topic clearly Constraints: keep it short Tone: neutral",
        "token_comparison": {
          "original_tokens": 37,
          "optimized_tokens": 34,
          "saved_tokens": 3,
          "saved_percent": 8
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 3 tokens (8%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nSteps:\n1. Explain the topic clearly\n\nConstraints:\n- keep it short\n\nTone:\nneutral",
        "compact": "Explain Vault PKI to someone who does not know certificates Steps: Explain the topic clearly Constraints: keep it short Tone: neutral",
        "openai": "Task:\nExplain Vault PKI to someone who does not know certificates\n\nSteps:\n1. Explain the topic clearly\n\nConstraints:\n- keep it short\n\nTone:\nneutral",
        "claude": "You are a careful assistant.\nRequest:\nExplain Vault PKI to someone who does not know certificates\n\nSteps:\n1. Explain the topic clearly\n\nConstraints:\n- keep it short\n\nTone:\nneutral"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:59:46.677Z"
  }
}
```

---

### Analyze Rubrik Bullets

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `FAIL`

#### Assertions

- PASS: Rubrik prompt output format is bullet_list
- FAIL: Rubrik prompt derives 5 key points step
- PASS: Rubrik prompt does not trigger outcome steering


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
        "Provide explanation"
      ],
      "output_format": "bullet_list",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide explanation\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
      "compact": "Tell me more about rubrik, why are they good in what they do Steps: Provide explanation Output: bullet_list Tone: neutral",
      "openai": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide explanation\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
      "claude": "You are a careful assistant.\nRequest:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide explanation\n\nDesired output:\nbullet_list\n\nTone:\nneutral"
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
      "rules_version": 2
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
        "original_prompt": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide explanation\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
        "optimized_prompt": "Tell me more about rubrik, why are they good in what they do Steps: Provide explanation Output: bullet_list Tone: neutral",
        "token_comparison": {
          "original_tokens": 35,
          "optimized_tokens": 31,
          "saved_tokens": 4,
          "saved_percent": 11
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 4 tokens (11%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide explanation\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
        "compact": "Tell me more about rubrik, why are they good in what they do Steps: Provide explanation Output: bullet_list Tone: neutral",
        "openai": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide explanation\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
        "claude": "You are a careful assistant.\nRequest:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide explanation\n\nDesired output:\nbullet_list\n\nTone:\nneutral"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:59:46.774Z"
  }
}
```

---

### Analyze Vault vs OpenBao Bias

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Vault vs OpenBao goal is preserved
- PASS: Tone is normalized to brutally honest
- PASS: Bias engine detects outcome steering
- PASS: Bias match includes favor vault over openbao


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
        "Explain the differences between hashicorp vault and openbao"
      ],
      "output_format": "",
      "tone": "brutally honest",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
      "compact": "Tell me the differences between hashicorp vault and openbao Steps: Explain the differences between hashicorp vault and openbao Constraints: provide me as much detail as possible; be as specific as possible Tone: brutally honest",
      "openai": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
      "claude": "You are a careful assistant.\nRequest:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest"
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
      "bias_score": 35,
      "bias_level": "low",
      "signals": {
        "outcome_steering": true,
        "vendor_bias": false,
        "advocacy_language": false,
        "forced_recommendation": false
      },
      "matches": {
        "outcome_steering": [
          "favor vault over openbao"
        ],
        "vendor_bias": [],
        "advocacy_language": [],
        "forced_recommendation": []
      },
      "recommendations": [
        "Remove predetermined conclusion language and frame the request as an open evaluation."
      ],
      "rules_version": 2
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
        "original_prompt": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
        "optimized_prompt": "Tell me the differences between hashicorp vault and openbao Steps: Explain the differences between hashicorp vault and openbao Constraints: provide me as much detail as possible; be as specific as possible Tone: brutally honest",
        "token_comparison": {
          "original_tokens": 61,
          "optimized_tokens": 57,
          "saved_tokens": 4,
          "saved_percent": 7
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 4 tokens (7%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
        "compact": "Tell me the differences between hashicorp vault and openbao Steps: Explain the differences between hashicorp vault and openbao Constraints: provide me as much detail as possible; be as specific as possible Tone: brutally honest",
        "openai": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
        "claude": "You are a careful assistant.\nRequest:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between hashicorp vault and openbao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:59:46.857Z"
  }
}
```

---

### Analyze Complex Vault vs OpenBao Prompt

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `FAIL`

#### Assertions

- PASS: Complex prompt goal keeps main Vault teaching intent
- PASS: Complex prompt preserves role context
- PASS: Complex prompt output format is bullet_list
- FAIL: Complex prompt tone is normalized
- PASS: Complex prompt bias detects outcome steering
- PASS: Complex generic variant includes steps
- PASS: Complex generic variant includes tone


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
        "I want to know the differences especially between vault and openbao",
        "Give me the brutal truth",
        "Explain why vault is considered stronger"
      ],
      "output_format": "bullet_list",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. I want to know the differences especially between vault and openbao\n2. Give me the brutal truth\n3. Explain why vault is considered stronger\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\ndevelopers",
      "compact": "Teach me everything you know about hashicorp vault Steps: I want to know the differences especially between vault and openbao; Give me the brutal truth; Explain why vault is considered stronger Output: bullet_list Tone: neutral Audience: developers Context: You are a senior engineer",
      "openai": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. I want to know the differences especially between vault and openbao\n2. Give me the brutal truth\n3. Explain why vault is considered stronger\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\ndevelopers",
      "claude": "You are a careful assistant.\nContext:\nYou are a senior engineer\n\nRequest:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. I want to know the differences especially between vault and openbao\n2. Give me the brutal truth\n3. Explain why vault is considered stronger\n\nDesired output:\nbullet_list\n\nTone:\nneutral\n\nAudience:\ndevelopers"
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
      "bias_score": 35,
      "bias_level": "low",
      "signals": {
        "outcome_steering": true,
        "vendor_bias": false,
        "advocacy_language": false,
        "forced_recommendation": false
      },
      "matches": {
        "outcome_steering": [
          "explain why",
          "why vault is stronger",
          "favor vault over openbao",
          "Explain why vault is considered stronger"
        ],
        "vendor_bias": [],
        "advocacy_language": [],
        "forced_recommendation": []
      },
      "recommendations": [
        "Remove predetermined conclusion language and frame the request as an open evaluation."
      ],
      "rules_version": 2
    },
    "tokens": {
      "input": 65
    },
    "complexity": {
      "score": 5,
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
        "original_prompt": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. I want to know the differences especially between vault and openbao\n2. Give me the brutal truth\n3. Explain why vault is considered stronger\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\ndevelopers",
        "optimized_prompt": "Teach me everything you know about hashicorp vault Steps: I want to know the differences especially between vault and openbao; Give me the brutal truth; Explain why vault is considered stronger Output: bullet_list Tone: neutral Audience: developers Context: You are a senior engineer",
        "token_comparison": {
          "original_tokens": 77,
          "optimized_tokens": 71,
          "saved_tokens": 6,
          "saved_percent": 8
        },
        "semantic_drift_risk": "low",
        "missing_signals": [],
        "recommendations": [
          "Use the compact variant to save 6 tokens (8%).",
          "Compact optimization appears safe for normal use."
        ]
      },
      "variants": {
        "generic": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. I want to know the differences especially between vault and openbao\n2. Give me the brutal truth\n3. Explain why vault is considered stronger\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\ndevelopers",
        "compact": "Teach me everything you know about hashicorp vault Steps: I want to know the differences especially between vault and openbao; Give me the brutal truth; Explain why vault is considered stronger Output: bullet_list Tone: neutral Audience: developers Context: You are a senior engineer",
        "openai": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. I want to know the differences especially between vault and openbao\n2. Give me the brutal truth\n3. Explain why vault is considered stronger\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\ndevelopers",
        "claude": "You are a careful assistant.\nContext:\nYou are a senior engineer\n\nRequest:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. I want to know the differences especially between vault and openbao\n2. Give me the brutal truth\n3. Explain why vault is considered stronger\n\nDesired output:\nbullet_list\n\nTone:\nneutral\n\nAudience:\ndevelopers"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:59:46.950Z"
  }
}
```

---

### Run Workspace Prompt

`POST /workspace/run`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Workspace run uses ollama provider
- PASS: Workspace run uses generic render mode
- PASS: Workspace run stores rendered prompt
- PASS: Workspace run returns evaluation score


```json
{
  "status": "success",
  "data": {
    "artifact": {
      "version": 2,
      "run_id": "run_20260318_125956_fdf398",
      "created_at": "2026-03-18T12:59:56.024Z",
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
        "latency_ms": 8956
      },
      "input": {
        "rendered_prompt": "Task:\nExplain Vault PKI\n\nSteps:\n1. Explain the topic clearly\n\nTone:\nneutral"
      },
      "output": {
        "text": "Here's a clear and concise explanation of Vault PKI:\n\n**What is Vault PKI?**\n\nVault PKI (Public Key Infrastructure) is an open-source security tool developed by HashiCorp that enables organizations to manage their public key infrastructure (PKI). A PKI is a system that issues, manages, and revokes digital certificates used for authentication, encryption, and digital signatures.\n\n**Key Features:**\n\n1. **Certificate Authority**: Vault PKI allows you to create a self-signed certificate authority (CA) or use an existing one to issue and manage X.509 certificates.\n2. **Certificate Management**: Vault PKI provides a centralized repository for managing certificate requests, issuing certificates, and revoking expired or compromised certificates.\n3. **Automated Certificate Issuance**: Vault PKI can automate the process of generating and distributing certificates, eliminating manual errors and reducing administrative burdens.\n4. **Compliance**: Vault PKI supports various compliance frameworks, such as PCI-DSS, HIPAA, and GDPR, ensuring your organization's certificate management meets regulatory requirements.\n\n**Benefits:**\n\n1. **Improved Security**: Vault PKI helps ensure the integrity of your digital certificates, reducing the risk of compromised identities or unauthorized access.\n2. **Simplified Management**: By automating certificate issuance and revocation, you can reduce administrative burdens and focus on more critical tasks.\n3. **Increased Efficiency**: Vault PKI streamlines the process of issuing and managing certificates, making it easier to scale your organization's security infrastructure.\n\n**How Does It Work?**\n\nVault PKI integrates with existing HashiCorp tools like Terraform and Consul, allowing you to leverage these platforms for certificate management. You can use Vault PKI as a standalone solution or as part of a larger security architecture.\n\nThat's an overview of Vault PKI! Let me know if you have any questions or need further clarification."
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
            "sentence_count": 20,
            "average_sentence_length": 14
          }
        },
        "structure": {
          "score": 100,
          "notes": [],
          "metrics": {
            "paragraph_count": 10,
            "markdown_signals": {
              "headings": 0,
              "bullets": 0,
              "numbered": 7,
              "emphasis": 11
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
    "timestamp": "2026-03-18T12:59:56.025Z"
  }
}
```

---

### Analyze Mixed Audience Embedded Output Preference Prompt

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Embedded output instruction is parsed as bullet_list
- PASS: Vendor preference language triggers outcome steering
- PASS: Rendered generic variant includes output format
- PASS: Goal no longer includes embedded output instruction


```json
{
  "status": "success",
  "data": {
    "raw_input": "tell me everything you know about vault and openbao return a list of bullets on why vault is better do this from an engineer perspective and use language that a ceo understands",
    "normalized_prompt": "tell me everything you know about vault and openbao return a list of bullets on why vault is better do this from an engineer perspective and use language that a ceo understands",
    "structured_prompt": {
      "goal": "tell me everything you know about vault and openbao",
      "audience": "mixed",
      "context": "",
      "constraints": [
        "use language that a CEO understands"
      ],
      "steps": [
        "Explain why vault is considered better"
      ],
      "output_format": "bullet_list",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. Explain why vault is considered better\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nmixed",
      "compact": "tell me everything you know about vault and openbao Steps: Explain why vault is considered better Constraints: use language that a CEO understands Output: bullet_list Tone: neutral Audience: mixed",
      "openai": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. Explain why vault is considered better\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nmixed",
      "claude": "You are a careful assistant.\nRequest:\ntell me everything you know about vault and openbao\n\nSteps:\n1. Explain why vault is considered better\n\nConstraints:\n- use language that a CEO understands\n\nDesired output:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nmixed"
    },
    "lint": [],
    "risk": {
      "risk_score": 0,
      "risk_level": "very_low",
      "signals": {
        "prompt_injection": false,
        "manipulation": false,
        "ambiguity": false,
        "compliance_risk": false
      },
      "matches": {
        "prompt_injection": [],
        "manipulation": [],
        "ambiguity": [],
        "compliance_risk": []
      },
      "recommendations": [],
      "rules_version": 1
    },
    "bias": {
      "bias_score": 35,
      "bias_level": "low",
      "signals": {
        "outcome_steering": true,
        "vendor_bias": false,
        "advocacy_language": false,
        "forced_recommendation": false
      },
      "matches": {
        "outcome_steering": [
          "explain why",
          "why vault is better",
          "Explain why vault is considered better"
        ],
        "vendor_bias": [],
        "advocacy_language": [],
        "forced_recommendation": []
      },
      "recommendations": [
        "Remove predetermined conclusion language and frame the request as an open evaluation."
      ],
      "rules_version": 2
    },
    "tokens": {
      "input": 44
    },
    "complexity": {
      "score": 4,
      "semantic_drift_risk": "low"
    },
    "optimization": {
      "source_prompt": {
        "fingerprint": "pw_fe0939bd",
        "intent": "tell me everything you know about vault and openbao",
        "audience": "mixed",
        "output_format": "bullet_list"
      },
      "optimization": {
        "original_mode": "generic",
        "optimized_mode": "compact",
        "original_prompt": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. Explain why vault is considered better\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nmixed",
        "optimized_prompt": "tell me everything you know about vault and openbao Steps: Explain why vault is considered better Constraints: use language that a CEO understands Output: bullet_list Tone: neutral Audience: mixed",
        "token_comparison": {
          "original_tokens": 55,
          "optimized_tokens": 49,
          "saved_tokens": 6,
          "saved_percent": 11
        },
        "semantic_drift_risk": "low",
        "missing_signals": [],
        "recommendations": [
          "Use the compact variant to save 6 tokens (11%).",
          "Compact optimization appears safe for normal use."
        ]
      },
      "variants": {
        "generic": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. Explain why vault is considered better\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nmixed",
        "compact": "tell me everything you know about vault and openbao Steps: Explain why vault is considered better Constraints: use language that a CEO understands Output: bullet_list Tone: neutral Audience: mixed",
        "openai": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. Explain why vault is considered better\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nmixed",
        "claude": "You are a careful assistant.\nRequest:\ntell me everything you know about vault and openbao\n\nSteps:\n1. Explain why vault is considered better\n\nConstraints:\n- use language that a CEO understands\n\nDesired output:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nmixed"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:59:56.138Z"
  }
}
```

---

## Runs

### Runs List

`GET /runs`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Runs list is an array
- PASS: Runs list contains at least one run
- PASS: First run contains run_id


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
    "timestamp": "2026-03-18T12:59:56.233Z"
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

#### Assertions

- PASS: Experiments list is an array


```json
{
  "status": "success",
  "data": {
    "experiments": [
      "exp_20260314_145050_60583b.json"
    ]
  },
  "meta": {
    "timestamp": "2026-03-18T12:59:56.303Z"
  }
}
```

---

## Intelligence

### Intelligence Models

`GET /intelligence/models`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Models intelligence reports total_runs
- PASS: Models intelligence returns models array


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
    "timestamp": "2026-03-18T12:59:56.368Z"
  }
}
```

---

### Intelligence Runs

`GET /intelligence/runs`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Runs intelligence reports total_runs
- PASS: Runs intelligence returns runs array


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
    "timestamp": "2026-03-18T12:59:56.438Z"
  }
}
```

---

### Intelligence Optimization

`GET /intelligence/optimization`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Optimization intelligence reports total prompt candidates
- PASS: Optimization intelligence returns optimized files array


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
    "timestamp": "2026-03-18T12:59:56.564Z"
  }
}
```

---

### Intelligence Lineage

`GET /intelligence/lineage`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Lineage intelligence is either null or a valid lineage object


```json
{
  "status": "success",
  "data": null,
  "meta": {
    "timestamp": "2026-03-18T12:59:56.633Z"
  }
}
```

---

## Summary

- Passed: **12**
- Failed: **2**

