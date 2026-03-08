# PromptWash

PromptWash is a local-first prompt engineering toolkit that cleans, analyzes, optimizes, and manages prompts for large language models.

It helps transform messy human prompts into structured, efficient prompts that perform consistently across AI models.

PromptWash is designed for developers, AI engineers, and prompt engineers who want reproducible and measurable prompt workflows.

---

# Why PromptWash

Most prompts start messy:

- incomplete instructions
- inconsistent structure
- unnecessary filler
- missing output formats
- unclear intent

PromptWash acts as a **prompt hygiene pipeline** that converts raw prompts into structured prompts optimized for different AI models.

Think of it as:

- eslint for prompts
- terraform fmt for prompt structure
- benchmarking tooling for prompt performance

---

# Core Capabilities

PromptWash can:

- clean and normalize prompts
- detect prompt intent
- convert prompts into structured formats
- lint prompts for quality issues
- analyze token usage
- estimate model costs
- benchmark prompts across models
- enforce persistent prompt constraints
- track prompt history using Git

---

# Example

Raw prompt:


hey can you explain vault pki and compare it with cyberark for banking executives


PromptWash output:


Context:
Enterprise secrets management in regulated banking environments.

Task:
Explain HashiCorp Vault PKI.

Constraints:
Focus on governance and operational security.

Output:
Executive-friendly comparison with CyberArk.


---

# CLI Overview

PromptWash intentionally exposes a small set of commands:


promptwash parse
promptwash render
promptwash check
promptwash repo
promptwash constraints


Example workflow:


promptwash parse prompt.md
promptwash render prompt.md --target openai
promptwash check prompt.md --all


---

# Project Documentation

Full documentation is available in the `docs` directory.

- [Scope](docs/SCOPE.md)
- [Requirements](docs/REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Prompt IR](docs/PROMPT_IR.md)
- [CLI Reference](docs/CLI.md)
- [Constraints System](docs/CONSTRAINTS.md)
- [Project Philosophy](docs/PHILOSOPHY.md)
- [Roadmap](docs/ROADMAP.md)
- [Changelog](docs/CHANGELOG.md)
- [Contributing Guide](docs/CONTRIBUTING.md)
- [Responsible Disclosure](docs/DISCLOSURE.md)

---

# Quick Start

Install dependencies:


npm install


Start a local Ollama model:


ollama pull llama3


Clean a prompt:


promptwash parse example.prompt.md


---

# Design Principles

PromptWash follows several core principles:

- local-first execution
- minimal dependencies
- stable CLI interface
- reproducible prompt workflows
- extensible architecture

---

# License

See `LICENSE` for licensing information.