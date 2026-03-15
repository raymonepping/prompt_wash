# PromptWash Architecture

PromptWash is a local-first prompt engineering platform implemented as a modular Node.js CLI.

It provides structured prompt parsing, governance analysis, execution, evaluation, optimization, lineage tracking, intelligence analytics, and experiment management.

The system is organized into layered subsystems rather than a single pipeline.

PromptWash is designed to remain:

- local-first
- deterministic where possible
- reproducible
- provider-agnostic
- repository-aware

Cloud APIs are optional and not required for core functionality.

## High-Level Architecture

PromptWash consists of the following major layers:

```text
CLI Layer
  ↓
Command Handlers
  ↓
Domain Services
  ↓
Pipeline Engine
  ↓
Providers
  ↓
Storage (local .promptwash)
  ↓
Repository Integration
```

Each layer has a clear responsibility and limited coupling.

## Core Processing Pipeline

The prompt pipeline converts raw prompt input into a structured artifact.

```text
Raw Prompt
    ↓
Normalize
    ↓
Clean
    ↓
Analyze
    ↓
Lint
    ↓
Adapt
    ↓
Enrich (optional)
    ↓
Prompt IR
    ↓
PromptWash Artifact
```

This pipeline is implemented in:

```text
src/pipeline/
```

Pipeline modules include:

- `normalize.js`
- `clean.js`
- `analyze.js`
- `lint.js`
- `adapt.js`
- `enrich.js`
- `index.js`

The pipeline produces a structured PromptWash artifact used by the rest of the system.

## Prompt IR

Prompt IR is the internal structured representation of prompts.

It separates prompt semantics from prompt formatting.

Prompt IR contains fields such as:

- `goal`
- `audience`
- `context`
- `constraints`
- `steps`
- `output_format`
- `tone`
- `language`

Prompt IR enables:

- deterministic analysis
- prompt linting
- constraint validation
- prompt rendering
- prompt optimization
- experiment reproducibility

The schema is defined in:

```text
src/ir/schema.js
```

## CLI Layer

The CLI is the user-facing interface.

Entry point:

```text
bin/promptwash.js
```

Command routing:

```text
src/index.js
```

Command handlers live in:

```text
src/commands/
```

Examples include:

- `parse.js`
- `render.js`
- `check.js`
- `run.js`
- `evaluate.js`
- `optimize.js`
- `experiment.js`
- `intelligence.js`
- `repo.js`
- `lineage.js`

The CLI layer is intentionally thin and delegates work to service modules.

## Service Layer

The service layer implements the core domain functionality of PromptWash.

Services are grouped by domain.

```text
src/services/
```

### Execution

Handles prompt execution and run persistence.

```text
services/execution/
```

Components:

- execution engine
- provider interface
- run storage
- execution schema

### Evaluation

Deterministic evaluation of prompt outputs.

```text
services/evaluation/
```

Current evaluation dimensions include:

- clarity
- structure
- constraint adherence
- audience fit

Evaluation is deterministic and reproducible.

### Optimization

Prompt optimization and artifact generation.

```text
services/optimization/
```

Current capabilities:

- token reduction analysis
- prompt compression
- optimization artifact generation
- lineage attachment

### Governance

Prompt governance analysis.

```text
services/governance/
```

Includes:

- bias detection
- risk detection
- governance scoring
- configurable rule sets

Rules are stored in:

```text
.promptwash/bias-rules.json
.promptwash/risk-rules.json
```

### Lineage

Prompt evolution tracking.

```text
services/lineage/
```

Lineage stores prompt families and nodes representing iterations.

Each node records:

- fingerprint
- artifact path
- label
- notes
- timestamp

Lineage records are stored in:

```text
.promptwash/lineage/
```

### Intelligence

Repository-wide analytics and insights.

```text
services/intelligence/
```

Current intelligence modules analyze:

- runs
- models
- optimization artifacts
- lineage coverage
- repository prompt inventory

This layer aggregates data from:

- runs
- experiments
- lineage
- artifacts

### Experiments

Prompt experimentation framework.

```text
services/experiments/
```

Experiments allow:

- multi-variant prompt testing
- evaluation ranking
- latency comparison
- token efficiency analysis

Experiment artifacts are stored in:

```text
.promptwash/experiments/
```

### Repository Services

Repository integration utilities.

```text
services/repo/
```

Includes:

- repository scanning
- prompt discovery
- Git history integration
- prompt metadata indexing

## Providers

Providers implement execution backends.

```text
src/providers/
```

Currently supported:

- `ollama`

The provider interface is defined in:

```text
services/execution/provider_interface.js
```

Providers can be added for:

- OpenAI
- Anthropic
- other inference engines

PromptWash intentionally keeps provider adapters isolated.

## Local Storage

PromptWash stores runtime state locally.

```text
.promptwash/
```

Key directories:

```text
.promptwash/runs/
.promptwash/experiments/
.promptwash/lineage/
```

Key configuration files:

```text
.promptwash/project.json
.promptwash/constraints.json
.promptwash/bias-rules.json
.promptwash/risk-rules.json
```

These files enable:

- prompt discovery
- governance configuration
- lineage tracking
- experiment registry

## Repository Integration

PromptWash integrates with Git repositories.

Implemented through:

```text
src/services/repo/
src/repo/manager.js
```

Supported capabilities include:

- repository scanning
- prompt file discovery
- Git status inspection
- commit history inspection
- diff analysis
- controlled local publish commits

Git acts as the versioning system for prompts and artifacts.

## Utility Layer

Common helper functionality lives in:

```text
src/utils/
```

Examples include:

- token estimation
- fingerprint generation
- JSON handling
- report generation
- comparison utilities
- run reports
- experiment reports

This layer prevents duplication across services.

## Configuration System

PromptWash supports layered configuration.

Configuration resolution order:

1. built-in defaults
2. user config (`~/.promptwash.config.json`)
3. project config (`.promptwash.config.json`)
4. environment variables

Config loader:

```text
src/config/loader.js
```

Environment overrides include:

- `PROMPTWASH_OLLAMA_BASE_URL`
- `PROMPTWASH_OLLAMA_MODEL`
- `PROMPTWASH_OLLAMA_TIMEOUT_MS`

## Design Principles

PromptWash follows several architectural principles.

### Local First

All core functionality runs locally without cloud dependencies.

### Deterministic Where Possible

Prompt analysis and evaluation avoid LLM judgment when possible.

### Artifact Driven

PromptWash produces artifacts that can be versioned, compared, and analyzed.

### Reproducibility

Experiments, runs, and evaluations are reproducible.

### Modular Services

Subsystems are isolated into service modules.

### Provider Abstraction

Execution backends are pluggable through provider adapters.

## Future Architecture

Upcoming architecture phases include:

- Prompt CI pipelines
- Prompt scoring models
- remote provider execution
- prompt mutation strategies
- UI and visualization layer

The UI layer will consume the same services used by the CLI.
