# PromptWash UI Architecture

This document defines the structural rules for the PromptWash user interface.

The goal is to ensure the UI remains:

- predictable
- maintainable
- consistent
- scalable as new features are added

PromptWash is designed as a developer workspace, not a marketing dashboard.

## 1. Core UI Philosophy

PromptWash follows three primary principles:

1. Workspace First
2. Information Hierarchy
3. Minimal Cognitive Load

The UI must prioritize the prompt editing experience above everything else.

PromptWash is a tool for thinking, not a visual analytics platform.

## 2. Primary Workspace Layout

The PromptWash interface is structured around a five-panel workspace grid.

Layout:

```text
+--------------------------------------------------+
| Top Navigation                                   |
+--------------------------------------------------+
| Raw Prompt | Structured Prompt | Insights        |
+--------------------------------------------------+
| Variant Preview              | Execution Output  |
+--------------------------------------------------+
```

Each section represents a stage in the PromptWash workflow.

## 3. Workspace Flow

PromptWash visualizes the prompt lifecycle:

```text
Raw Input
->
Prompt IR
->
Insights
->
Variants
->
Execution
```

Each panel corresponds to one stage.

## 4. Panel System

Panels are the primary building blocks of the workspace.

All panels must use the shared `Panel` component.

Panel responsibilities:

- `RawInputPanel`
- `StructuredPromptPanel`
- `InsightsPanel`
- `VariantDrawer`
- `ExecutionDrawer`

Panels must remain independent modules.

Panels must not directly manipulate each other's state.

State coordination occurs via the workspace store.

## 5. Drawer System

Drawers are used for secondary interactions.

Examples:

- `VariantDrawer`
- `ExecutionDrawer`

Rules:

- drawers slide from the bottom
- drawers must not block the prompt editor
- drawers may contain scrollable content
- drawers should be dismissible with Escape

Drawers allow expansion without breaking the main workspace.

## 6. State Boundaries

UI state is managed using Zustand.

State categories:

- Workspace state
- Execution state
- Variant state

Components should never call APIs directly.

API communication should be routed through:

- `workspaceStore`
- `workspaceApi`

This ensures consistent state updates.

## 7. Design Tokens

PromptWash uses a centralized design token system.

Defined in:

- `src/styles/index.css`

Token categories:

- colors
- typography
- spacing
- radius
- shadow
- animation

Tokens must be reused across all UI components.

No component should define custom color values directly.

## 8. Editor Experience

The prompt editor is the primary workspace surface.

Requirements:

- Monaco editor integration
- large comfortable writing surface
- keyboard-first editing
- syntax highlighting optional

The editor must feel similar to modern developer tools.

## 9. Insights Presentation

Insights must remain readable and minimal.

The Insights panel should prioritize:

- lint warnings
- risk signals
- bias signals
- token estimate
- complexity score
- optimization suggestions

Insights must not overwhelm the user with excessive metrics.

Cards should appear in a vertical list.

## 10. Animation Rules

PromptWash uses Framer Motion for lightweight UI motion.

Allowed animation areas:

- panel entrance
- drawer opening
- insight cards
- variant switching

Animation must remain subtle.

Rules:

- no excessive motion
- no editor animations
- no layout jitter

PromptWash should feel calm and stable.

## 11. Variant Interaction

Variant rendering appears in the bottom panel.

Variants include:

- Generic
- Compact
- OpenAI
- Claude

Users may:

- inspect variants
- copy variants
- run variants

Variants are always derived from the Prompt IR.

## 12. Execution Output

Execution results appear in the execution panel.

Displayed information includes:

- model output
- model name
- provider
- latency
- token usage
- timestamp

Execution should not interrupt editing.

Results should appear asynchronously.

## 13. Navigation Structure

PromptWash uses a simple navigation hierarchy.

Primary sections:

- Workspace
- Experiments
- Runs
- Intelligence

The Workspace remains the default landing page.

## 14. Accessibility

PromptWash must support:

- keyboard navigation
- clear focus states
- accessible color contrast

Developer tools must remain usable without a mouse.

## 15. Future Expansion

The UI architecture must support future modules without redesign.

Possible future sections:

- Prompt library
- Prompt lineage
- Model benchmarking
- Prompt templates

The workspace shell must remain stable.

## Summary

PromptWash UI architecture emphasizes:

- a focused workspace
- structured prompt inspection
- lightweight diagnostics
- deterministic prompt rendering
- controlled execution

The interface should always prioritize clarity over complexity.
