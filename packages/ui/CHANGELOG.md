# @solid-slopkit/ui

## 0.1.0

### Minor Changes

- The default theme is now neutral: grey base colors and a near-black primary (near-white in dark mode), with violet kept as the secondary. Its colors are written in `oklch`, and it sets `--slp-heading-weight` to 700. Apps that relied on the blue primary can set `--slp-color-primary` and `--slp-color-primary-content` in their own theme.

### Patch Changes

- efe740e: SegmentedControl mounted in a hidden container (a closed tab or modal) no longer shows its indicator sliding in from the first option once it is shown, and no longer reports an untracked read when its props come from an inline spread such as `{...bind(f.x)}`. Forms adds `bind.nativeSelect(f)` for `NativeSelect`, whose `onChange` stays the native event, and the binding guide now has a row for every ui input. The ui LLM index describes every entry and has a guide to picking a single-value input; the Select and NativeSelect references say when to choose the other.

## 0.0.1

### Patch Changes

- First release: a component library for SolidJS 2.x, styled with plain CSS and CSS variables. Layout, buttons, inputs, overlays, navigation, feedback and data display components, with a provider, themes and color schemes; dates at `/dates`, a carousel at `/carousel` and behavior primitives at `/primitives`. Ships its LLM references and skills.
