# PromptWash State Layout

PromptWash stores project-specific runtime state inside a hidden directory:

```text
.promptwash/
```

This directory contains execution artifacts, lineage records, experiment results, and project-level configuration files.

The directory is local-first and intended to remain under version control when appropriate.

## Directory Structure

A typical `.promptwash` directory looks like this:

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

Each component has a specific role in PromptWash operations.

## `runs/`

Stores execution artifacts created by the `run` command.

Location:

```text
.promptwash/runs/
```

Example:

```text
.promptwash/runs/
├── run_20260313_192439_eec011.json
├── run_20260313_194358_f74e9f.json
├── run_20260314_143419_c34db7.json
```

Each run file contains:

- run identifier
- provider
- model
- rendered prompt
- execution latency
- prompt fingerprint
- response output
- evaluation scores
- metadata

Runs allow PromptWash to:

- inspect execution history
- compare runs
- generate intelligence analytics
- evaluate prompt performance

Runs are referenced by commands such as:

```text
promptwash run
promptwash runs list
promptwash runs view
promptwash evaluate
promptwash compare-runs
```

## `experiments/`

Stores experiment artifacts created by the experiment engine.

Location:

```text
.promptwash/experiments/
```

Example:

```text
.promptwash/experiments/
└── exp_20260314_145050_60583b.json
```

Experiment artifacts contain:

- experiment identifier
- prompt source
- variant matrix
- execution runs
- evaluation scores
- latency metrics
- rankings
- recommendations
- winner variant

Experiments allow PromptWash to evaluate prompt variants in a structured way.

Commands interacting with experiments:

```text
promptwash experiment
promptwash experiments list
promptwash experiments view
```

## `lineage/`

Stores prompt lineage families.

Location:

```text
.promptwash/lineage/
```

Example:

```text
.promptwash/lineage/
└── vault-pki.json
```

Each lineage file describes a prompt family tree.

Nodes typically contain:

- node id
- prompt fingerprint
- artifact path
- label
- notes
- timestamp
- parent node reference

Lineage enables PromptWash to track prompt evolution over time.

Commands interacting with lineage:

```text
promptwash lineage init
promptwash lineage iterate
promptwash lineage view
promptwash lineage graph
```

## `constraints.json`

Defines reusable prompt constraints for the project.

Location:

```text
.promptwash/constraints.json
```

Example constraints may include:

- do not invent missing information
- preserve technical accuracy
- no em dashes
- avoid speculation

Constraints are applied during:

- prompt checking
- prompt optimization
- evaluation

Commands interacting with constraints:

```text
promptwash constraints init
promptwash constraints view
promptwash constraints validate
```

## `bias-rules.json`

Defines rules used by the bias detection subsystem.

Location:

```text
.promptwash/bias-rules.json
```

Bias rules describe patterns used to detect prompt framing bias.

Typical signals include:

- vendor advocacy
- forced recommendations
- outcome steering
- unbalanced comparisons

Commands interacting with bias rules:

```text
promptwash bias
promptwash bias-rules init
promptwash bias-rules view
promptwash bias-rules validate
```

## `risk-rules.json`

Defines rules used by prompt risk detection.

Location:

```text
.promptwash/risk-rules.json
```

Risk analysis looks for patterns such as:

- prompt injection signals
- manipulative phrasing
- ambiguity
- unsafe instructions

Commands interacting with risk rules:

```text
promptwash risk
promptwash risk-rules init
promptwash risk-rules view
promptwash risk-rules validate
```

## `project.json`

Defines project-level metadata and repository scanning configuration.

Location:

```text
.promptwash/project.json
```

Example responsibilities:

- prompt discovery paths
- artifact locations
- include patterns
- exclude patterns
- strict prompt discovery mode

Example conceptual structure:

```json
{
  "version": 1,
  "prompt_paths": ["examples", "design"],
  "artifact_paths": ["bundle"],
  "lineage_path": ".promptwash/lineage",
  "runs_path": ".promptwash/runs",
  "experiments_path": ".promptwash/experiments"
}
```

This file is used primarily by repository services and intelligence modules.

## Artifact Philosophy

PromptWash is built around an artifact-driven workflow.

Artifacts stored under `.promptwash/` are designed to be:

- reproducible
- inspectable
- diffable
- versionable

This allows prompt engineering to behave more like software development.

Artifacts support:

- prompt lineage
- execution history
- experiment tracking
- repository analytics

## Version Control Considerations

Projects may choose to commit `.promptwash/` partially or fully.

Common strategies include:

Commit everything:

```text
.promptwash/
```

Commit lineage and experiments but ignore runs:

```text
.promptwash/lineage/
.promptwash/experiments/
```

Ignore all runtime artifacts:

```text
.promptwash/
```

The best strategy depends on project needs.

## Future State Extensions

Future versions of PromptWash may add additional directories such as:

```text
.promptwash/cache/
.promptwash/metrics/
.promptwash/index/
```

These may support:

- prompt indexing
- faster intelligence queries
- caching provider responses
- dataset generation for prompt research
