# PromptWash

PromptWash is a local-first CLI for turning loose prompt text into a structured prompt artifact, checking prompt quality, rendering provider-specific variants, and managing prompt files inside Git.

The current implementation is heuristic-first. It uses deterministic parsing by default and can optionally ask a local Ollama model to enrich missing fields.

## What It Does

- Normalizes and cleans raw prompt text.
- Extracts a Prompt IR with `goal`, `context`, `audience`, `constraints`, `steps`, `output_format`, `tone`, and `language`.
- Generates a PromptWash JSON artifact with token estimate, fingerprint, lint warnings, and metadata.
- Renders `generic`, `compact`, `openai`, and `claude` prompt variants.
- Checks prompt quality, semantic drift risk, baseline diffs, and benchmark-style token/cost comparisons.
- Loads project and user config, plus reusable constraints files.
- Integrates with Git for status, diff, history, and safe local publish commits.

## Current CLI Surface

PromptWash exposes six top-level commands:

- `promptwash parse`
- `promptwash render`
- `promptwash check`
- `promptwash repo`
- `promptwash constraints`
- `promptwash config`

Short alias: `pw`

## Install

Requirements:

- Node.js `>=20`
- Optional: Ollama running locally for enrichment and health checks

```bash
npm install
```

Run via:

```bash
npm start -- --help
```

Or, after linking/installing the bin:

```bash
promptwash --help
pw --help
```

## Typical Workflow

Parse raw prompt text into a PromptWash artifact:

```bash
promptwash parse "Explain Vault PKI for banking executives in markdown" --output json
```

Write the artifact to disk:

```bash
promptwash parse --file prompt.md --write artifacts/promptwash.json
```

Render a provider-specific variant:

```bash
promptwash render --file artifacts/promptwash.json --provider openai
```

Run checks and write a report:

```bash
promptwash check --file prompt.md --benchmark --report reports/check.md
```

## Command Behavior

### `parse`

`parse` accepts prompt text from an argument, `--file`, or stdin. It runs the prompt pipeline and returns a PromptWash object.

It currently:

- normalizes line endings and whitespace
- removes a small set of filler words like `just`, `actually`, `maybe`, and `please`
- detects prompt document signals such as headings, bullets, and command-heavy content
- infers goal, audience, context, constraints, steps, output format, tone, and language
- estimates tokens with a simple `chars / 4` heuristic
- computes a complexity score
- generates a short SHA-256-based fingerprint
- validates the generated Prompt IR before returning it

Optional enrichment:

- `--enrich` asks the configured Ollama model for structured JSON enrichment
- enrichment is merged conservatively and only fills fields the deterministic parser considers weak or missing
- `--enrich-debug` shows accepted and rejected enrichment fields

### `render`

`render` accepts raw prompt text, Prompt IR JSON, or a full PromptWash JSON artifact.

It renders one of four variants:

- `generic`
- `compact`
- `openai`
- `claude`

The compact renderer compresses the prompt into a short single-paragraph form and reports approximate token savings versus the generic format.

### `check`

`check` resolves the input into a PromptWash object and reports quality and benchmarking information.

It currently supports:

- lint summary and warnings
- complexity score
- semantic drift risk
- token estimate
- optional baseline comparison with sentence-level added/removed output
- optional benchmark summary across rendered variants
- optional JSON or Markdown report output
- optional enrichment, including debug output

Current lint rules include:

- missing clear goal
- missing output format
- too many detected steps
- too many constraints
- prompt looks like documentation instead of a single prompt
- conflicting brevity vs. depth instructions
- no actionable steps
- executive audience paired with JSON output
- large prompt size

### `repo`

`repo` works only inside a Git working tree.

Implemented subcommands:

- `repo history` shows recent `git log`
- `repo diff` shows a ref-to-ref diff, defaulting to `HEAD~1..HEAD`
- `repo status` shows `git status --short`
- `repo publish` can preview, dry-run, or create a local commit for a selected file or directory

`repo publish` is intentionally conservative:

- it validates that the target path exists
- stages only the selected path
- creates only a local commit
- never pushes to a remote

Current limitation:

- `repo connect` is scaffold-only and does not manage remotes yet

### `constraints`

`constraints` manages `.promptwash/constraints.json`.

Implemented behavior:

- `constraints init` creates default structural and output constraints
- `constraints view` loads and prints the resolved constraint object
- `constraints validate` validates the constraints JSON shape

Default constraints currently include examples like:

- `do not invent missing information`
- `preserve technical accuracy`
- `no em dashes`

### `config`

`config` manages PromptWash configuration.

Implemented behavior:

- `config init` creates `.promptwash.config.json`
- `config show` prints merged config
- `config validate` validates config structure
- `config validate --check-ollama` also performs an Ollama health check

Config resolution order:

1. built-in defaults
2. user config at `~/.promptwash.config.json`
3. project config at `.promptwash.config.json`
4. environment overrides

Supported environment overrides:

- `PROMPTWASH_OLLAMA_BASE_URL`
- `PROMPTWASH_OLLAMA_MODEL`
- `PROMPTWASH_OLLAMA_TIMEOUT_MS`

## Input and Artifact Shapes

PromptWash can consume:

- raw prompt text
- a Prompt IR JSON object
- a full PromptWash JSON artifact

The generated Prompt IR includes:

```json
{
  "goal": "",
  "audience": "",
  "context": "",
  "constraints": [],
  "steps": [],
  "output_format": "",
  "tone": "",
  "language": "",
  "variants": {},
  "tokens": {},
  "metadata": {}
}
```

The full PromptWash object wraps that IR with raw/cleaned text, lint warnings, complexity score, fingerprint, token estimate, and metadata.

## Source Layout

The `src` folder is organized by responsibility:

- `src/index.js`: CLI bootstrap and command registration.
- `src/commands/`: user-facing CLI commands for parse, render, check, repo, constraints, and config.
- `src/pipeline/`: normalization, cleaning, analysis, linting, adaptation, enrichment, and orchestration.
- `src/utils/`: input handling, JSON detection, PromptWash artifact resolution, reporting, display, token estimates, fingerprints, and error helpers.
- `src/repo/manager.js`: Git integration for history, diff, status, staging, and local publish commits.
- `src/config/loader.js`: config defaults, file loading, deep merge, validation, and initialization.
- `src/constraints/loader.js`: constraint defaults, loading, validation, and initialization.
- `src/ollama/client.js`: Ollama health checks and JSON generation requests.
- `src/benchmark/providers.js`: rendered variant metrics, configured pricing, and provider health reporting.
- `src/ir/schema.js`: Prompt IR and PromptWash object factories plus IR validation.

## Ollama Integration

Ollama is optional.

When enabled, PromptWash:

- checks whether Ollama is reachable
- verifies whether the configured model is installed
- requests JSON-only enrichment output for missing or weak fields
- records enrichment health and merge metadata in the artifact

Default Ollama settings:

- base URL: `http://localhost:11434/api`
- model: `llama3.2`
- timeout: `30000ms`

## Benchmarking and Reports

Benchmark output is estimate-based, not provider-executed inference benchmarking.

Current benchmark behavior:

- renders all variants
- estimates token counts with `chars / 4`
- applies configured per-token pricing when present
- summarizes lowest-token, highest-token, and lowest-cost variants
- optionally includes Ollama health in provider status

`check --report` writes:

- `.json` reports as structured JSON
- `.md` or `.markdown` reports as Markdown

## Known Limitations

- Parsing is heuristic and rule-based; it is not semantic parsing in the strict sense.
- Language detection is minimal and effectively distinguishes only a narrow Dutch-vs-English signal.
- File-path auto-detection is basic; file input should be passed with `--file`.
- Benchmarking estimates prompt size and configured pricing only; it does not run prompts against providers.
- `repo connect` is not implemented beyond scaffold output.
- `constraints.md` has a reserved path constant but is not used yet.

## Documentation

Additional project docs live in [`docs/`](./docs):

- `docs/ARCHITECTURE.md`
- `docs/CLI.md`
- `docs/CONSTRAINTS.md`
- `docs/PROMPT_IR.md`
- `docs/ROADMAP.md`

Note: some docs may lag behind the current CLI implementation. The README now reflects the behavior present in `src/`.
