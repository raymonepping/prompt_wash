# PromptWash UI / UX Roadmap

## Phase 30: Workspace Experience

Phase 30 transforms PromptWash from a backend tool into a full prompt engineering workspace.

Each step adds one visible UI capability so progress can be tracked clearly.

The roadmap is intentionally incremental. Every stage must produce a usable interface.

## 30A: Workspace Shell

Goal: create the foundational UI layout and application shell.

Files:

- `src/app/layout/AppShell.tsx`
- `src/app/layout/TopNavigation.tsx`
- `src/app/layout/SidebarNav.tsx`
- `src/pages/WorkspacePage.tsx`

Checklist:

- [ ] `AppShell` wraps the application
- [ ] Top navigation renders correctly
- [ ] Sidebar navigation renders correctly
- [ ] `WorkspacePage` renders inside the shell
- [ ] Base layout grid works across screen sizes
- [ ] Panel primitives render correctly

Definition of done: PromptWash launches into a recognizable workspace rather than a blank app.

## 30B: Raw Prompt Editor

Goal: allow users to enter messy prompts and trigger analysis.

Files:

- `src/panels/RawInputPanel.tsx`
- `src/store/workspaceStore.ts`
- `src/api/workspaceApi.ts`
- `src/types/workspace.ts`

Checklist:

- [ ] Raw prompt editor renders
- [ ] Monaco editor integrated
- [ ] Prompt text stored in Zustand
- [ ] Debounced auto-analyze works
- [ ] Manual `Analyze` button works
- [ ] Loading state visible
- [ ] Error state visible

Definition of done: typing or pasting a prompt triggers API analysis.

## 30C: Structured Prompt Inspector

Goal: expose Prompt IR clearly to the user.

Files:

- `src/panels/StructuredPromptPanel.tsx`
- `src/types/workspace.ts`

Checklist:

- [ ] Goal rendered
- [ ] Audience rendered
- [ ] Context rendered
- [ ] Constraints list rendered
- [ ] Steps rendered
- [ ] Output format rendered
- [ ] Tone rendered
- [ ] Language rendered
- [ ] Missing fields shown as `Not detected`

Definition of done: users can see how PromptWash interprets their prompt.

## 30D: Insights Panel

Goal: provide diagnostics for prompt quality.

Files:

- `src/panels/InsightsPanel.tsx`

Checklist:

- [ ] Lint warnings rendered
- [ ] Risk score rendered
- [ ] Bias score rendered
- [ ] Token estimate displayed
- [ ] Complexity score displayed
- [ ] Optimization suggestions displayed

Definition of done: users understand prompt quality issues immediately.

## 30E: Variant Preview

Goal: allow inspection of prompt render variants.

Files:

- `src/drawers/VariantDrawer.tsx`

Checklist:

- [ ] Generic variant tab
- [ ] Compact variant tab
- [ ] OpenAI variant tab
- [ ] Claude variant tab
- [ ] Variant switching works
- [ ] Active variant highlighted

Definition of done: users can inspect prompt variants easily.

## 30F: Copy Prompt

Goal: allow exporting prompts to external LLM tools.

Files:

- `src/drawers/VariantDrawer.tsx`
- `src/components/ui/Button.tsx`

Checklist:

- [ ] Copy button per variant
- [ ] Clipboard integration works
- [ ] Copy success feedback
- [ ] Copy failure feedback

Definition of done: users can copy prompts directly into OpenAI, Claude, and similar tools.

## 30G: Prompt Execution

Goal: execute prompts directly from the workspace.

Files:

- `src/drawers/ExecutionDrawer.tsx`
- `src/api/workspaceApi.ts`

Checklist:

- [ ] Run prompt button
- [ ] Variant passed to execution
- [ ] Execution API called
- [ ] Output rendered
- [ ] Execution errors handled

Definition of done: PromptWash can run prompts and show responses.

## 30H: Execution Metadata

Goal: expose metadata for prompt runs.

Files:

- `src/drawers/ExecutionDrawer.tsx`

Checklist:

- [ ] Model displayed
- [ ] Provider displayed
- [ ] Latency displayed
- [ ] Input tokens displayed
- [ ] Output tokens displayed
- [ ] Timestamp displayed

Definition of done: runs show meaningful metadata.

## 30I: Prompt Diff

Goal: show transformation between raw and normalized prompts.

Files:

- `src/components/ui/PromptDiff.tsx`

Checklist:

- [ ] Raw versus normalized comparison
- [ ] Clear visual diff
- [ ] Minimal visual noise

Definition of done: users understand prompt transformations.

## 30J: Navigation Foundations

Goal: prepare the app for additional pages.

Files:

- `src/app/router.tsx`
- `src/app/layout/SidebarNav.tsx`

Checklist:

- [ ] Router configured
- [ ] Workspace page default route
- [ ] Sidebar navigation ready for expansion

Definition of done: the app supports additional sections without redesign.

## 30K: Workspace Visual Polish

Goal: elevate the UI to production-quality design.

Files:

- `src/styles/index.css`
- `src/components/ui/*`

Checklist:

- [ ] Design tokens implemented
- [ ] Typography improved
- [ ] Panel spacing improved
- [ ] Consistent shadows and blur
- [ ] Smooth loading states
- [ ] Consistent UI primitives

Definition of done: PromptWash feels like a polished product.

## 30L: Run History

Goal: allow users to inspect past executions.

Checklist:

- [ ] Run history list
- [ ] Select previous run
- [ ] Display run output

Definition of done: execution results become reusable.

## 30M: Prompt Lineage

Goal: introduce prompt version awareness.

Checklist:

- [ ] Prompt fingerprint displayed
- [ ] Previous prompt versions accessible
- [ ] Prompt duplication supported

Definition of done: PromptWash supports prompt evolution.

## 30N: Experiments UI

Goal: expose experimentation features in the UI.

Checklist:

- [ ] Experiments page
- [ ] Run multiple variants
- [ ] Compare model outputs

Definition of done: PromptWash becomes a prompt experimentation lab.

## Phase 30 Success Criteria

PromptWash should feel like a real prompt engineering workspace, not a demo interface.

The workspace must allow users to:

- write prompts
- inspect prompt structure
- analyze prompt quality
- generate variants
- execute prompts
- compare results
