# PromptWash UI Component Tree

App
 └ AppShell
    ├ SidebarNav
    ├ TopNavigation
    ├ CommandPalette
    └ MainRouter

MainRouter

WorkspacePage  
StudioPage  
EvolutionLabPage  
PromptDebuggerPage  
ExperimentsPage  
IntelligencePage  
GovernancePage  
SettingsPage

---

# Workspace Page

WorkspacePage
 ├ WorkspaceHeader
 ├ WorkspaceGrid
 │  ├ RawInputPanel
 │  ├ StructuredPromptPanel
 │  └ InsightsPanel
 ├ VariantDrawer
 └ ExecutionDrawer

---

# Raw Input Panel

PanelHeader  
RawInputEditor  
FooterMeta

---

# Structured Prompt Panel

FieldList  
FieldEditor  
FieldIndicators

---

# Insights Panel

LintCard  
RiskCard  
TokenCard  
ComplexityCard  
SuggestionsCard

---

# Drawers

VariantDrawer  
ExecutionDrawer

---

# Shared Components

Panel  
Drawer  
Card  
Tabs  
Editor  
MetricCard