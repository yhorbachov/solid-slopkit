# Color roles, with any CSS color as an escape hatch

A component's `color` prop takes one of three things:

- a **color role** (`primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`);
- a **palette** name (`'grape'`), which is shorthand for that palette's default shade;
- any CSS color (`'#ff00aa'`, `'var(--slp-grape-3)'`).

Variants derive every tint they need from that one color and its content color with `color-mix()`. They never index into a 10-shade scale. The model takes daisyUI's simplicity, where a theme is a small set of role tokens and dark mode is just another theme, and keeps Mantine's habit of passing an arbitrary color to `color`.

Unlike Mantine, whose variants pick specific shades of a palette, our tints come from mixing, so `color="grape"` won't match Mantine's shades exactly.

## Considered Options

- **Roles only (daisyUI).** Rejected: no way to pass a one-off color without writing CSS.
- **Palette-first (Mantine).** Rejected: every variant must know which shade to use in light and dark, a theme becomes 14 × 10 values, and a raw CSS color can't take part because it has no shades.

## Consequences

- When `color` is a palette or raw color, there is no `-content` token. The component either computes a readable content color or takes one through its `--slp-<component>-content` override.
