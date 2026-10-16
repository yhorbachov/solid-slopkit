# Our own behavior primitives, no headless library

Interactive behavior (focus trapping, dismissal, list and grid keyboard navigation, typeahead, presence and animation, floating positioning, scroll locking, live regions) is built as our own Solid 2 primitives in `components/primitives/`, and components are composed from them. We don't depend on a headless component library. The WAI-ARIA Authoring Practices are the reference for patterns and edge cases.

## Considered Options

- **A framework-agnostic state-machine library:** a core that ADR 0002 would allow. Rejected because the official Solid adapter targets Solid 1.x, so we'd maintain our own adapter on a prerelease Solid. A generic machine runtime per instance also works against the per-instance cost budget we hold components to, and its prop/event conventions would leak into our API.
- **A Solid-native headless library:** idiomatic, but the available ones are Solid 1.x only. We'd have to fork and port them to Solid 2 and keep the fork up to date.

## Consequences

- The roadmap has to build the primitives before the components that need them, and ARIA correctness is our responsibility. Every interactive component gets keyboard and axe-core tests.
- The primitive set is finite and shared, so after it exists, most components are composition plus CSS.
- Primitives stay internal until 0.0.1, so they can change shape as more components use them. At 0.0.1, the stable, generally useful ones are exported from a `@solid-slopkit/ui/primitives` subpath.
