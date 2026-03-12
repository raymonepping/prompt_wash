# PromptWash Architecture Blueprint v1

## Architecture Freeze

**Status:** Locked
**Applies from:** Phase 21 onward
**Scope:** PromptWash CLI, Engine, API, and UI architecture

---

# 1. Project Overview

PromptWash is a **local-first prompt engineering toolkit** designed to clean, analyze, optimize, benchmark, evaluate, and manage prompts for large language models.

The system prioritizes:

* local-first processing
* developer workflows
* reproducibility
* prompt quality
* prompt governance
* experiment-driven prompt optimization

PromptWash evolves through the following stages:

```
Phase 1–20  Core Prompt Engine
Phase 21–25 Developer Tooling
Phase 26–29 Optimization + Experimentation Platform
Phase 30    PromptWash UI
```

---

# 2. Product Identity

PromptWash is primarily a:

**Prompt Optimization Lab**

Secondary capabilities:

* prompt governance platform
* DevOps prompt tooling
* model evaluation framework

When design tradeoffs occur, the system should prioritize:

```
iteration
benchmarking
experiments
comparison
prompt improvement
```

over governance-heavy features.

---

# 3. High-Level Architecture

PromptWash follows a layered architecture.

```
Core Engine
   │
   ├── CLI Wrapper
   │
   ├── API Wrapper (Express)
   │
   └── UI Client
```

### Core Rule

All business logic must live in the **core engine**.

CLI, API, and UI layers must remain **thin orchestration layers**.

---

# 4. Layered System Design

## Layer 1 — Domain Core

Defines the fundamental PromptWash data models.

Examples:

* Prompt Artifact
* Prompt IR
* Benchmark Result
* Bias Analysis
* Lineage Record
* Experiment Record

These models must remain **framework independent**.

---

## Layer 2 — Services

Core system functionality.

Examples:

```
parse service
render service
check service
bias analysis service
benchmark service
comparison service
bundle service
experiment service
lineage service
mutation service
evaluation service
```

All major capabilities must be implemented here.

---

## Layer 3 — Adapters

Interfaces that expose the services.

Adapters include:

```
CLI adapter
API adapter
model provider adapters
storage adapters
report renderers
```

Adapters translate external inputs into service calls.

---

## Layer 4 — Presentation

User-facing output.

Examples:

```
terminal output
markdown reports
JSON reports
web UI dashboards
```

Presentation logic must never contain business logic.

---

# 5. Runtime Model

PromptWash runtime consists of three components:

```
PromptWash Engine
PromptWash CLI
PromptWash API
```

### CLI

Provides command-line tooling.

Responsibilities:

* argument parsing
* terminal formatting
* exit codes
* command routing

### API

Express-based service exposing PromptWash functionality.

Responsibilities:

* REST endpoints
* SSE streaming for long operations
* request validation
* response formatting

### UI

Browser-based interface.

Responsibilities:

* visualization
* dashboards
* prompt editing
* experiment management

---

# 6. Storage Architecture

PromptWash is **file-first**.

No database is required to run PromptWash.

Future database support may be added but must remain optional.

---

## Storage Layout

```
.promptwash/
  config/
  lineage/
  experiments/
  reports/
  cache/
  state/

prompts/
artifacts/
bundles/
reports/
```

---

## Stored Data Types

### Prompt Artifacts

```
artifacts/<prompt>.json
```

### Lineage Records

```
.promptwash/lineage/<family>.json
```

### Experiment Records

```
.promptwash/experiments/<experiment>.json
```

### Reports

```
reports/*.md
reports/*.json
```

### Bundles

```
bundle/<name>/
```

---

# 7. Prompt Lineage Model

Prompt lineage is maintained by PromptWash.

Git history alone is not sufficient.

Lineage metadata is stored in:

```
.promptwash/lineage/
```

Example record:

```json
{
  "family": "vault-pki",
  "root": "vault-pki",
  "nodes": [
    {
      "id": "vault-pki",
      "parent": null,
      "artifact": "artifacts/vault-pki.json"
    },
    {
      "id": "vault-pki.a",
      "parent": "vault-pki",
      "artifact": "artifacts/vault-pki.a.json"
    }
  ]
}
```

---

# 8. Model Provider Strategy

PromptWash prioritizes **local execution**.

Primary provider:

```
Ollama
```

Optional providers:

```
OpenAI
Anthropic
```

Provider adapters must implement a shared interface.

Example structure:

```
src/providers/
  ollama/
  openai/
  anthropic/
```

---

# 9. Experiment Persistence

Experiments are stored as structured JSON artifacts.

Example location:

```
.promptwash/experiments/
```

Experiment records must include:

* prompts tested
* models tested
* metrics
* timestamps
* results
* winner identification

---

# 10. Configuration Model

Canonical configuration format:

```
.promptwash.config.json
```

JSON is chosen because it is:

* easily validated
* easily parsed
* stable across CLI/API/UI

YAML support may be added later as a loader.

---

# 11. Artifact Philosophy

PromptWash artifacts must support both humans and machines.

Artifacts must therefore be:

```
human readable
machine readable
deterministic
stable
```

Examples include:

* JSON prompt artifacts
* Markdown reports
* structured manifests
* reproducible bundle directories

---

# 12. UI Backend Architecture

PromptWash UI communicates with the API.

Architecture:

```
PromptWash CLI
      │
PromptWash Engine
      │
PromptWash API (Express)
      │
PromptWash UI
```

REST endpoints handle most operations.

Server-Sent Events (SSE) are used for long-running tasks:

* benchmarking
* experiments
* mutation
* evolution
* batch runs

---

# 13. Planned UI Views

The UI will include the following core interfaces.

### Prompt Playground

Edit prompts and run analysis.

### Prompt Evolution Graph

Visualize prompt lineage.

### Experiment Studio

Run structured prompt experiments.

### Model Comparison Dashboard

Compare model outputs and performance.

### Governance Dashboard

Display bias signals and risk scores.

---

# 14. Plugin Philosophy

PromptWash does not initially support external plugins.

Instead the system defines internal extension points:

```
provider adapters
evaluation modules
mutation strategies
scoring systems
report renderers
```

A plugin system may be introduced after Phase 30.

---

# 15. Locked Roadmap

The following roadmap is now frozen.

```
Phase 21  Prompt Governance
Phase 22  Prompt Lineage
Phase 23  Git Integration
Phase 24  Prompt Execution
Phase 25  Prompt CI
Phase 26  Prompt Optimization Engine
Phase 27  Model Evaluation
Phase 28  Prompt Intelligence
Phase 29  Experiment Engine
Phase 30  PromptWash UI
```

---

# 16. Design Principles

PromptWash must always follow these principles.

```
local-first
CLI-first
reproducible
Git-friendly
developer-centric
extensible
transparent
```

---

# 17. Freeze Statement

This architecture is considered **stable and frozen** for the development phases that follow.

Changes to this architecture must be made through a formal design update.

---

## PromptWash Architecture Blueprint v1

**Status:** Frozen
**Effective Phase:** 21+