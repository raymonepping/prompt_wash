# PromptWash Requirements

This document defines the functional and technical requirements for PromptWash.

---

## Functional Requirements

PromptWash must:

- accept messy prompts as input
- convert prompts into structured Prompt IR
- generate provider-specific prompt formats
- lint prompts for structural issues
- estimate token usage
- estimate cost across providers
- detect semantic drift
- enforce persistent constraints
- track prompt history using Git

---

## CLI Requirements

The CLI must support the following commands:

- parse
- render
- check
- repo
- constraints

Each command may include subcommands or flags.

---

## Storage Requirements

Prompts must support storage in:

- Markdown format
- JSON format

Git repositories should serve as prompt registries.

---

## Technical Requirements

Required components:

- Node.js runtime
- Git
- Ollama

Optional integrations:

- OpenAI API
- Anthropic API

---

## Non-Functional Requirements

PromptWash must be:

- local-first
- reproducible
- extensible
- deterministic
- easy to use