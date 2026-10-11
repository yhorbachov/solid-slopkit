# Mantine sets the component inventory, not the API

The component set is modeled on Mantine's: 0.0.1 ships nearly every component Mantine has, including dates and notifications, plus any additions or exclusions decided case by case. Mantine is **not** the API or design authority. Each component's props, defaults, variant names and look are chosen on their merits, borrowing from Mantine, daisyUI, Chakra or elsewhere. Matching any one library is never a goal on its own.

A reader will see Mantine's component names (`Group`, `SimpleGrid`, `SegmentedControl`) next to daisyUI's variant names (`soft`, `ghost`, `dash`) and tokens (`base-100`, `radius-field`). That mix is deliberate, so please don't "fix" it toward one library.

## Consequences

- Code copied from Mantine examples will often need changes, so porting from Mantine is not a supported promise.
- Choosing a component's API means comparing several libraries, not copying one.
- Mantine's generic utility hooks (`useLocalStorage`, `useDebouncedValue`, `useIdle`, …) are out of scope. Solid and its ecosystem cover them. We only export primitives our own components are built from.
- Out of 0.0.1: charts, CodeHighlight and RichTextEditor. Each is mostly a wrapper around a large third-party engine and is a library of its own, which apps that need it usually pick already. NavigationProgress is out too, because it isn't useful enough.
- In, beyond Mantine core: dates, notifications, the modals manager, Spotlight, Dropzone and Carousel (`@solid-slopkit/ui/carousel`, on `embla-carousel`).
