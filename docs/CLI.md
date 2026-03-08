# CLI Reference

PromptWash exposes five top-level commands.

---

## parse

Convert raw prompts into Prompt IR.


promptwash parse input.md


---

## render

Generate prompt variants.


promptwash render input.md --target openai
promptwash render input.md --target claude
promptwash render input.md --target compact


---

## check

Analyze prompt quality.


promptwash check input.md --lint
promptwash check input.md --score
promptwash check input.md --all


---

## repo

Manage prompt repositories.


promptwash repo connect <repo>
promptwash repo publish prompt.md
promptwash repo history prompt-id


---

## constraints

Manage persistent constraints.

promptwash constraints init
promptwash constraints show