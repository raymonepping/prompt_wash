# System Overview

PromptWash is a local-first layered system. A user enters through the CLI, command handlers translate that request into application work, services and pipeline modules perform the logic, providers handle model execution, and artifacts plus runtime state are persisted under `.promptwash/`.

## Visual Flow

```text
CLI
 ↓
Command Layer
 ↓
Service Layer
 ↓
Pipeline
 ↓
Providers
 ↓
.promptwash state
```

Not every command touches every layer, but this is the main architectural path through the system.

## Layer Breakdown

### CLI

The CLI is the user-facing entrypoint.

Primary entrypoints:

```text
bin/promptwash.js
src/index.js
```

Current top-level commands are registered in `src/index.js`, including:

- `parse`
- `render`
- `check`
- `batch-check`
- `bundle`
- `constraints`
- `config`
- `risk`
- `risk-rules`
- `bias`
- `bias-rules`
- `lineage`
- `repo`
- `run`
- `runs`
- `evaluate`
- `compare-runs`
- `optimize`
- `intelligence`
- `experiment`
- `experiments`

CLI responsibilities:

- accept command-line input
- expose help and version output
- register command handlers
- start the requested workflow

### Command Layer

The command layer maps CLI input to internal operations.

Primary location:

```text
src/commands/
```

Representative command modules:

- `parse.js`
- `render.js`
- `check.js`
- `bundle.js`
- `batch-check.js`
- `run.js`
- `runs.js`
- `evaluate.js`
- `compare-runs.js`
- `optimize.js`
- `risk.js`
- `bias.js`
- `lineage.js`
- `repo.js`
- `experiment.js`
- `experiments.js`

Command-layer responsibilities:

- parse arguments and flags
- resolve input from arguments, files, or stdin
- choose text vs JSON output
- call pipeline or service modules
- write reports or artifacts when requested

The command layer is intentionally thin. It should orchestrate, not own core business logic.

### Service Layer

The service layer contains domain-specific application logic that goes beyond the core prompt parsing pipeline.

Primary location:

```text
src/services/
```

Current service domains include:

- `execution/`: local prompt execution, provider abstraction, run storage, execution schema
- `evaluation/`: deterministic run scoring and run comparison
- `experiments/`: experiment execution, artifact schema, experiment persistence
- `governance/`: risk detection, bias detection, defaults, loaders, scoring
- `intelligence/`: aggregate stats across runs, models, lineage, and optimization
- `lineage/`: lineage storage, naming, and schema
- `optimization/`: optimization flow and optimized artifact generation
- `project/`: repository/project manifest handling
- `repo/`: repository scanning and history support

Service-layer responsibilities:

- execute higher-level workflows
- combine data from multiple subsystems
- persist structured artifacts
- keep command handlers simple

### Pipeline

The pipeline converts raw prompt input into a structured prompt artifact.

Primary location:

```text
src/pipeline/
```

Core stages:

```text
normalize
  ↓
clean
  ↓
analyze
  ↓
lint
  ↓
adapt
  ↓
enrich (optional)
```

Key modules:

- `normalize.js`
- `clean.js`
- `analyze.js`
- `lint.js`
- `adapt.js`
- `enrich.js`
- `index.js`

Pipeline responsibilities:

- normalize raw prompt text
- clean low-value filler and whitespace
- infer goal, audience, context, constraints, steps, output format, tone, and language
- lint for prompt quality issues
- adapt prompt artifacts into render variants
- optionally enrich deterministic output through Ollama

Pipeline outputs:

- Prompt IR
- PromptWash artifact
- rendered prompt variants
- lint and benchmark inputs for downstream commands

### Providers

Providers isolate execution backends from the rest of the application.

Primary locations:

```text
src/providers/
src/ollama/
```

Current provider-related modules include:

- `src/providers/ollama.js`
- `src/ollama/client.js`
- `src/services/execution/provider_interface.js`

Provider responsibilities:

- talk to the execution backend
- encapsulate provider-specific request/response behavior
- support local execution and health checks
- keep execution logic separate from command and pipeline logic

Current provider focus:

- Ollama

### `.promptwash` State

PromptWash stores local runtime and project state under `.promptwash/`.

Typical contents include:

```text
.promptwash/
├── runs/
├── experiments/
├── lineage/
├── constraints.json
├── bias-rules.json
├── risk-rules.json
└── project.json
```

This state supports:

- saved execution runs
- saved experiment artifacts
- lineage families and nodes
- governance rules
- reusable prompt/project metadata

## End-to-End Examples

### Parse / Check Flow

```text
CLI
 ↓
parse or check command
 ↓
input resolution
 ↓
pipeline
 ↓
Prompt IR / PromptWash artifact
 ↓
terminal output or report file
```

### Run / Experiment Flow

```text
CLI
 ↓
run or experiment command
 ↓
artifact resolution
 ↓
pipeline and/or services
 ↓
provider execution
 ↓
.promptwash/runs or .promptwash/experiments
 ↓
evaluation / comparison / intelligence
```

## Supporting Modules

Several shared modules support all layers:

- `src/utils/`: input, JSON parsing, reporting, comparison, display, token estimates, fingerprints, error handling
- `src/config/loader.js`: layered config resolution
- `src/constraints/loader.js`: reusable constraints loading and validation
- `src/ir/schema.js`: Prompt IR and PromptWash object schema helpers
- `src/repo/manager.js`: Git-oriented repository operations
- `src/benchmark/providers.js`: benchmark-style token and cost summaries

## Design Intent

This layered structure keeps PromptWash:

- local-first
- modular
- reproducible
- deterministic where possible
- extensible without tightly coupling commands, providers, storage, and pipeline logic
