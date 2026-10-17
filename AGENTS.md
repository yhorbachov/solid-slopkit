# Agent Guide

This is a SolidJS 2.x project. Solid is not React: components run once (there is no re-render), reactivity is fine-grained through signals, and effects/memos have Solid-specific semantics. Do not port React patterns.

## Versioned skills (in node_modules — read on demand)

The installed packages ship agent skills that match their exact installed versions:

- `node_modules/solid-js/skills/reactivity-diagnostics/SKILL.md` — repair guide mapping every dev-mode diagnostic code (e.g. `REACTIVE_WRITE_IN_OWNED_SCOPE`, `STRICT_READ_UNTRACKED`) to its prescribed fix. Read it whenever a Solid diagnostic code appears in test output or the browser console.
- `node_modules/@solidjs/diagnostics/skills/agent-loops/SKILL.md` — how to capture reactive evidence (which scopes re-ran and why, wasted recomputes, cost tables) and assert budgets, in tests and against live pages.

## Releasing

Every package is released together under one version (ADR 0001). To cut a release, follow `.claude/skills/release/SKILL.md`: it applies the changesets, runs the checks, and asks before committing, tagging or pushing.

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

Each package (`ui`, `forms`, `i18n`, `threejs`) is its own context. Read only what your task touches:

- `CONTEXT-MAP.md`: the packages, how they relate, the terms they share, and where repo-wide decisions are. Start here.
- `packages/<name>/CONTEXT.md`: that package's vocabulary. Use its terms in code, docs and replies.
- `packages/<name>/docs/adr/` and `docs/adr/`: architecture decisions for that package and for the whole repo. Read the relevant ones before designing something, and don't silently go against one.
- `packages/ui/docs/roadmap.md` and `packages/threejs/docs/roadmap.md`: the ordered steps to each package's 0.0.1. **Implement only the step you were asked for, by its ID.** Never continue into the next step or a whole milestone on your own.

## This library stands alone

Never mention or reference other UI libraries (by name, as a model, or in a comparison) in docs, LLM references, skills, code comments, test names or commit messages. Write "the soft variant", not "daisyUI's soft variant". Describe what the library does on its own terms. Two exceptions: naming an actual dependency (`@floating-ui/dom`), and license notices such as the palette's attribution in `slopkit.css`.
