# Context Map

slopkit is a family of packages for SolidJS 2.x. Each package is its own context with its own vocabulary and decisions. Read this file, then the `CONTEXT.md` of the package you are working in. Read another package's context only when your change crosses into it.

## Contexts

- [UI](./packages/ui/CONTEXT.md) (`@solid-slopkit/ui`): components, their look, theming and the provider. Decisions in [packages/ui/docs/adr](./packages/ui/docs/adr), roadmap in [packages/ui/docs/roadmap.md](./packages/ui/docs/roadmap.md).
- [Forms](./packages/forms/CONTEXT.md) (`@solid-slopkit/forms`): schema-driven form state over a Solid store. Decisions in [packages/forms/docs/adr](./packages/forms/docs/adr).
- [i18n](./packages/i18n/CONTEXT.md) (`@solid-slopkit/i18n`): translation files next to the code that uses them, and the active locale. Decisions in [packages/i18n/docs/adr](./packages/i18n/docs/adr).
- [threejs](./packages/threejs/CONTEXT.md) (`@solid-slopkit/threejs`): three.js scenes described with Solid components inside a **Canvas**. Decisions in [packages/threejs/docs/adr](./packages/threejs/docs/adr), roadmap in [packages/threejs/docs/roadmap.md](./packages/threejs/docs/roadmap.md).

Repo-wide decisions live in [docs/adr](./docs/adr): distribution (0001), dependencies (0002), browser baseline (0010), agent docs in the package (0012), no right-to-left support (0014) and package independence (0016). ADR numbers are unique across the repo, so "ADR 0013" names one file wherever it lives. A new ADR takes the next free number and goes in `docs/adr` when it binds every package, otherwise in its package's `docs/adr`.

## Relationships

No package depends on another at runtime; they meet through props (ADR 0016).

- **Forms → UI**: a **Binding** (`bind(field)`) returns exactly the props a UI input takes. UI is a dev-only dependency of forms, for tests and demos.
- **i18n → UI**: **Messages** fill a component's built-in text props, and the **active locale** is passed to the UI **provider** for date and number formatting. The two providers don't know each other.
- **threejs ↔ the others**: none. Solid context reaches **Scene components** inside a **Canvas**, so a scene can read the same app state and translations as the page around it, and DOM content from UI sits next to the Canvas, not in it.
- **Forms ↔ i18n**: none. A **Validation Error**'s message can come from a translation file like any other text.

## Shared language

**Skill**:
A task-oriented guide for coding agents (`skills/<area>/SKILL.md`), shipped in the package.
_Avoid_: guide, recipe

**LLM reference**:
Handwritten Markdown for agents next to the source, shipped in the package: one page per component in UI, one guide per topic in forms and i18n. `llms.md` is each package's index.
_Avoid_: llms.txt (that is only the index), API docs
