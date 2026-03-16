# PromptWash Prompt Type System

PromptWash is prompt-type agnostic by design.

The system must work for prompts targeting any generative system, including:

- text models
- code models
- image models
- multimodal models
- structured reasoning systems

PromptWash therefore does not parse prompts differently per model or provider.

Instead, it follows a two-layer architecture:

1. Universal prompt structure extraction
2. Prompt-type enrichment

This ensures messy input can always be structured first before domain-specific processing occurs.

## 1. Core Principle

PromptWash extracts instruction structure before specialization.

All prompts are first transformed into a universal representation called the Prompt IR (Instruction Representation).

This structure is stable across prompt types.

Example:

```json
{
  "goal": "...",
  "audience": "...",
  "context": "...",
  "constraints": [],
  "steps": [],
  "output_format": "...",
  "tone": "...",
  "language": "..."
}
```

Only after this stage does PromptWash attempt to infer prompt type.

## 2. Prompt Type Detection

Prompt type detection is heuristic and non-blocking.

It exists only to enable:

- domain-specific enrichment
- UI hints
- specialized linting
- model adaptation

If detection fails, the prompt defaults to:

```text
prompt_type = "general"
```

## 3. Supported Prompt Types (v1)

PromptWash v1 supports the following prompt categories.

### 3.1 Text

Used for:

- explanation
- summarization
- reasoning
- comparison
- writing
- analysis

Example:

```text
Explain Vault PKI to a beginner in simple language.
```

Typical signals:

- explain
- describe
- summarize
- compare
- analyze
- write
- discuss

Typical output formats:

- paragraph
- essay
- bullet list
- explanation

### 3.2 Code

Used for:

- generating source code
- debugging
- refactoring
- code explanation

Example:

```text
Write a Node.js script that reads a CSV and outputs JSON.
```

Typical signals:

- write a script
- generate code
- implement
- refactor
- debug
- function
- class

Additional enrichment fields:

```text
programming_language
framework
runtime
file_structure
code_style
```

### 3.3 Image

Used for:

- image generation
- visual concept design
- artistic rendering

Example:

```text
Create a cinematic futuristic UI mockup for PromptWash in glassmorphism style.
```

Typical signals:

- create an image
- generate an image
- render
- illustration
- concept art
- cinematic
- lighting
- composition

Additional enrichment fields:

```text
subject
style
composition
lighting
aspect_ratio
camera
```

### 3.4 Diagram / Visual Structure

Used for:

- architecture diagrams
- system diagrams
- flow charts

Example:

```text
Create a diagram showing how Vault integrates with Kubernetes.
```

Typical signals:

- diagram
- architecture
- flow
- system design

Additional enrichment fields:

```text
diagram_type
components
relationships
layout
```

### 3.5 Data / Structured Output

Used for:

- extraction
- transformation
- structured data generation

Example:

```text
Extract all company names and return JSON.
```

Typical signals:

- extract
- convert
- transform
- return JSON
- structured output

Additional enrichment fields:

```text
schema
format
fields
```

### 3.6 Mixed

Some prompts intentionally combine domains.

Example:

```text
Explain Vault PKI and include a small Go code example.
```

PromptWash should detect this as:

```text
prompt_type = "mixed"
```

Mixed prompts should not be forced into a single type.

## 4. Prompt Type Detection Strategy

Detection must follow this order:

### Step 1

Extract universal prompt structure.

### Step 2

Run prompt-type heuristics.

### Step 3

Assign type confidence.

Example:

```json
{
  "prompt_type": "code",
  "confidence": 0.82
}
```

If confidence is low:

```text
prompt_type = "general"
```

## 5. Parser Responsibilities

The parser must never depend on prompt type.

The parser only extracts:

- goal
- audience
- context
- constraints
- steps
- output format
- tone
- language

Prompt type detection must run after parsing.

## 6. Enrichment Layer

Prompt types enable optional enrichment.

Example:

### Code enrichment

```text
language detection
framework detection
runtime inference
```

### Image enrichment

```text
style detection
composition hints
camera or lighting hints
```

### Text enrichment

```text
reading level
audience clarity
argument structure
```

Enrichment must never override the original Prompt IR. It only adds metadata.

## 7. UI Implications

Prompt type affects UI behavior.

### Text

UI highlights:

- clarity
- structure
- reasoning

### Code

UI highlights:

- language
- runtime
- structure

### Image

UI highlights:

- style
- composition
- visual description

However, the core workspace layout remains identical.

PromptWash is always:

```text
Raw Input
-> Structured Prompt
-> Insights
-> Variants
```

Prompt type changes insight modules, not the workspace model.

## 8. Future Prompt Types

The architecture must allow adding types without breaking the parser.

Examples:

- video
- audio
- simulation
- agents
- workflows

PromptWash should support pluggable prompt-type modules.

## 9. Design Rule

Prompt types must never fragment the system.

There must always be:

```text
ONE universal parser
+
OPTIONAL type enrichment
```

Never:

```text
multiple specialized parsers
```

## 10. Product Principle

PromptWash helps users understand how their thinking becomes a prompt.

Prompt types exist only to improve that understanding, never to complicate it.

The workspace must remain:

```text
calm
clear
structured
model-agnostic
```
