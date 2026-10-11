# Docs for agents ship inside the package

Each `@solid-slopkit/ui` tarball contains two sets of docs written for coding agents, versioned with the code:

- `skills/<area>/SKILL.md`: task-oriented guides (theming, layout, overlays, inputs), following the convention `solid-js` and `@solidjs/diagnostics` use. A consumer's AGENTS.md points at `node_modules/@solid-slopkit/ui/skills/`.
- `llm/`: one Markdown reference per component, provider and public primitive, plus `llm/index.md` (the `llms.txt` equivalent). These are **generated** at build time from the docs site's pages (prose and examples) and props extracted from the TypeScript types. They are never written by hand. The docs site serves the same files as `/llms.txt` and `/llms-full.txt`.

The package isn't on npm and the docs site may stay private (ADR 0001), so docs inside the package are often the only ones a consumer's agent can reach, and they always match the installed version.

## Considered Options

- **Handwritten Markdown per component:** rejected, because it becomes a third copy of the props after the types and the docs page, and it drifts.
- **Docs site only:** rejected, because it is unreachable for agents while the repo is private and isn't versioned with the installed package.
