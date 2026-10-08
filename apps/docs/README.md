## slopkit docs

Documentation site for the slopkit packages: header + sidebar + main content, built with SolidJS 2, `@solidjs/router` file-system routes and `vite`.

```bash
pnpm dev
```

In dev, `@slopkit/ui` and its CSS resolve to the package source (`slopkit-from-source.ts`), so edits to components show up immediately.

## Structure

- `src/routes/` — pages. `ui/button.tsx` is `/ui/button`; `[...404].tsx` catches everything else.
- `src/nav.ts` — the sidebar, grouped by package. Add an entry when you add a page.
- `src/layout/` — the shell: header, sidebar (a drawer below 768px) and main area.
- `src/components/` — doc building blocks:
  - `Example` renders a live example above its source.
  - `CodeBlock` highlights with shiki, lazy-loaded with only tsx, css and bash.
  - `PropsTable` / `CssVarsTable` render API tables.
  - `H2` is a linkable section heading.
- `src/examples/<component>/` — one file per example. Pages import each twice: the default export to render it, and `?raw` to show its source, so the code shown is always the code that runs.

The docs chrome in `src/App.css` only uses the slopkit theme tokens.
