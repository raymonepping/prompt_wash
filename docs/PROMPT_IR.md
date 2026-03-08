# Prompt IR

Prompt IR (Intermediate Representation) is the structured representation of prompts used internally by PromptWash.

---

## Why Prompt IR Exists

Working with raw prompt strings makes analysis difficult.

Prompt IR introduces structure, enabling:

- linting
- transformation
- benchmarking
- deterministic storage

---

## Example Prompt IR


{
"goal": "",
"audience": "",
"context": "",
"constraints": [],
"steps": [],
"output_format": "",
"tone": ""
}


---

## Pipeline Integration


raw prompt
↓
parse
↓
Prompt IR
↓
render


---

## Benefits

Prompt IR enables PromptWash to behave more like a compiler than a string processor.