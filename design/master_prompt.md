You are an expert software architect and developer.

Design and implement a complete developer tool called PromptWash.

PromptWash is a local-first prompt engineering toolkit that cleans, analyzes, optimizes, validates, benchmarks, and manages prompts for large language models.

The system should primarily be implemented as a Node.js CLI application, with optional GitHub repository integration for storing and versioning prompts.

The design must prioritize:

- local-first processing
- minimal external dependencies
- developer usability
- reproducibility
- prompt quality and safety
- compatibility with OpenAI and Anthropic models
- optional GitHub integration for prompt storage and versioning

The system must run fully locally except when explicitly benchmarking models.

Use Ollama as the default local inference engine.

Avoid mandatory cloud dependencies. OpenAI and Anthropic APIs must be optional and only required for benchmarking or exact token counting.

--------------------------------------------------

CORE CONCEPT

PromptWash acts as a prompt hygiene and engineering pipeline.

Users input messy prompts and PromptWash produces:

- cleaned prompts
- structured prompt variants
- token analysis
- cost estimates
- lint warnings
- prompt complexity scoring
- semantic drift detection
- provider-specific prompt styles
- benchmarking results
- version tracking through Git

PromptWash should conceptually behave similar to developer tools such as:

eslint  
terraform fmt  
terraform validate  

but applied to prompt engineering.

--------------------------------------------------

CORE PRODUCT PRINCIPLE

PromptWash must expose only a small number of stable CLI commands while allowing functionality to expand through subcommands and modules.

Top-level CLI commands must remain limited and memorable.

Top-level command groups:

promptwash parse  
promptwash render  
promptwash check  
promptwash repo  
promptwash constraints  
promptwash config  

Principle:

Design the final shape early, implement the surface area gradually.

Prompt IR must serve as the internal contract between parsing, rendering, checking, benchmarking, constraints, and repository management.

--------------------------------------------------

CLI STATE MODEL

PromptWash must operate as a stateless CLI tool.

Commands must not depend on previously executed commands.

Each command must be capable of deriving the required internal state automatically.

Example:

promptwash render prompt.md

must internally perform:

parse → render

Similarly:

promptwash check prompt.md

must internally perform:

parse → check

Prompt IR should be generated internally and passed through the pipeline during execution.

Prompt IR should only be persisted if explicitly requested by the user.

Example:

promptwash parse prompt.md --export-ir

--------------------------------------------------

PROMPT IR (INTERMEDIATE REPRESENTATION)

Prompts must not be handled as raw text.

PromptWash must convert prompts into a structured Prompt IR.

Example Prompt IR:

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

Prompt IR enables:

- linting
- mutation
- benchmarking
- provider adaptation
- compression
- reproducibility

Pipeline concept:

raw prompt  
→ parse  
→ Prompt IR  
→ analyze  
→ optimize  
→ render provider prompts  

--------------------------------------------------

SYSTEM ARCHITECTURE

PromptWash must use a modular pipeline architecture.

Example pipeline:

input  
→ normalize  
→ clean  
→ lint  
→ analyze  
→ optimize  
→ adapt  
→ benchmark  
→ output  

--------------------------------------------------

INTERNAL PROMPT OBJECT

PromptWash must operate on a structured prompt object.

{
  "raw": "",
  "cleaned": "",
  "ir": {},
  "variants": {
    "compact": "",
    "openai": "",
    "claude": ""
  },
  "intent": "",
  "audience": "",
  "constraints": [],
  "tokens": {},
  "cost": {},
  "complexity_score": 0,
  "semantic_drift_risk": "",
  "lint_warnings": [],
  "fingerprint": "",
  "language": "",
  "metadata": {}
}

--------------------------------------------------

COMMAND TO FEATURE MAPPING

promptwash parse

Responsible for:

- prompt cleaning
- intent detection
- Prompt IR generation
- structural constraint awareness

promptwash render

Responsible for:

- provider-specific prompt rendering
- prompt style adapters
- compact prompt variants
- markdown/json output
- output constraint application

promptwash check

Responsible for:

- prompt linting
- prompt complexity scoring
- context pressure analysis
- prompt diff and intent verification
- benchmarking
- replay
- trace diagnostics

promptwash repo

Responsible for:

- Git repository connection
- publishing prompts
- prompt history
- prompt diff across versions

promptwash constraints

Responsible for:

- initializing constraint configuration
- viewing constraints
- validating constraints

promptwash config

Responsible for:

- initializing configuration
- showing resolved configuration
- validating configuration

--------------------------------------------------

PROMPT CLEANING

Accept messy prompts including shorthand, mixed language, vague wording, and conversational phrasing.

Use a local Ollama model to:

- detect intent
- preserve technical terms
- preserve version numbers
- preserve constraints
- remove filler
- convert prompts to structured format

Structured sections:

Context  
Task  
Constraints  
Output format

The system must avoid inventing missing information.

--------------------------------------------------

PROMPT DIFF AND INTENT VERIFICATION

Compare original prompt and cleaned prompt.

Detect:

- removed constraints
- lost entities
- changed meaning

Produce semantic drift score.

Example:

Intent preservation: 92%  
Risk: LOW

--------------------------------------------------

PROMPT COMPRESSION MODES

Support optimization modes:

clarity  
balanced  
minimal  

--------------------------------------------------

PROMPT LINTING

Detect structural issues such as:

- missing output format
- ambiguous instructions
- conflicting constraints
- multiple tasks

--------------------------------------------------

PROMPT COMPLEXITY SCORE

Score prompts based on:

- task count
- constraint density
- ambiguity
- structure quality

--------------------------------------------------

CONTEXT PRESSURE ANALYZER

Analyze token usage.

Example:

Context size: 4200 tokens  
Model limit: 128k  
Context pressure: LOW  

--------------------------------------------------

PROMPT STYLE ADAPTERS

Generate model-specific prompt styles.

Variants:

OpenAI optimized  
Claude optimized  
Generic  
Compact  

--------------------------------------------------

PROMPT FINGERPRINTING

Generate deterministic prompt identifiers.

Example:

pw_93af21c

--------------------------------------------------

PROMPT BENCHMARKING

PromptWash must support benchmarking prompts across models.

Benchmarking should evaluate:

- token usage
- estimated cost
- response quality
- variant performance

Benchmarking may run against:

- OpenAI models
- Anthropic Claude models
- local Ollama models

Benchmarking must remain optional.

--------------------------------------------------

CONSTRAINT SYSTEM

PromptWash must support persistent constraints.

Constraints define standing preferences such as:

- do not use em dashes
- generated images must not contain text
- images must use wide format
- do not invent missing information

Constraints stored in:

.promptwash/constraints.json  
.promptwash/constraints.md  

--------------------------------------------------

CONSTRAINT APPLICATION MODEL

PromptWash must support two classes of constraints.

Structural constraints

Applied during parsing and prompt cleaning.

Examples:

- do not invent missing information
- preserve technical accuracy
- no em dashes

Output constraints

Applied during rendering.

Examples:

- images must be wide
- images must not contain text

Pipeline:

parse applies structural constraints  
render applies output constraints  

--------------------------------------------------

PROMPT STORAGE

Prompts must support both formats:

Markdown (.md)  
JSON (.json)

--------------------------------------------------

GITHUB PROMPT REGISTRY

PromptWash should support Git-based prompt repositories.

Example structure:

my_prompts/

prompts/
vault/
exec-summary.prompt.md

reports/
benchmark/
lint/

.promptwash/
constraints.json

--------------------------------------------------

CONFIGURATION SYSTEM

PromptWash must support an optional project configuration file:

.promptwash.config.json

Example:

{
  "ollama": {
    "baseUrl": "http://localhost:11434/api",
    "model": "llama3.2",
    "timeoutMs": 30000
  }
}

--------------------------------------------------

CONFIGURATION RESOLUTION ORDER

environment variables  
project configuration (.promptwash.config.json)  
user configuration (~/.promptwash/config.json)  
internal defaults  

--------------------------------------------------

OLLAMA INTEGRATION

PromptWash must connect to Ollama through its local HTTP API.

Default endpoint:

http://localhost:11434/api

PromptWash must verify:

- Ollama API is reachable
- required model exists

--------------------------------------------------

DEPENDENCIES

Required:

Node.js  
Git  
Ollama  

Optional:

OpenAI SDK  
Anthropic SDK  
GitHub CLI  

--------------------------------------------------

VERSION ROADMAP

v1.0

parse  
render  
check  
repo  
constraints  
config  

v1.1

benchmarking  
replay  
cost analysis  

v1.2

mutation  
trace  
prompt templates

v1.3
Optional IR caching
- cache parsed Prompt IR for unchanged prompts
- use prompt hash and config fingerprint for invalidation
- store cache under .promptwash/cache/
- keep execution behavior stateless from the user perspective

v2.0

plugin system  
VS Code extension  
CI integrations  

--------------------------------------------------

DETERMINISTIC GENERATION CONTRACT

When generating the PromptWash implementation:

- produce a working Node.js CLI
- avoid speculative frameworks
- keep dependencies minimal
- follow defined directory structure
- implement modular architecture