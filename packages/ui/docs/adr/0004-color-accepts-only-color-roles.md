# The `color` prop accepts only color roles

A component's `color` prop takes a **color role** and nothing else: `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning` or `error`. The theme decides what each role looks like, in both color schemes, together with its content color. Variants derive every tint they need from the role and its content color with `color-mix()`.

A one-off color is a styling decision, so it goes through CSS: each colored component has a public custom property for it, like `--slp-button-color` and `--slp-button-content` (ADR 0013). Palettes (`--slp-grape-6`, …) are there for app authors to use in that CSS. Components never read them.

## Considered Options

- **Roles, plus palette names and any CSS color** (`color="grape"`, `color="#ff00aa"`): rejected. A palette or raw color has no content color, so the component would have to compute a readable one. That needs relative color syntax, which is newer than our browser baseline (ADR 0010). A palette name would also need a shade per color scheme. And raw colors in props bypass the theme, so switching themes or schemes wouldn't restyle them.
- **Palette-first** (variants pick shades from 10-shade palettes): rejected. Every variant must know which shade to use in light and dark, and a theme becomes 14 × 10 values.

## Consequences

- The type of `color` is a closed union. Anything else is a type error.
- A component's colored look always comes from the theme, so it follows theme and color scheme changes.
