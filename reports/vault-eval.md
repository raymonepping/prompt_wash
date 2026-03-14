# PromptWash Evaluation Report

Run ID: run_20260313_194358_f74e9f
Generated: 2026-03-13T21:25:14.733Z

## Summary

- Provider: ollama
- Model: llama3:latest
- Intent: Explain Vault PKI.
- Audience: executives
- Overall score: 92
- Overall level: excellent

## Dimension Scores

### clarity

- Score: 100
- Notes:
(none)

### structure

- Score: 100
- Notes:
(none)

### constraint_adherence

- Score: 68
- Notes:
- Jargon-sensitive terms detected despite the prompt requesting simpler language: public key infrastructure, revocation, ca, pki.

### audience_fit

- Score: 100
- Notes:
(none)

## Recommendations

- Tighten output against explicit prompt constraints.

## Response

```text
**What is Vault PKI?**
======================================================

As an executive, you may be familiar with the importance of security and authentication in your organization. One crucial aspect of this is Public Key Infrastructure (PKI). Vault PKI is a comprehensive solution that enables organizations to manage their digital identities and encryption keys securely.

**How does it work?**
--------------------

Think of Vault PKI as a safe deposit box for your sensitive information. When you store your private key, certificate, or other sensitive data in Vault, you can ensure its integrity, confidentiality, and authenticity. Here's how:

### **Key Generation**

When an employee needs a digital identity (e.g., login credentials), Vault generates a unique public-private key pair. This ensures that only the authorized person can access their account.

### **Certificate Management**

Vault manages the issuance, revocation, and renewal of digital certificates, ensuring that they remain valid and secure. This includes monitoring certificate lifetimes, revoking expired or compromised certificates, and automating renewal processes.

### **Key Storage and Rotation**

Vault securely stores and rotates encryption keys to prevent unauthorized access. This includes implementing key rotation policies, auditing, and reporting to ensure compliance with regulations.

**Benefits**
------------

By leveraging Vault PKI, your organization can:

* **Enhance Security**: Protect sensitive data and identity information from unauthorized access or breaches.
* **Simplify Management**: Automate certificate management, key generation, and rotation processes, reducing administrative burdens.
* **Ensure Compliance**: Meet regulatory requirements for digital identity management, such as GDPR, HIPAA, and PCI-DSS.

**In Summary**
================

Vault PKI is a robust solution that streamlines the process of managing digital identities, certificates, and encryption keys. By securely storing and rotating sensitive data, your organization can maintain confidentiality, integrity, and authenticity, ultimately reducing the risk of cyber attacks and ensuring compliance with regulatory requirements.
```

