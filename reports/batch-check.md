# PromptWash Batch Check Report

Generated: 2026-03-11T09:16:11.469Z
Target: examples

## Summary

- Total files: 7
- Successful: 4
- Failed: 3
- Total warnings: 2
- Total errors: 0

## Files

### examples/almost-ir.json

- Status: failed
- Error: JSON input is valid JSON, but not a valid PromptWash artifact or Prompt IR.
- Code: VALIDATION_ERROR

### examples/almost-promptwash.json

- Status: failed
- Error: Invalid PromptWash JSON artifact
- Code: VALIDATION_ERROR

### examples/bad.json

- Status: failed
- Error: JSON input is valid JSON, but not a valid PromptWash artifact or Prompt IR.
- Code: VALIDATION_ERROR

### examples/baseline.prompt

- Status: ok
- Source: batch_file
- Intent: Explain Vault PKI.
- Complexity score: 4
- Token estimate: 15
- Lint summary: 0 errors, 0 warnings

### examples/quick_example.md

- Status: ok
- Source: batch_file
- Intent: # Quick Example Raw prompt: hey can you explain vault pki and compare it with cyberark for banking executives Run: promptwash parse example.prompt.md Output: Context: Enterprise secrets management in regulated banking environments.
- Complexity score: 1
- Token estimate: 94
- Lint summary: 0 errors, 2 warnings
- Lint warnings:
  - [PW002] Missing explicit output format.
  - [PW007] No actionable steps detected.

### examples/vault-verbose.json

- Status: ok
- Source: promptwash_json
- Intent: Explain Vault PKI in detail.
- Complexity score: 4
- Token estimate: 17
- Lint summary: 0 errors, 0 warnings

### examples/vault.json

- Status: ok
- Source: promptwash_json
- Intent: Explain Vault PKI.
- Complexity score: 6
- Token estimate: 19
- Lint summary: 0 errors, 0 warnings

