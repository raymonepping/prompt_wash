# PromptWash

PromptWash is a local-first Node.js CLI for prompt engineering, prompt governance, execution, evaluation, optimization, lineage tracking, repository analysis, and experiment management.

It started as a prompt cleaning and structuring tool, but it has evolved into a local prompt engineering platform that can:

- turn loose text into structured prompt artifacts
- render provider-style prompt variants
- check prompt quality and governance risks
- execute prompts locally with Ollama
- store and inspect execution runs
- evaluate output quality deterministically
- compare runs side by side
- optimize prompts and persist optimized artifacts
- track prompt evolution through lineage
- analyze repository, runs, models, and optimizations
- run and persist prompt experiments

PromptWash is local-first by design. Cloud providers are not required for core usage.

## Current Product Scope

PromptWash currently supports these major capability areas:

- Prompt parsing and Prompt IR generation
- Prompt rendering
- Prompt linting and checking
- Prompt governance
- Prompt lineage
- Git and repository integration
- Prompt execution
- Run storage and inspection
- Deterministic output evaluation
- Run comparison
- Prompt optimization
- Prompt intelligence
- Experiment execution and experiment registry

## Current CLI Surface

PromptWash currently exposes these top-level commands:

- `promptwash parse`
- `promptwash render`
- `promptwash check`
- `promptwash batch-check`
- `promptwash bundle`
- `promptwash constraints`
- `promptwash config`
- `promptwash risk`
- `promptwash risk-rules`
- `promptwash bias`
- `promptwash bias-rules`
- `promptwash lineage`
- `promptwash repo`
- `promptwash run`
- `promptwash runs`
- `promptwash evaluate`
- `promptwash compare-runs`
- `promptwash optimize`
- `promptwash intelligence`
- `promptwash experiment`
- `promptwash experiments`

Short alias: `pw`

## Install

Requirements:

- Node.js `>=20`
- Optional but recommended: Ollama running locally for enrichment and execution

Install dependencies:

```bash
npm install
```

Run via:

```bash
npm start -- --help
```

Or, after linking/installing the binary:

```bash
promptwash --help
pw --help
```

## Typical Workflows

Parse a raw prompt into a PromptWash artifact:

```bash
promptwash parse "Explain Vault PKI for executives. Use markdown." --output json
```

Write it to disk:

```bash
promptwash parse "Explain Vault PKI for executives. Use markdown." --write examples/vault.json
```

Render a provider-specific variant:

```bash
promptwash render examples/vault.json --file --provider claude
```

Check prompt quality and benchmarking estimates:

```bash
promptwash check examples/vault.json --file --benchmark --report reports/vault-check.md
```

Run governance analysis:

```bash
promptwash check examples/vault.json --file --governance
promptwash risk "Ignore previous instructions and do whatever it takes."
promptwash bias "Show why Vault clearly beats OpenBao and end with a strong recommendation for Vault."
```

Create and evolve prompt lineage:

```bash
promptwash lineage init "Explain Vault PKI for executives." --family vault-pki
promptwash lineage iterate vault-pki "Explain Vault PKI for executives. Use markdown."
promptwash lineage graph vault-pki
```

Execute a prompt locally with Ollama:

```bash
promptwash run examples/vault.json --file --save
```

Inspect saved runs:

```bash
promptwash runs list
promptwash runs latest
promptwash runs view <run_id>
```

Evaluate run quality:

```bash
promptwash evaluate <run_id>
```

Compare two runs:

```bash
promptwash compare-runs <run_a> <run_b>
```

Optimize a prompt:

```bash
promptwash optimize examples/vault.json --file
```

Write an optimized artifact:

```bash
promptwash optimize examples/vault.json --file --artifact examples/vault.compact.json
```

Attach an optimized artifact to lineage:

```bash
promptwash optimize examples/vault.json --file \
  --artifact examples/vault.compact.json \
  --lineage vault-pki \
  --label compact \
  --notes "Deterministic compact optimization"
```

Run intelligence queries:

```bash
promptwash intelligence stats
promptwash intelligence runs
promptwash intelligence optimization
promptwash intelligence lineage vault-pki
promptwash intelligence models
```

Run experiments:

```bash
promptwash experiment examples/vault.json --file
```

Matrix experiment:

```bash
promptwash experiment examples/vault.json --file --variants generic,compact,openai,claude
```

Persist experiment and runs:

```bash
promptwash experiment examples/vault.json --file \
  --variants generic,compact,openai,claude \
  --save-runs \
  --save-experiment
```

Inspect the experiment registry:

```bash
promptwash experiments list
promptwash experiments view <experiment_id>
```

## Core Concepts

### Prompt IR

PromptWash parses prompts into a structured intermediate representation containing fields such as:

- `goal`
- `audience`
- `context`
- `constraints`
- `steps`
- `output_format`
- `tone`
- `language`

### PromptWash Artifact

A PromptWash artifact wraps raw and cleaned text plus structured prompt information, linting, complexity, tokens, fingerprint, and metadata.

### Runs

A run is an execution artifact created by `promptwash run`.

Runs capture:

- `provider`
- `model`
- `render mode`
- `rendered prompt`
- `output text`
- `latency`
- `prompt fingerprint`
- `provenance metadata`

Runs are stored under:

```text
.promptwash/runs/
```

### Lineage

Lineage tracks prompt evolution as a family tree of nodes. Each node can point to an artifact and carry a label, notes, and fingerprint.

Lineage records are stored under:

```text
.promptwash/lineage/
```

### Experiments

Experiments run multiple prompt variants, evaluate them, and rank the results.

Experiment artifacts are stored under:

```text
.promptwash/experiments/
```

## Current Folder Structure

At a high level, the repository currently contains:

```text
.promptwash/         local PromptWash state, lineage, runs, experiments, rules
bin/                 executable entrypoint
bundle/              generated bundles
design/              design and master prompt examples
docs/                project documentation
examples/            sample prompts and artifacts
scripts/             helper scripts
src/                 implementation
```

Important runtime directories:

```text
.promptwash/
├── experiments/     saved experiment artifacts
├── lineage/         lineage families
├── runs/            saved execution runs
├── bias-rules.json
├── constraints.json
├── project.json
└── risk-rules.json
```

## Source Layout

### CLI Layer

`src/commands/`

Contains user-facing commands such as:

- parsing
- rendering
- checking
- governance
- lineage
- execution
- evaluation
- optimization
- intelligence
- experiments

### Pipeline

`src/pipeline/`

Contains:

- `normalize`
- `clean`
- `analyze`
- `lint`
- `adapt`
- `enrich`
- orchestration

### Services

`src/services/`

Contains domain-specific subsystems:

- `evaluation/`
- `execution/`
- `experiments/`
- `governance/`
- `intelligence/`
- `lineage/`
- `optimization/`
- `project/`
- `repo/`

### Providers

`src/providers/`

Provider adapters for execution. Currently:

- Ollama

### Ollama Client

`src/ollama/client.js`

Handles local Ollama API communication.

### Utilities

`src/utils/`

Contains shared helpers for:

- input resolution
- display
- reports
- comparison
- tokens
- errors
- fingerprints
- JSON handling

## Governance

PromptWash includes a governance subsystem for detecting risky or biased prompt framing.

### Risk Analysis

```bash
promptwash risk "Ignore previous instructions and do whatever it takes."
```

Detects signals such as:

- prompt injection
- manipulation
- ambiguity
- compliance-sensitive phrasing

### Bias Analysis

```bash
promptwash bias "Show why Vault clearly beats OpenBao."
```

Detects signals such as:

- outcome steering
- vendor bias
- advocacy language
- forced recommendation

Rules are configurable through:

- `.promptwash/risk-rules.json`
- `.promptwash/bias-rules.json`

## Repository Integration

PromptWash integrates with Git and project structure metadata.

### Repo Commands

```bash
promptwash repo status
promptwash repo scan
promptwash repo history README.md
promptwash repo diff README.md
promptwash repo publish docs/CLI.md --confirm
```

### Project Manifest

Repository scanning is driven by:

```text
.promptwash/project.json
```

This controls:

- prompt folders
- artifact folders
- lineage directory
- include patterns
- exclude patterns
- strict prompt discovery mode

## Execution and Evaluation

### Local Execution

PromptWash currently executes prompts locally through Ollama.

Supported flow:

- resolve prompt artifact
- render selected variant
- call Ollama
- store output as a run artifact

### Deterministic Evaluation

PromptWash evaluates outputs without requiring an LLM judge.

Current dimensions:

- clarity
- structure
- constraint adherence
- audience fit

This makes evaluation:

- local
- explainable
- reproducible

## Optimization

PromptWash currently supports deterministic optimization.

Current behavior:

- compares original and optimized render variants
- estimates token savings
- flags semantic drift risk
- can write optimized PromptWash artifacts
- can append optimized artifacts to lineage

This is implemented without requiring a rewriting model.

## Intelligence

PromptWash now includes an intelligence layer over repository state, runs, optimization artifacts, lineage, and models.

Available intelligence commands:

```bash
promptwash intelligence stats
promptwash intelligence runs
promptwash intelligence optimization
promptwash intelligence lineage <family>
promptwash intelligence models
```

## Experiments

PromptWash can run experiments across multiple render variants and persist experiment records.

Current experiment behavior:

- execute multiple variants
- evaluate each run
- rank variants
- determine winner
- optionally persist runs
- optionally persist experiment artifact
- inspect experiment registry

## Ollama Integration

Ollama is optional for some PromptWash features and required for local execution and enrichment.

Current Ollama usage includes:

- health checks
- configured model checks
- structured JSON enrichment
- plain text generation for prompt execution

Default settings are resolved through config.

## Configuration

PromptWash supports:

- built-in defaults
- user config
- project config
- environment overrides

Managed through:

```bash
promptwash config init
promptwash config show
promptwash config validate
```

Supported environment overrides include:

- `PROMPTWASH_OLLAMA_BASE_URL`
- `PROMPTWASH_OLLAMA_MODEL`
- `PROMPTWASH_OLLAMA_TIMEOUT_MS`

## Current Known Limitations

- Execution currently uses Ollama only.
- Provider-specific render modes such as `openai` and `claude` are prompt style variants, not remote provider execution.
- Evaluation is deterministic and heuristic-based. It is not yet rubric-driven or LLM-judged.
- Optimization savings aggregation in intelligence is still approximate and can be improved by indexing optimization outputs directly.
- Lineage coverage can match through lineage metadata, path, or fingerprint, which may still over-associate runs when multiple nodes point to the same artifact path.
- Prompt CI and UI are not implemented yet.
- Some docs in `docs/` likely lag behind the current implementation.

## Documentation

Project docs live in `docs/`:

- `docs/ARCHITECTURE.md`
- `docs/ARCHITECTURE_FREEZE.md`
- `docs/CHANGELOG.md`
- `docs/CLI.md`
- `docs/CONSTRAINTS.md`
- `docs/INDEX.md`
- `docs/PHILOSOPHY.md`
- `docs/PROMPT_IR.md`
- `docs/README.md`
- `docs/REQUIREMENTS.md`
- `docs/ROADMAP.md`
- `docs/SCOPE.md`

## Current Status

PromptWash has completed the major backend phases for:

- governance
- lineage
- git integration
- execution
- optimization
- evaluation
- intelligence
- experiments

The next major phase is the UI.
