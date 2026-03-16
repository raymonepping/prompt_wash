# PromptWash Roadmap

This roadmap structures Phase 30 so each step:

- adds one visible capability
- stays small and shippable
- is easy to validate
- maps directly to the architecture

Phase 30 aligns with the systems already defined for Prompt IR, Insights, Variants, and the Workspace State Model.

## Phase 30: UI / UX Workspace

Goal: turn PromptWash from a backend tool into a usable prompt engineering workspace.

This phase focuses on the workspace UI, not infrastructure.

## Phase 30A: Workspace Skeleton

Goal: create the base layout of the PromptWash UI.

Components:

- Top Navbar
- Left Editor
- Center Structured Prompt
- Right Insights Panel
- Bottom Variant Panel

Checklist:

- [ ] Workspace layout container
- [ ] Top navigation bar
- [ ] Raw input editor panel
- [ ] Structured prompt panel
- [ ] Insights panel
- [ ] Variant preview panel

Outcome: you have the PromptWash workspace shell.

## Phase 30B: Raw Prompt Editor

Goal: allow users to enter and analyze prompts.

Components:

- Raw Prompt Editor
- Analyze Button
- Auto Analyze (optional)

Checklist:

- [ ] Raw input editor
- [ ] `Analyze Prompt` button
- [ ] API call to `/api/workspace/analyze`
- [ ] Display normalized prompt
- [ ] Display structured prompt

Outcome: users can paste messy text and see the structured prompt.

## Phase 30C: Structured Prompt Inspector

Goal: make the Prompt IR visible and editable.

Components:

- Goal
- Audience
- Context
- Constraints
- Steps
- Output Format
- Tone
- Language

Checklist:

- [ ] Render `structured_prompt` fields
- [ ] Display constraints as a list
- [ ] Display tone
- [ ] Display language
- [ ] Highlight missing fields
- [ ] Inline editing for fields

Outcome: users can see how PromptWash interprets their prompt.

## Phase 30D: Insights Panel

Goal: display prompt diagnostics.

Components:

- Lint Card
- Risk Card
- Bias Card
- Token Estimate Card
- Complexity Card
- Optimization Card

Checklist:

- [ ] Render lint messages
- [ ] Render risk score
- [ ] Render bias signals
- [ ] Display token estimate
- [ ] Display complexity score
- [ ] Display optimization suggestions

Outcome: users can understand prompt quality.

## Phase 30E: Variant Preview

Goal: allow users to inspect different prompt renderings.

Tabs:

- Generic
- Compact
- OpenAI
- Claude

Checklist:

- [ ] Variant tabs
- [ ] Render variant text
- [ ] Switch between variants
- [ ] Highlight active variant

Outcome: users can compare prompt renderings across formats.

## Phase 30F: Copy Prompt

Goal: allow prompt export.

Checklist:

- [ ] Copy button per variant
- [ ] Clipboard integration
- [ ] Copy confirmation feedback
- [ ] Keyboard shortcut (optional)

Outcome: users can paste prompts directly into OpenAI, Claude, and similar tools.

## Phase 30G: Run Prompt

Goal: execute prompts directly from the workspace.

Components:

- Model Selector
- Run Button
- Output Viewer

Checklist:

- [ ] Model selector dropdown
- [ ] Provider selector
- [ ] Run prompt button
- [ ] Execute selected variant
- [ ] Display model output
- [ ] Show execution metadata

Outcome: PromptWash becomes a live prompt lab.

## Phase 30H: Run History

Goal: track executions.

Checklist:

- [ ] Run history list
- [ ] Timestamp per run
- [ ] Model used
- [ ] Tokens used
- [ ] Run result preview

Outcome: users can revisit earlier runs.

## Phase 30I: Prompt Fingerprint and Lineage

Goal: track prompt evolution.

Checklist:

- [ ] Display prompt fingerprint
- [ ] Show previous prompt versions
- [ ] Allow prompt duplication
- [ ] Show prompt lineage tree

Outcome: PromptWash becomes Git for prompts.

## Phase 30J: Prompt Comparison

Goal: compare runs and prompt variants.

Checklist:

- [ ] Run comparison view
- [ ] Variant comparison
- [ ] Token comparison
- [ ] Output comparison

Outcome: users can benchmark prompt variants.

## Phase 30K: Experiments

Goal: run structured prompt experiments.

Checklist:

- [ ] Experiment creation
- [ ] Select models
- [ ] Select variants
- [ ] Execute batch runs
- [ ] Compare results

Outcome: PromptWash becomes a prompt experimentation platform.

## Phase 30L: Prompt Library

Goal: store prompts.

Checklist:

- [ ] Save prompt
- [ ] List saved prompts
- [ ] Search prompts
- [ ] Tag prompts

Outcome: PromptWash becomes a prompt repository.

## Phase 30M: Prompt Diff Viewer

Goal: visualize prompt evolution.

Checklist:

- [ ] Show prompt diff
- [ ] Highlight changes
- [ ] Compare Prompt IR versions

Outcome: users can see exactly what changed between prompt iterations.

## Phase 30N: UI Polish

Goal: improve usability.

Checklist:

- [ ] Keyboard shortcuts
- [ ] Dark and light theme
- [ ] Loading indicators
- [ ] Error feedback
- [ ] Smooth panel resizing

Outcome: the workspace becomes polished.

## Final UI Structure

```text
+--------------------------------------------------+
| PromptWash Navbar                                |
+--------------------------------------------------+
| Raw Input | Structured Prompt | Insights         |
+--------------------------------------------------+
| Variant Preview + Run Output                     |
+--------------------------------------------------+
```

## Why This Roadmap Works

Each step is:

- small
- testable
- shippable
- visible

Each step also maps directly to the architecture:

| Feature | Architecture |
| --- | --- |
| Editor | Workspace Model |
| Structured prompt | Prompt IR |
| Insights | Insights System |
| Variants | Variant Rendering |
| Execution | Workspace State |

This keeps the UI aligned with the underlying system design.

## Recommendation

Start with:

1. 30A
2. 30B
3. 30C
4. 30D
5. 30E
6. 30F

That delivers a complete PromptWash UI v1. The remaining phases can be treated as v2 enhancements.
