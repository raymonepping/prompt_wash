# API Test Results - all
Generated on: 2026-03-18 13:31:50
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
    "timestamp": "2026-03-18T12:31:50.535Z"
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
    "timestamp": "2026-03-18T12:31:50.618Z"
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
    "timestamp": "2026-03-18T12:31:50.686Z"
  }
}
```

---

### Analyze Rubrik Bullets

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Rubrik prompt output format is bullet_list
- PASS: Rubrik prompt derives 5 key points step
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
        "Provide 5 key points"
      ],
      "output_format": "bullet_list",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide 5 key points\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
      "compact": "Tell me more about rubrik, why are they good in what they do Steps: Provide 5 key points Output: bullet_list Tone: neutral",
      "openai": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide 5 key points\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
      "claude": "You are a careful assistant.\nRequest:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide 5 key points\n\nDesired output:\nbullet_list\n\nTone:\nneutral"
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
        "original_prompt": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide 5 key points\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
        "optimized_prompt": "Tell me more about rubrik, why are they good in what they do Steps: Provide 5 key points Output: bullet_list Tone: neutral",
        "token_comparison": {
          "original_tokens": 36,
          "optimized_tokens": 31,
          "saved_tokens": 5,
          "saved_percent": 14
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 5 tokens (14%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide 5 key points\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
        "compact": "Tell me more about rubrik, why are they good in what they do Steps: Provide 5 key points Output: bullet_list Tone: neutral",
        "openai": "Task:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide 5 key points\n\nOutput format:\nbullet_list\n\nTone:\nneutral",
        "claude": "You are a careful assistant.\nRequest:\nTell me more about rubrik, why are they good in what they do\n\nSteps:\n1. Provide 5 key points\n\nDesired output:\nbullet_list\n\nTone:\nneutral"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:31:50.781Z"
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
        "Explain the differences between Vault and OpenBao"
      ],
      "output_format": "",
      "tone": "brutally honest",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
      "compact": "Tell me the differences between hashicorp vault and openbao Steps: Explain the differences between Vault and OpenBao Constraints: provide me as much detail as possible; be as specific as possible Tone: brutally honest",
      "openai": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
      "claude": "You are a careful assistant.\nRequest:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest"
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
          "favor vault over openbao",
          "Tell me the differences between hashicorp vault and openbao"
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
        "original_prompt": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
        "optimized_prompt": "Tell me the differences between hashicorp vault and openbao Steps: Explain the differences between Vault and OpenBao Constraints: provide me as much detail as possible; be as specific as possible Tone: brutally honest",
        "token_comparison": {
          "original_tokens": 58,
          "optimized_tokens": 55,
          "saved_tokens": 3,
          "saved_percent": 5
        },
        "semantic_drift_risk": "medium",
        "missing_signals": [
          "general"
        ],
        "recommendations": [
          "Use the compact variant to save 3 tokens (5%).",
          "Review the compact prompt before production use because some intent signals may be weakened."
        ]
      },
      "variants": {
        "generic": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
        "compact": "Tell me the differences between hashicorp vault and openbao Steps: Explain the differences between Vault and OpenBao Constraints: provide me as much detail as possible; be as specific as possible Tone: brutally honest",
        "openai": "Task:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest",
        "claude": "You are a careful assistant.\nRequest:\nTell me the differences between hashicorp vault and openbao\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n\nConstraints:\n- provide me as much detail as possible\n- be as specific as possible\n\nTone:\nbrutally honest"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:31:50.870Z"
  }
}
```

---

### Analyze Complex Vault vs OpenBao Prompt

`POST /workspace/analyze`

- HTTP Status: `200`
- Result: `PASS`

#### Assertions

- PASS: Complex prompt goal keeps main Vault teaching intent
- PASS: Complex prompt preserves role context
- PASS: Complex prompt output format is bullet_list
- PASS: Complex prompt tone is normalized
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
        "Explain the differences between Vault and OpenBao",
        "vault is stronger",
        "Provide key points"
      ],
      "output_format": "bullet_list",
      "tone": "brutally honest",
      "language": "en"
    },
    "variants": {
      "generic": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n2. vault is stronger\n3. Provide key points\n\nOutput format:\nbullet_list\n\nTone:\nbrutally honest\n\nAudience:\ndevelopers",
      "compact": "Teach me everything you know about hashicorp vault Steps: Explain the differences between Vault and OpenBao; vault is stronger; Provide key points Output: bullet_list Tone: brutally honest Audience: developers Context: You are a senior engineer",
      "openai": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n2. vault is stronger\n3. Provide key points\n\nOutput format:\nbullet_list\n\nTone:\nbrutally honest\n\nAudience:\ndevelopers",
      "claude": "You are a careful assistant.\nContext:\nYou are a senior engineer\n\nRequest:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n2. vault is stronger\n3. Provide key points\n\nDesired output:\nbullet_list\n\nTone:\nbrutally honest\n\nAudience:\ndevelopers"
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
          "why vault is stronger",
          "favor vault over openbao",
          "Tell me the differences between hashicorp vault and openbao",
          "vault is stronger"
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
        "original_prompt": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n2. vault is stronger\n3. Provide key points\n\nOutput format:\nbullet_list\n\nTone:\nbrutally honest\n\nAudience:\ndevelopers",
        "optimized_prompt": "Teach me everything you know about hashicorp vault Steps: Explain the differences between Vault and OpenBao; vault is stronger; Provide key points Output: bullet_list Tone: brutally honest Audience: developers Context: You are a senior engineer",
        "token_comparison": {
          "original_tokens": 68,
          "optimized_tokens": 61,
          "saved_tokens": 7,
          "saved_percent": 10
        },
        "semantic_drift_risk": "low",
        "missing_signals": [],
        "recommendations": [
          "Use the compact variant to save 7 tokens (10%).",
          "Compact optimization appears safe for normal use."
        ]
      },
      "variants": {
        "generic": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n2. vault is stronger\n3. Provide key points\n\nOutput format:\nbullet_list\n\nTone:\nbrutally honest\n\nAudience:\ndevelopers",
        "compact": "Teach me everything you know about hashicorp vault Steps: Explain the differences between Vault and OpenBao; vault is stronger; Provide key points Output: bullet_list Tone: brutally honest Audience: developers Context: You are a senior engineer",
        "openai": "Context:\nYou are a senior engineer\n\nTask:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n2. vault is stronger\n3. Provide key points\n\nOutput format:\nbullet_list\n\nTone:\nbrutally honest\n\nAudience:\ndevelopers",
        "claude": "You are a careful assistant.\nContext:\nYou are a senior engineer\n\nRequest:\nTeach me everything you know about hashicorp vault\n\nSteps:\n1. Explain the differences between Vault and OpenBao\n2. vault is stronger\n3. Provide key points\n\nDesired output:\nbullet_list\n\nTone:\nbrutally honest\n\nAudience:\ndevelopers"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:31:50.970Z"
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
      "run_id": "run_20260318_123202_52d9c1",
      "created_at": "2026-03-18T12:32:02.489Z",
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
        "latency_ms": 11402
      },
      "input": {
        "rendered_prompt": "Task:\nExplain Vault PKI\n\nSteps:\n1. Explain the topic clearly\n\nTone:\nneutral"
      },
      "output": {
        "text": "Vault PKI is a cloud-based public key infrastructure (PKI) solution provided by HashiCorp, a leading provider of cloud infrastructure automation tools. In this explanation, we'll dive into the core features and benefits of Vault PKI.\n\n**What is Public Key Infrastructure (PKI)?**\n\nA PKI is a system that enables secure online transactions by issuing, managing, and revoking digital certificates. These certificates are used to verify the identity of individuals, organizations, or devices over the internet. In essence, a PKI acts as a trusted third party, ensuring the authenticity and integrity of online interactions.\n\n**What is Vault PKI?**\n\nVault PKI is a cloud-based PKI solution that enables you to issue, manage, and revoke digital certificates for your organization's users, devices, or applications. It provides a centralized platform for certificate management, allowing you to automate and streamline your certificate issuance processes.\n\nKey Features of Vault PKI:\n\n1. **Certificate Issuance**: Vault PKI allows you to create and distribute digital certificates to users, devices, or applications.\n2. **Certificate Management**: The solution enables you to manage the lifecycle of your digital certificates, including revocation, renewal, and reissue.\n3. **Automated Certificate Issuance**: Vault PKI provides automated certificate issuance capabilities, reducing manual errors and improving overall security.\n4. **Integrations**: The solution integrates with popular identity and access management (IAM) tools, such as Active Directory, Azure AD, and Okta.\n5. **Auditing and Reporting**: Vault PKI includes auditing and reporting features to help you track certificate usage, revoke certificates that are no longer needed, and ensure compliance with regulatory requirements.\n\nBenefits of Using Vault PKI:\n\n1. **Simplified Certificate Management**: Vault PKI streamlines certificate management, reducing administrative burdens and improving overall security.\n2. **Improved Compliance**: The solution helps organizations meet compliance requirements by providing a centralized platform for certificate management and revocation.\n3. **Enhanced Security**: Vault PKI enables automated certificate issuance and revocation, reducing the risk of compromised certificates and minimizing the impact of security incidents.\n\nIn summary, Vault PKI is a cloud-based PKI solution that provides a robust, scalable, and secure way to issue, manage, and revoke digital certificates for your organization. By automating certificate management and improving compliance, Vault PKI helps organizations strengthen their overall security posture while reducing administrative burdens."
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
            "sentence_count": 25,
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
              "numbered": 8,
              "emphasis": 10
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
    "timestamp": "2026-03-18T12:32:02.490Z"
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
      "audience": "executives",
      "context": "",
      "constraints": [
        "use language that a CEO understands"
      ],
      "steps": [
        "vault is better",
        "Provide key points"
      ],
      "output_format": "bullet_list",
      "tone": "neutral",
      "language": "en"
    },
    "variants": {
      "generic": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. vault is better\n2. Provide key points\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nexecutives",
      "compact": "tell me everything you know about vault and openbao Steps: vault is better; Provide key points Constraints: use language that a CEO understands Output: bullet_list Tone: neutral Audience: executives",
      "openai": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. vault is better\n2. Provide key points\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nexecutives",
      "claude": "You are a careful assistant.\nRequest:\ntell me everything you know about vault and openbao\n\nSteps:\n1. vault is better\n2. Provide key points\n\nConstraints:\n- use language that a CEO understands\n\nDesired output:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nexecutives"
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
          "why vault is better",
          "vault is better"
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
      "score": 5,
      "semantic_drift_risk": "low"
    },
    "optimization": {
      "source_prompt": {
        "fingerprint": "pw_fe0939bd",
        "intent": "tell me everything you know about vault and openbao",
        "audience": "executives",
        "output_format": "bullet_list"
      },
      "optimization": {
        "original_mode": "generic",
        "optimized_mode": "compact",
        "original_prompt": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. vault is better\n2. Provide key points\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nexecutives",
        "optimized_prompt": "tell me everything you know about vault and openbao Steps: vault is better; Provide key points Constraints: use language that a CEO understands Output: bullet_list Tone: neutral Audience: executives",
        "token_comparison": {
          "original_tokens": 56,
          "optimized_tokens": 50,
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
        "generic": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. vault is better\n2. Provide key points\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nexecutives",
        "compact": "tell me everything you know about vault and openbao Steps: vault is better; Provide key points Constraints: use language that a CEO understands Output: bullet_list Tone: neutral Audience: executives",
        "openai": "Task:\ntell me everything you know about vault and openbao\n\nSteps:\n1. vault is better\n2. Provide key points\n\nConstraints:\n- use language that a CEO understands\n\nOutput format:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nexecutives",
        "claude": "You are a careful assistant.\nRequest:\ntell me everything you know about vault and openbao\n\nSteps:\n1. vault is better\n2. Provide key points\n\nConstraints:\n- use language that a CEO understands\n\nDesired output:\nbullet_list\n\nTone:\nneutral\n\nAudience:\nexecutives"
      }
    },
    "execution": null
  },
  "meta": {
    "timestamp": "2026-03-18T12:32:02.589Z"
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
    "timestamp": "2026-03-18T12:32:02.689Z"
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
    "timestamp": "2026-03-18T12:32:02.771Z"
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
    "timestamp": "2026-03-18T12:32:02.842Z"
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
    "timestamp": "2026-03-18T12:32:02.914Z"
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
    "timestamp": "2026-03-18T12:32:03.061Z"
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
    "timestamp": "2026-03-18T12:32:03.136Z"
  }
}
```

---

## Summary

- Passed: **14**
- Failed: **0**

