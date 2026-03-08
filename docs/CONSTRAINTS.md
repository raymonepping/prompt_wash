# Persistent Constraints

PromptWash supports persistent constraints that define standing prompt rules.

These constraints represent user or project preferences that should automatically be applied when relevant.

---

## Why Constraints Exist

Many prompt rules are repeated constantly:

- writing style preferences
- formatting rules
- image generation rules
- safety guidelines

PromptWash allows these rules to be stored once and reused automatically.

---

## Example Constraints

Examples include:

- do not use em dashes
- generated images must not contain text
- generated images must use wide format
- avoid inventing missing information
- preserve technical terminology

---

## Constraint Storage

Constraints are stored in:


.promptwash/constraints.json


Optional human-readable documentation:


.promptwash/constraints.md


---

## Constraint Levels

PromptWash supports layered constraints:

1. global constraints
2. project constraints
3. prompt-specific constraints
4. raw prompt instructions

---

## Contextual Application

Constraints must only apply when relevant.

Example:

Image rules apply only to image prompts.

Writing rules apply only to text prompts.

---

## CLI Commands

promptwash constraints init
promptwash constraints show
promptwash constraints validate