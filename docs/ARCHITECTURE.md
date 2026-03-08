# PromptWash Architecture

PromptWash uses a modular pipeline architecture.

Prompts pass through several stages before producing final outputs.

---

## Core Pipeline


Raw Prompt
↓
Parse
↓
Prompt IR
↓
Analysis
↓
Optimization
↓
Render


---

## Prompt IR

Prompt IR is the internal representation of prompts.

It enables:

- linting
- mutation
- benchmarking
- rendering

---

## System Components

Core modules include:

- CLI command router
- pipeline engine
- Prompt IR processor
- constraint engine
- provider adapters
- Git repository integration

---

## Service Layers

Key service modules include:

- Ollama prompt parser
- token estimation
- prompt diffing
- language detection
- constraint merging

---

## Repository Layer

Prompt repositories store:

- readable prompts
- optimized variants
- metadata
- reports

Git acts as the history and versioning system.