# PromptWash UI Design Principles

This document defines the design principles that should guide the PromptWash interface.

The goal is to keep the product visually disciplined, operationally clear, and aligned with the feel of modern developer tools.

PromptWash should not feel like:

- a website
- a dashboard
- a form builder

PromptWash should feel like:

- a precision instrument
- a workspace
- a control console

These principles are intended to prevent visual drift as the interface grows.

## Design Goal

PromptWash should feel like a restrained command surface rather than traditional app chrome.

This is the quality shared by tools like Linear, Raycast, Vercel, Arc, and modern IDEs.

These products do not feel premium because of decorative styling alone. They feel premium because the interface behaves like a calm control surface.

## 1. Use a Thin, High-Value Top Bar

The top bar should be slim, dense, and functional.

It should not behave like:

- a large header
- a hero section
- oversized branding

It should contain only high-value workspace controls and metadata, such as:

- PromptWash mark
- prompt fingerprint
- current variant
- token count
- `Copy`
- `Run`

Example:

```text
PromptWash    pw_0f948831    generic    43 tokens          Copy   Run
```

This immediately makes the product feel more like a professional tool and less like a generic web app.

## 2. Use Strong Panel Edges and Soft Interiors

Premium tools often combine clear outer structure with soft inner surfaces.

This means:

- panels should have distinct boundaries
- content inside panels should have room to breathe

Recommended treatment:

- clearer borders
- subtle glass or low-contrast background
- restrained fill color
- generous internal padding

This creates a premium control-panel feel without visual noise.

## 3. Use One Accent Color at a Time

A common reason interfaces look cheap is uncontrolled use of many competing accent colors.

PromptWash should keep color disciplined.

Recommended color roles:

- blue for active workspace actions
- amber for warnings
- red only for true errors
- green only for successful execution
- teal only inside Insights

The principle is simple: one accent should dominate at any given moment.

## 4. Keep Defaults Quiet and Interaction States Strong

Modern premium tools stay calm when idle and become more precise when interacted with.

Default state:

- muted borders
- low-key buttons
- subdued text hierarchy

Hover and focus state:

- brighter outline
- slightly stronger background
- crisp transitions

The interface should feel like it wakes up when the user interacts with it.

## 5. Let Typography Carry the Hierarchy

The strongest developer tools rely more on typography than decoration.

PromptWash should use typography intentionally:

- larger editor text
- crisp monospace text for prompts
- restrained small metadata
- semibold section titles
- quiet uppercase labels

If the type hierarchy is right, the interface will feel more precise and more expensive.

## 6. Show Identity Metadata Early

PromptWash should expose workspace identity metadata near the top of the interface.

Useful metadata includes:

- Prompt ID
- active variant
- token count
- selected model, when available

Example:

```text
Prompt ID   pw_0f948831
Variant     OpenAI
Tokens      43
```

This is a small design choice, but it changes the emotional tone of the product from toy to instrument.

## 7. Use Depth on Demand

Premium tools do not present all information at once.

They show:

- essential information immediately
- deeper information when explicitly opened

For PromptWash, that means:

- the workspace stays calm
- drawers can be richer
- debugger-style views can be detailed
- intelligence pages can go deeper

This prevents the product from turning into feature soup.

## 8. Use Motion for Confirmation, Not Decoration

Motion should support clarity rather than spectacle.

Appropriate motion:

- panel fade or slide in
- drawer reveal
- tab switch transition
- success message fade

Avoid:

- bouncing UI
- floating editor effects
- dramatic loading animations

Premium tools use motion to confirm state changes, not to entertain.

## Visual Tone

The overall visual tone of PromptWash should be:

- calm
- sharp
- restrained
- intentional
- developer-oriented

The interface should communicate confidence through structure, hierarchy, and interaction quality rather than decoration.

## Product Rule

PromptWash should feel like a precision workspace, not a styled dashboard.

This rule should be used as the final check for design decisions. If a UI choice makes the product feel more decorative than operational, it should be reconsidered.
