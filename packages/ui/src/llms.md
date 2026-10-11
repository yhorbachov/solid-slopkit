# @solid-slopkit/ui

A component library for SolidJS 2.x, styled with plain CSS and CSS variables. Solid is not React: components run once, and reactivity comes from signals.

Each link below is the reference for one component: its props, examples, and the selectors and CSS variables to customize it with. Paths are relative to this file.

Task guides live next to `dist/` in the package, at `node_modules/@solid-slopkit/ui/skills/<area>/SKILL.md`:

- `skills/layout/SKILL.md`: pick a layout component, style props, responsive values.

## Setup

```tsx
import { SlopkitUi } from '@solid-slopkit/ui';
import '@solid-slopkit/ui/styles/slopkit.css';
import '@solid-slopkit/ui/styles/default-theme.css';

export function Root() {
  return <SlopkitUi>{/* your app */}</SlopkitUi>;
}
```

- [SlopkitUi](components/provider/slopkit-ui.md): the provider, required at the root. Locale (`useLocale()`) and the color scheme (`useColorScheme()`).

## Theming in one paragraph

A theme is a CSS rule that sets the `--slp-*` tokens: the default theme sets them on `:root`, and any other theme on `[data-slp-theme="<name>"]`, for the whole page or a subtree. Components read only tokens. The `color` prop of a component takes a color role: `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning` or `error`. A one-off color goes through the component's CSS variable, like `--slp-button-color`. Every component rule lives in `@layer slopkit.components`, so unlayered app CSS overrides it.

## Layout

Only layout components take style props, and each takes its own set. The Box reference documents them all, with the spacing scale and the responsive syntax.

- [Box](components/layout/box/box.md): a div with style props. Includes the style props reference.
- [Flex](components/layout/flex/flex.md)
- [Stack](components/layout/stack/stack.md)
- [Group](components/layout/group/group.md)
- [SimpleGrid](components/layout/simple-grid/simple-grid.md)
- [Grid](components/layout/grid/grid.md)
- [Container](components/layout/container/container.md)
- [Center](components/layout/center/center.md)
- [AspectRatio](components/layout/aspect-ratio/aspect-ratio.md)
- [Space](components/layout/space/space.md)

## Buttons

- [Button](components/button/button/button.md)

## Surfaces

- [Paper](components/surfaces/paper/paper.md)

## Typography

- [Anchor](components/typography/anchor/anchor.md)
- [Text](components/typography/text/text.md)
- [Title](components/typography/title/title.md)

## Inputs

- [SegmentedControl](components/inputs/segmented-control/segmented-control.md)
