# PromptWash UI Product Philosophy

PromptWash is not a prompt generator.

PromptWash is a prompt engineering workspace.

Its purpose is to help users build, inspect, and evolve prompts while understanding how prompts behave.

## Core Principle

PromptWash begins with messy human thinking and progressively reveals the structure inside it.

The defining moment of the product is when a user sees a rough idea become a clear, structured prompt.

Example:

Messy input:

> Explain Vault PKI to someone who doesn’t know certificates. Keep it short.

Structured prompt:

- Goal: Explain Vault PKI
- Audience: Reader unfamiliar with PKI
- Constraints: Concise explanation

This transformation should feel immediate, calm, and natural.

## The Product Loop

PromptWash follows a continuous improvement loop:

**Think -> Build -> Inspect -> Evolve**

### Think

Users write messy ideas.

### Build

PromptWash extracts structure.

### Inspect

Users can analyze prompts, runs, and variants.

### Evolve

Prompts improve through refactoring, experiments, and lineage.

## Workspace Over Dashboard

PromptWash must always feel like a workspace, not a dashboard.

Workspaces enable creation. Dashboards display information.

PromptWash opens directly into a writing environment, and the first screen always supports thinking and prompt construction.

## Progressive Insight

PromptWash reveals analysis in layers.

### Level 1: Thinking

Minimal feedback while writing.

### Level 2: Improving

Refactoring and lint suggestions appear.

### Level 3: Inspecting

Detailed analytics appear only in deeper tools.

This prevents cognitive overload.

## Core Experience

PromptWash succeeds when users:

1. Quickly see structure emerge from messy input.
2. Leave the workspace with a better prompt.
3. Explore deeper insights only when they want to.

## Design Tone

The interface should feel:

- Calm
- Clean
- Precise
- Modern
- Confident

The product should feel closer to:

- VS Code
- Linear
- Raycast

Rather than an analytics dashboard.

## Product Tagline

Build, inspect, and evolve prompts.
