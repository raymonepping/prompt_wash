# PromptWash UI Blueprint

This document defines the product blueprint for the first PromptWash UI.

The goal is not to build a thin wrapper around CLI commands.
The goal is to build a **local-first prompt engineering workspace** that feels natural, visually strong, and centered on the original PromptWash promise:

> turn messy human language into clean, structured, useful prompts

The UI must make that transformation visible, immediate, and satisfying.

## Product Goal

PromptWash UI should feel like a **Prompt IDE**.

A user should be able to:

1. paste rough natural language
2. watch PromptWash transform it into a structured prompt
3. inspect variants, governance, and optimization
4. run the prompt
5. evaluate the output
6. compare and experiment
7. save artifacts, runs, lineage, and experiments

This workflow should feel fluid and visually coherent.

## Core Product Principle

### The UI is concept-driven, not command-driven

The UI should not mirror CLI command names as the primary interaction model.

Instead, the UI should reflect the main concepts of the system:

* Prompt Studio
* Runs
* Experiments
* Lineage
* Intelligence
* Governance
* Settings

The CLI remains important, but the UI should present PromptWash as a product, not a terminal menu.

## Primary Experience

### Prompt Studio

The default landing page is the **Live Transformation Workspace**.

This is the first screen users should see.

Why:

* it reflects the original PromptWash mission
* it demonstrates immediate value
* it gives users a “PromptWash moment”
* it makes the rest of the platform discoverable

The user should paste messy input and instantly see:

* cleaned prompt structure
* Prompt IR
* variants
* lint feedback
* risk and bias signals
* optimization suggestions

This is the heart of the product.

## Navigation Model

Top-level navigation should be simple and stable.

### Main navigation

* Prompt Studio
* Runs
* Experiments
* Lineage
* Intelligence
* Governance
* Settings

### Future navigation candidates

These should not be in the first version unless clearly needed:

* Models
* Projects
* Repositories
* Admin

Model and repository views can initially live under Intelligence and Settings.

## Screen Layout Overview

### 1. Prompt Studio

The Prompt Studio is the primary workspace.

### Layout

Use a **three-column main workspace** plus a lower execution area.

```text
┌────────────────────────┬────────────────────────┬────────────────────────┐
│ RAW INPUT              │ STRUCTURED PROMPT      │ PROMPT INSIGHTS        │
│                        │                        │                        │
│ messy text editor      │ Prompt IR viewer       │ lint warnings          │
│                        │                        │ risk score             │
│ paste or type          │ goal                   │ bias score             │
│                        │ audience               │ token estimate         │
│                        │ context                │ complexity score       │
│                        │ steps                  │ optimization hints     │
│                        │ constraints            │                        │
│                        │ output format          │                        │
│                        │ tone                   │                        │
│                        │ language               │                        │
└────────────────────────┴────────────────────────┴────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│ VARIANT PREVIEW                                                            │
│ Generic | Compact | OpenAI | Claude                                        │
│                                                                            │
│ rendered prompt preview                                                    │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│ EXECUTION                                                                  │
│ run output                                                                 │
│ latency                                                                    │
│ evaluation                                                                 │
└────────────────────────────────────────────────────────────────────────────┘
```

### Purpose of each area

#### Raw Input

Where the user pastes or types rough natural language.

#### Structured Prompt

Shows the parsed Prompt IR and lets the user inspect or edit fields.

#### Prompt Insights

Shows immediate analytical feedback.

#### Variant Preview

Shows rendered prompt styles.

#### Execution

Shows run output, evaluation, and experiment actions.

### 2. Runs Page

The Runs page is a history browser for saved executions.

### Layout

* left side: runs table
* right side: selected run detail

### Runs table columns

* Run ID
* Created
* Model
* Render mode
* Latency
* Overall score
* Fingerprint
* Intent

### Detail panel

* rendered prompt
* output text
* evaluation breakdown
* lineage linkage if available
* compare with another run action

### 3. Experiments Page

The Experiments page is a browser for saved experiment artifacts.

### Layout

* experiment list
* selected experiment summary
* variant matrix

### Core information

* experiment ID
* variants
* winner
* best overall
* fastest
* smallest prompt
* best constraint adherence

### Matrix view

Rows:

* variants

Columns:

* score
* latency
* prompt tokens
* constraint adherence
* audience fit

This page should feel like a research table, not a raw JSON viewer.

### 4. Lineage Page

The Lineage page visualizes prompt evolution.

### Layout

* left side: family selector and lineage metadata
* center: graph view
* right side: selected node detail

### Key UI elements

* lineage graph
* node metadata
* artifact path
* fingerprint
* execution coverage
* best evaluated node
* optimized node markers

This page is one of the strongest differentiators in the product.

### 5. Intelligence Page

The Intelligence page shows aggregate system insights.

### Sections

* repository stats
* model intelligence
* optimization intelligence
* run intelligence
* lineage coverage

### Suggested widgets

* total prompts
* total runs
* total experiments
* average latency
* average evaluation score
* best model
* fastest model
* optimized prompt count

### Charts

Use charts sparingly.
A few strong charts are better than a noisy dashboard.

Recommended:

* model average score
* model average latency
* run volume over time
* optimization coverage
* lineage coverage

### 6. Governance Page

The Governance page makes risk and bias analysis visible.

### Primary content

* recent risk analyses
* recent bias analyses
* current risk rules
* current bias rules

### Detail views

* matched patterns
* category weights
* recommendations
* rules file origin

This page should make governance feel inspectable and operational.

### 7. Settings Page

Settings should be simple in v1.

### Recommended sections

* Ollama configuration
* PromptWash config
* Project manifest
* theme preferences
* workspace defaults

## Prompt Studio Interaction Model

This is the most important part of the UI.

### Flow

1. user types or pastes raw text
2. frontend debounces input
3. backend transforms input into canonical workspace response
4. all workspace panels update together
5. user optionally edits structured fields
6. variants update
7. user may optimize, run, or experiment

### Design rule

The user must feel like they are working in **one continuous transformation space**, not bouncing between tools.

## Prompt Studio Components

### TopBar

Responsibilities:

* app branding
* project selector
* model selector
* primary actions
* settings entry

### Main actions

* Run
* Save
* Experiment

### RawInputPanel

Responsibilities:

* accept natural language input
* support paste-heavy workflow
* show placeholder guidance
* trigger transform loop

### Key UX details

* large text area
* autosize vertically
* debounced updates
* keyboard shortcut support later

### Empty state text

```text
Paste a rough idea, request, or messy prompt. PromptWash will structure it live.
```

### StructuredPromptPanel

Responsibilities:

* display Prompt IR
* allow field inspection
* later allow inline editing

### Fields shown

* goal
* audience
* context
* constraints
* steps
* output format
* tone
* language

### v1 mode

Read-first with light editing support.

### InsightsPanel

Responsibilities:

* show lint summary
* show governance signals
* show token estimate
* show complexity score
* show optimization summary

### Suggested cards

* LintCard
* RiskCard
* BiasCard
* TokenCard
* ComplexityCard
* OptimizationCard

Each card should be compact but expandable.

### VariantPanel

Responsibilities:

* show all render variants
* allow fast tab switching
* show token size differences

### Tabs

* Generic
* Compact
* OpenAI
* Claude

### For each tab show

* rendered prompt text
* token count
* delta vs generic if available

### ExecutionPanel

Responsibilities:

* trigger run
* display last run
* show evaluation
* allow experiment launch

### Sections

* RunControls
* OutputViewer
* EvaluationSummary
* QuickActions

### Quick actions

* Compare with another run
* Save to lineage
* Start experiment

## Component Tree

This is the recommended React component hierarchy.

```text
App
 ├─ AppShell
 │   ├─ Sidebar
 │   ├─ TopBar
 │   └─ MainContent
 │       ├─ WorkspacePage
 │       │   ├─ WorkspaceHeader
 │       │   ├─ WorkspaceGrid
 │       │   │   ├─ RawInputPanel
 │       │   │   │   └─ PromptEditor
 │       │   │   ├─ StructuredPromptPanel
 │       │   │   │   ├─ PromptIRViewer
 │       │   │   │   └─ PromptIRFieldList
 │       │   │   └─ InsightsPanel
 │       │   │       ├─ LintCard
 │       │   │       ├─ RiskCard
 │       │   │       ├─ BiasCard
 │       │   │       ├─ TokenCard
 │       │   │       ├─ ComplexityCard
 │       │   │       └─ OptimizationCard
 │       │   ├─ VariantPanel
 │       │   │   ├─ VariantTabs
 │       │   │   └─ VariantViewer
 │       │   └─ ExecutionPanel
 │       │       ├─ RunControls
 │       │       ├─ RunOutputViewer
 │       │       ├─ EvaluationPanel
 │       │       └─ ExperimentLauncher
 │       ├─ RunsPage
 │       ├─ ExperimentsPage
 │       ├─ LineagePage
 │       ├─ IntelligencePage
 │       ├─ GovernancePage
 │       └─ SettingsPage
 └─ Modals
     ├─ SavePromptModal
     ├─ AddToLineageModal
     ├─ RunComparisonModal
     ├─ ExperimentModal
     └─ SettingsModal
```

## Frontend State Ownership

The UI must have clear ownership boundaries.

### Workspace store

Owns:

* raw input
* prompt artifact
* Prompt IR
* variants
* checks
* optimization
* last run
* last experiment

### Registry store

Owns:

* runs
* experiments
* lineage data
* intelligence data

### UI store

Owns:

* active page
* active variant tab
* selected run ID
* selected experiment ID
* selected lineage family
* loading states
* transient errors
* modal state

## Screen-to-Endpoint Mapping

### Prompt Studio

### Main hydration

* `POST /api/workspace/transform`

### Secondary actions

* `POST /api/workspace/render`
* `POST /api/workspace/optimize`
* `POST /api/workspace/run`
* `POST /api/workspace/experiment`

### Runs Page

* `GET /api/runs`
* `GET /api/runs/:run_id`

### Experiments Page

* `GET /api/experiments`
* `GET /api/experiments/:experiment_id`

### Lineage Page

* `GET /api/lineage`
* `GET /api/lineage/:family`
* `GET /api/intelligence/lineage/:family`

### Intelligence Page

* `GET /api/intelligence/stats`
* `GET /api/intelligence/runs`
* `GET /api/intelligence/models`
* `GET /api/intelligence/optimization`

### Governance Page

For v1, governance can be derived from workspace interactions and rules file inspection.
Later it may get dedicated endpoints if needed.

## Design System Direction

The UI should feel modern and calm.

### Style goals

* dark-first
* visually appealing
* clean spacing
* strong typography
* subtle interaction polish
* minimal chrome

### Product references

Use the feel of:

* Notion
* Linear
* Raycast

### Avoid

* terminal emulator aesthetic
* dashboard clutter
* dense admin-panel look
* too many charts on the main workspace

## Visual Hierarchy

### Prompt Studio should emphasize:

1. raw input
2. structured prompt
3. actionable insights

Not logs.
Not raw JSON.
Not command traces.

The product should feel like a transformation tool first.

## Empty States

Good empty states matter.

### Prompt Studio

“Paste a rough idea, request, or messy prompt. PromptWash will structure it live.”

### Runs

“No runs yet. Execute a prompt from the workspace to build run history.”

### Experiments

“No experiments yet. Start an experiment from the workspace.”

### Lineage

“No lineage selected. Choose a family to explore prompt evolution.”

### Intelligence

“No aggregated data available yet. Run prompts and experiments to populate insights.”

## Error Handling

All screens should consume the stable backend error contract:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Lineage family not found: vault-pki",
    "details": null
  }
}
```

UI behavior:

* show friendly message
* keep page stable
* offer retry where appropriate
* allow technical details in collapsible panel if useful

## Performance Rules

The UI should remain responsive.

### Workspace rules

* debounce transform calls
* avoid multi-call hydration loops
* keep one canonical workspace response
* update all dependent panels from shared state

### Registry rules

* lazy-load detail views
* cache lists briefly
* avoid refetching everything after small local actions

## Recommended Implementation Order

### Step 1

Build Prompt Studio only:

* raw input
* structured prompt
* insights
* variants

### Step 2

Add run flow:

* run
* last run output
* evaluation display

### Step 3

Add experiment flow:

* experiment launch
* experiment result summary

### Step 4

Add browsing pages:

* runs
* experiments
* lineage
* intelligence

### Step 5

Polish:

* motion
* theming
* modals
* compare flows
* save flows

## Success Criteria

The PromptWash UI is successful when a user can:

1. paste messy natural language
2. instantly understand the structured prompt result
3. inspect prompt variants
4. see governance and optimization signals
5. run and evaluate prompts without leaving the workspace
6. trust the UI as more than a CLI wrapper

## Final Product Identity

PromptWash UI should feel like:

> a local-first prompt engineering studio

Not:

* a terminal in a browser
* a JSON inspector
* an analytics-only dashboard

The **Live Transformation Workspace** is the center of the product.
