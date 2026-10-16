# The roadmap sets the component inventory; each API is chosen on its merits

The components 0.0.1 ships are the ones listed in `packages/ui/docs/roadmap.md`, including dates and notifications. Additions and exclusions are decided case by case. Each component's props, defaults, variant names and look are chosen on their merits when the component is designed, by comparing options, not by following an outside convention.

Names are chosen per area: layout components are named for what they arrange (`Group`, `SimpleGrid`), variants for how they look (`soft`, `ghost`, `dash`), and tokens for what they color or shape (`base-100`, `radius-field`). Don't rename one area to match another.

## Consequences

- Choosing a component's API means comparing options and recommending one, not copying.
- Generic utility hooks (`useLocalStorage`, `useDebouncedValue`, `useIdle`, …) are out of scope. Solid and its ecosystem cover them. We only export primitives our own components are built from.
- Out of 0.0.1: charts, CodeHighlight and RichTextEditor. Each is mostly a wrapper around a large third-party engine and is a library of its own, which apps that need it usually pick already. NavigationProgress is out too, because it isn't useful enough.
- In: dates, notifications, the modals manager, Command (with CommandDialog, the app-wide palette), Dropzone and Carousel (`@solid-slopkit/ui/carousel`, on `embla-carousel`).
