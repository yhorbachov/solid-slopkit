# Stack

Stacks children vertically: a column [Flex](../flex/flex.md) with a gap.

```tsx
import { Stack } from '@solid-slopkit/ui';
```

## Usage

```tsx
<Stack>
  <Box p={2}>a</Box>
  <Box p={2}>b</Box>
</Stack>
<Stack gap={2} align="center">…</Stack>
<Stack justify="space-between" style={{ height: '10rem' }}>…</Stack>
<Stack divided gap={3}>
  <Group justify="space-between">…</Group>
  <Group justify="space-between">…</Group>
</Stack>
```

- **Defaults:** a `gap` of 4 (1rem), children stretched to the full width (`align="stretch"`), packed at the top.
- **Divided:** `divided` draws a 1px line between children, in the middle of the gap, so rows stay `gap` apart with the line halfway. Each child after the first gets the line as its top border, half the gap as top padding and minus half the gap as top margin; a child that sets its own top border, padding or margin overrides that, so wrap it in a Box.
- **Not responsive:** `gap`, `align` and `justify` take single values. For a layout that changes per breakpoint, use Flex with `direction="column"`.
- **No other style props:** Stack doesn't take `p`, `m`, `w` and the like. Wrap it in a [Box](../box/box.md) for spacing and size.
- Must be rendered inside `<SlopkitUi>`.

## Props

Other props are passed to the `div`.

| Prop      | Type          | Default        | Description                                                    |
| --------- | ------------- | -------------- | -------------------------------------------------------------- |
| `gap`     | `number`      | `4`            | Space between children, in spacing units.                      |
| `align`   | `FlexAlign`   | `'stretch'`    | `align-items`. See [Flex props](../box/box.md#flex-props).     |
| `justify` | `FlexJustify` | `'flex-start'` | `justify-content`. See [Flex props](../box/box.md#flex-props). |
| `divided` | `boolean`     | `false`        | Draws a line between children, in the middle of the gap.       |

## Styling

Write plain CSS against these selectors. Component rules live in `@layer slopkit.components`, so unlayered CSS wins.

- Root classes: `.slp-stack`, plus `.slp-flex`.
- `data-divided` on a divided Stack. Its lines are the top borders of the children after the first, e.g. `.slp-stack[data-divided] > * + * { border-top-style: dashed }`.
