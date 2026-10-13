# Collapse

A `div` that animates its height between zero and its content's as `expanded` changes.

```tsx
import { Collapse } from '@solid-slopkit/ui';
```

## Usage

```tsx
const [expanded, setExpanded] = createSignal(false);
const id = createUniqueId();

<Button aria-expanded={expanded() ? 'true' : 'false'} aria-controls={id} onClick={() => setExpanded((value) => !value)}>
  Shipping details
</Button>
<Collapse id={id} expanded={expanded()}>
  <Text>Orders placed before 2 p.m. leave the same day.</Text>
</Collapse>
```

- **Collapsed:** it stays in the DOM with `display: none`, so its content keeps its state and is out of the tab order and the accessibility tree.
- **The toggle is yours:** give the button `aria-expanded`, and `aria-controls` with the Collapse's `id`.
- **Timing:** `duration` (ms, default 200) and `timingFunction` (default `ease`). The content fades with the height unless `animateOpacity` is `false`. Under `prefers-reduced-motion: reduce` it expands and collapses at once.
- **Layout:** its own height is what animates, so put padding, borders and margins on the content inside it, not on the Collapse. It contains its content's margins (`display: flow-root`), so they don't collapse through it. Once expanded, the height follows the content again, so growing content isn't cut off. Changing `expanded` midway reverses from where it is.
- **In a Stack or other column flexbox:** the parent's gap next to it shrinks along with the height (a negative margin while it moves), so nothing jumps when it's hidden or shown. In a grid with a row gap it can't: a grid row can't shrink below zero, so the gap goes when it's hidden.
- **No animation on first render:** it starts expanded or collapsed, which is also what the server renders.
- **Callbacks:** `onExpanded` and `onCollapsed`, when the animation has finished.

## Props

Other props, such as `id`, are passed to the `div`.

| Prop             | Type         | Default  | Description                                 |
| ---------------- | ------------ | -------- | ------------------------------------------- |
| `expanded`       | `boolean`    | —        | Whether the content is shown.               |
| `duration`       | `number`     | `200`    | Duration of the animation, in milliseconds. |
| `timingFunction` | `string`     | `'ease'` | CSS timing function of the animation.       |
| `animateOpacity` | `boolean`    | `true`   | Whether the content also fades.             |
| `onExpanded`     | `() => void` | —        | Called when it has finished expanding.      |
| `onCollapsed`    | `() => void` | —        | Called when it has finished collapsing.     |

## Styling

Component rules live in `@layer slopkit.components`, so unlayered CSS wins.

- Root class: `.slp-collapse`.
- Attributes on it: `data-status` (`starting`, `open`, `ending`, `closed`) and `data-animate-opacity`.
