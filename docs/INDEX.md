# PromptWash Documentation

This directory contains the official documentation for PromptWash.

PromptWash is a local-first prompt engineering platform that provides parsing, governance, lineage tracking, execution, evaluation, optimization, experimentation, and repository intelligence for prompts.

## Project Overview

These documents explain the goals, scope, and philosophy behind PromptWash.

- [`README.md`](README.md): Project overview, installation, and quick start.
- [`SCOPE.md`](SCOPE.md): Defines the intended boundaries of the project.
- [`REQUIREMENTS.md`](REQUIREMENTS.md): Functional and technical requirements.
- [`PHILOSOPHY.md`](PHILOSOPHY.md): Design principles such as local-first, reproducibility, and deterministic evaluation.

## Architecture

These documents describe the internal system design.

- [`ARCHITECTURE.md`](ARCHITECTURE.md): System architecture, service layers, execution model, and storage model.
- [`ARCHITECTURE_FREEZE.md`](ARCHITECTURE_FREEZE.md): Architectural snapshot used for stability checkpoints.
- [`PROMPT_IR.md`](PROMPT_IR.md): Specification of the Prompt IR (Intermediate Representation).
- [`SYSTEM_OVERVIEW.md`](SYSTEM_OVERVIEW.md): Visual overview of the main PromptWash system layers.

## CLI Usage

These documents explain how to use PromptWash.

- [`CLI.md`](CLI.md): Full CLI command reference.
- [`CONSTRAINTS.md`](CONSTRAINTS.md): Constraint system and constraint configuration.

## Governance

PromptWash includes governance capabilities for detecting risk and bias in prompts.

- Risk detection rules
- Bias detection rules
- Governance scoring
- Prompt safety signals

Governance rules live in:

```text
.promptwash/risk-rules.json
.promptwash/bias-rules.json
```

## Development

These documents describe how PromptWash is developed and maintained.

- [`CONTRIBUTING.md`](CONTRIBUTING.md): Contribution guidelines.
- [`ROADMAP.md`](ROADMAP.md): Development roadmap and architectural phases.
- [`CHANGELOG.md`](CHANGELOG.md): Project change history.

## Disclosure

- [`DISCLOSURE.md`](DISCLOSURE.md): Security, governance, and transparency disclosures.

## Repository Structure

The repository is organized into several key directories.

```text
src/            implementation
bin/            CLI entrypoint
docs/           documentation
examples/       example prompts and artifacts
design/         design prompts and reference material
bundle/         generated bundles
scripts/        helper scripts
.promptwash/    local runtime state
```

## Recommended Reading Order

For new contributors:

1. `README.md`
2. `PHILOSOPHY.md`
3. `ARCHITECTURE.md`
4. `PROMPT_IR.md`
5. `CLI.md`

For contributors modifying the system:

1. `ARCHITECTURE.md`
2. `ROADMAP.md`
3. `CLI.md`
