# PromptWash Roadmap

PromptWash evolved from a simple prompt cleaning CLI into a full local-first prompt engineering platform.

The roadmap is organized into architectural phases that progressively expanded the system.

## Phase 1-5: Prompt Foundations (Completed)

Initial prompt engineering functionality.

Capabilities introduced:

- Prompt normalization and cleaning
- Prompt IR (Intermediate Representation)
- Prompt parsing
- Prompt rendering
- Prompt linting
- Token estimation
- Complexity scoring

Primary commands introduced:

```text
parse
render
check
```

Goal:

Transform raw prompt text into structured artifacts.

## Phase 6-8: Configuration and Constraints (Completed)

Added persistent configuration and reusable constraints.

Capabilities introduced:

- constraint system
- constraint validation
- config resolution
- environment overrides
- deterministic prompt rules

Commands introduced:

```text
constraints
config
```

Goal:

Allow projects to define reusable prompt policies.

## Phase 9-11: Repository Integration (Completed)

PromptWash began integrating with Git repositories.

Capabilities introduced:

- repository scanning
- prompt discovery
- git status integration
- git history inspection
- diff analysis
- controlled publish commits

Commands introduced:

```text
repo status
repo history
repo diff
repo publish
repo scan
```

Goal:

Make prompts first-class citizens inside repositories.

## Phase 12-15: Prompt Governance (Completed)

Governance analysis was added to detect prompt risk and bias.

Capabilities introduced:

- prompt risk detection
- bias analysis
- configurable rule sets
- governance scoring
- injection detection signals

Commands introduced:

```text
risk
risk-rules
bias
bias-rules
```

Goal:

Detect problematic prompt framing before execution.

## Phase 16-18: Prompt Lineage (Completed)

Prompt evolution tracking was introduced.

Capabilities introduced:

- prompt family trees
- lineage nodes
- iteration tracking
- artifact linking
- fingerprint tracking

Commands introduced:

```text
lineage init
lineage iterate
lineage list
lineage view
lineage graph
```

Goal:

Track prompt evolution over time.

## Phase 19-21: Prompt Execution (Completed)

Prompt execution capabilities were introduced.

Capabilities introduced:

- provider abstraction
- execution engine
- run artifacts
- execution reports
- lineage-linked runs

Commands introduced:

```text
run
runs
```

Execution currently supports:

- Ollama

Goal:

Allow prompt artifacts to be executed locally.

## Phase 22-23: Evaluation and Run Comparison (Completed)

Deterministic evaluation and comparison were added.

Capabilities introduced:

- output quality evaluation
- evaluation dimensions
- run comparison
- execution analytics

Commands introduced:

```text
evaluate
compare-runs
```

Evaluation dimensions currently include:

- clarity
- structure
- constraint adherence
- audience fit

Goal:

Evaluate prompt effectiveness reproducibly.

## Phase 24-26: Prompt Optimization (Completed)

Prompt optimization capabilities were added.

Capabilities introduced:

- token reduction analysis
- deterministic prompt compression
- optimization artifact generation
- lineage integration

Commands introduced:

```text
optimize
```

Goal:

Improve prompt efficiency without semantic drift.

## Phase 27-28: Prompt Intelligence (Completed)

Repository-wide analytics and insights were introduced.

Capabilities introduced:

- run intelligence
- model intelligence
- lineage coverage analysis
- optimization tracking
- prompt inventory statistics

Commands introduced:

```text
intelligence stats
intelligence runs
intelligence optimization
intelligence lineage
intelligence models
```

Goal:

Provide visibility into prompt usage and performance.

## Phase 29: Experiment Engine (Completed)

Prompt experimentation framework introduced.

Capabilities introduced:

- variant experiments
- experiment matrices
- evaluation ranking
- latency comparison
- token efficiency analysis
- experiment registry
- experiment inspection

Commands introduced:

```text
experiment
experiments
```

Experiment artifacts stored in:

```text
.promptwash/experiments/
```

Goal:

Enable structured prompt experimentation.

## Phase 30: PromptWash UI (Planned)

A local UI layer will provide visualization of PromptWash data.

Planned capabilities:

- prompt inventory explorer
- lineage visualization
- run explorer
- experiment dashboards
- model performance analytics
- optimization insights

The UI will consume the same services used by the CLI.

## Phase 31: Prompt CI (Planned)

Prompt CI will allow prompts to be validated automatically in pipelines.

Planned capabilities:

- CI linting
- governance enforcement
- evaluation gates
- experiment pipelines

Possible integrations:

- GitHub Actions
- GitLab CI
- local CI runners

## Phase 32: Multi-Provider Execution (Planned)

Execution providers beyond Ollama.

Potential providers:

- OpenAI
- Anthropic
- Azure OpenAI
- local inference engines

Goal:

True cross-provider benchmarking.

## Phase 33: Advanced Prompt Optimization (Planned)

More advanced prompt mutation strategies.

Planned capabilities:

- prompt mutation graphs
- optimization strategies
- semantic preservation scoring
- automatic variant generation

## Phase 34: Prompt Research Platform (Future)

Long-term vision for PromptWash.

Potential capabilities:

- prompt performance datasets
- prompt benchmarking suites
- prompt scoring models
- prompt version registries
- collaborative prompt engineering

## Current Status

PromptWash currently includes:

- prompt pipeline
- governance analysis
- lineage tracking
- repository integration
- execution engine
- evaluation framework
- optimization engine
- intelligence analytics
- experiment engine

The next major milestone is the UI layer (Phase 30).
