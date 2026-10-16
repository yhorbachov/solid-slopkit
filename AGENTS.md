# Agent Guide

> **Branch goal: `feat/styling` (temporary, remove this note before merging into `main`)**
>
> This branch reworks theming and styling. The goals:
>
> - **Good-looking defaults.** A component looks finished out of the box, with no theme work needed.
> - **Every component can be customized.** An app can restyle any component, down to its inner parts, without fighting the library.
> - **A small, purpose-named token set.** Surfaces are paired with their foreground (a surface token and the text color that is readable on it), plus shared tokens for radius, borders and focus rings. App authors set these as plain CSS variables to retheme.
>
> This may change the color vocabulary in `CONTEXT.md` (color roles, content colors, base colors), the default theme values from M8.02, and ADRs 0004, 0005 and 0013. Where this goal conflicts with them, it wins on this branch. Update the ADR or vocabulary in the same change instead of silently going against it. The roadmap rule "don't tune the default theme inside other steps" does not apply on this branch.

This is a SolidJS 2.x project. Solid is not React: components run once (there is no re-render), reactivity is fine-grained through signals, and effects/memos have Solid-specific semantics. Do not port React patterns.

## Versioned skills (in node_modules — read on demand)

The installed packages ship agent skills that match their exact installed versions:

- `node_modules/solid-js/skills/reactivity-diagnostics/SKILL.md` — repair guide mapping every dev-mode diagnostic code (e.g. `REACTIVE_WRITE_IN_OWNED_SCOPE`, `STRICT_READ_UNTRACKED`) to its prescribed fix. Read it whenever a Solid diagnostic code appears in test output or the browser console.
- `node_modules/@solidjs/diagnostics/skills/agent-loops/SKILL.md` — how to capture reactive evidence (which scopes re-ran and why, wasted recomputes, cost tables) and assert budgets, in tests and against live pages.

## Reactive diagnostics — capture evidence instead of guessing

Use these whenever you are debugging reactivity (something doesn't update, updates too often, or is slow) or verifying a change didn't regress update granularity:

- **In tests:** `captureArtifact()` from `@solidjs/diagnostics` wraps a scenario and returns a serializable artifact of diagnostics + rerun attribution; matchers from `@solidjs/diagnostics/vitest` (`toHaveNoDiagnostics`, `toStayWithinRerunBudget`, `toHaveNoWaste`, …) assert on it. No browser needed.
- **Against the running dev server** (`diagnostics: true` in vite.config.ts; dev-only, no-op in builds). Requires an open page connected to the dev server (e.g. via a browser tool):
  - `GET /__solid/diagnostics` — status and connected client count
  - `POST /__solid/diagnostics` with JSON `{"method":"begin"}` then `{"method":"end"}` — capture a session into an artifact
  - `{"method":"whyDidRun","params":{"name":"<scope name>"}}` — recorded re-runs of one named scope in the open session
  - `{"method":"costs"}` — running cost tables for the open session

Name your signals/memos/effects (the `{ name: "..." }` option) — attribution reports scopes by name.

## Roadmap, decisions and vocabulary

- `docs/roadmap.md`: the ordered steps to 0.0.1. **Implement only the step you were asked for, by its ID.** Never continue into the next step or a whole milestone on your own.
- `docs/adr/`: architecture decisions. Read the relevant ones before designing a component, and don't silently go against one.
- `CONTEXT.md`: the project's vocabulary. Use its terms in code, docs and replies.

## This library stands alone

Never mention or reference other UI libraries (by name, as a model, or in a comparison) in docs, LLM references, skills, code comments, test names or commit messages. Write "the soft variant", not "daisyUI's soft variant". Describe what the library does on its own terms. Two exceptions: naming an actual dependency (`@floating-ui/dom`), and license notices such as the palette's attribution in `slopkit.css`.
