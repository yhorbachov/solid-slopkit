# Framework-agnostic dependencies; heavy ones as optional peers behind subpaths

Many of the components we take from Mantine's set are built on React-only libraries there. `@slopkit/ui` only depends on framework-agnostic cores and writes the Solid bindings itself. For example, it uses `@floating-ui/dom` rather than `@floating-ui/react`, `@tiptap/core` rather than `@tiptap/react`, and `embla-carousel` rather than `embla-carousel-react`. It never depends on React-ecosystem packages.

Small, universally needed dependencies like `@floating-ui/dom` are regular dependencies. Heavy libraries that only one feature needs (a rich-text engine, carousel, charts, code highlighting) live behind their own subpath export, such as `@slopkit/ui/rich-text`. They are declared as optional peer dependencies, so an app that only renders a `Button` never installs them.

## Consequences

- Every subpath that needs an optional peer must be importable on its own, and the main entry must never import from it.
- Where a Mantine component wraps a React-only library with no agnostic core (e.g. `recharts`), we choose a replacement or write our own.
