# Customize components with selectors on a root class and namespaced slots

Customizing a component means writing plain CSS against a stable, documented set of selectors:

- `.slp-<component>` on every component's root, e.g. `.slp-button`. A sub-component that the user renders, like `Grid.Col`, is a component in its own right and gets its own root class (`.slp-grid-col`).
- `data-slot="<component>-<part>"` on each inner part the component renders itself, e.g. `[data-slot="select-dropdown"]`, `[data-slot="card-title"]`. Slots are namespaced by component, so a selector never matches the same-named part of another component nested inside.
- State and variant as `data-*` attributes on the root (`data-variant`, `data-size`, `data-disabled`, …), for scoping an override.

This works without specificity fights because every component rule lives in `@layer slopkit.components`. Unlayered user CSS beats layered CSS whatever its specificity, so `.slp-button { border-radius: 0 }` wins over every internal rule. Overlays stay in their owner's DOM subtree (ADR 0011), so descendant selectors reach dropdowns and popovers too. Per-instance styling goes through `class` on the root: `.checkout-select [data-slot="select-dropdown"]`.

Public custom properties (`--slp-<component>-*`) exist only where one value feeds several derived declarations. Mostly that's color, which drives background, border, hover and active tints, shadow and text. Overriding the background directly would also override those states. A value that maps to a single declaration, like border radius, is not a custom property. Use a selector. Internal custom properties are named `--_*` and are not part of the contract.

The root class, slot names, state attributes and public custom properties are public API. Renaming one is a breaking change. They're listed per component in the generated LLM reference (ADR 0012).

## Considered Options

- **A custom property per customizable value** (`--slp-button-border-radius`, …): rejected as the main mechanism, because every component would need a growing, hand-designed variable list for what one selector already does.
- **Un-namespaced slots** (`[data-slot="title"]` under `.slp-card`): rejected, because descendant selectors would also match a nested component's slot of the same name.
- **A `classes` prop** (classes per part) and **a `styles` prop** (inline styles per part): not added. `classes` would help utility-CSS users style one instance's part without writing CSS, and it can be added later without breaking anything. A `styles` prop would add per-instance cost for what selectors and custom properties already cover.
