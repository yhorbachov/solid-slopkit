# NativeSelect

A labelled native `select` in an [Input](../input/input.md) box, with a chevron. The browser draws the list, so it behaves like any select on every device, including phones' own pickers.

```tsx
import { NativeSelect } from '@solid-slopkit/ui';
```

## Usage

```tsx
<NativeSelect label="Editor" data={['Vim', 'Emacs', 'Nano']} />

<NativeSelect
  label="Country"
  placeholder="Pick a country"
  value={country()}
  onChange={(event) => setCountry(event.currentTarget.value)}
  data={[
    { group: 'Europe', items: ['France', 'Germany'] },
    { group: 'Asia', items: [{ value: 'jp', label: 'Japan' }] },
  ]}
/>
```

- **Options:** `data` takes strings (value and label), `{ value, label?, disabled? }` objects, and `{ group, items }` groups, which become `optgroup`s. Without `data`, pass `option` elements as children. Whether options come from `data` or children is decided once.
- **Value:** native: `value` is a string and `onChange` gets the select's change event (`event.currentTarget.value`). Uncontrolled works too: leave `value` out.
- **Placeholder:** `placeholder` adds a first option with the value `''`, disabled, so it can't be chosen again once something is. It shows muted while chosen. Start a controlled select at `value=""` to show it.
- **Look:** Input's `variant` and `leftSection`. The right side holds the chevron, which lets clicks through to the select.
- **Props are split** like TextInput's. One choice only: there's no `multiple`.

## Props

Other props are passed to the `select`. The wrapper's props (`label`, `labelSection`, `description`, `error`, `required`, `withAsterisk`, `size`, `id`, `class`, `style`) are TextInput's.

| Prop          | Type                                                             | Default     | Description                                 |
| ------------- | ---------------------------------------------------------------- | ----------- | ------------------------------------------- |
| `data`        | `(string \| { value, label?, disabled? } \| { group, items })[]` | —           | The options. Without it, children.          |
| `placeholder` | `string`                                                         | —           | A first, empty option shown until a choice. |
| `value`       | `string`                                                         | —           | The chosen value, controlled.               |
| `onChange`    | `(event) => void`                                                | —           | The select's change event.                  |
| `variant`     | `'outline' \| 'soft' \| 'ghost'`                                 | `'outline'` | Visual style of the box.                    |
| `leftSection` | `JSX.Element`                                                    | —           | Content before the select.                  |
| `disabled`    | `boolean`                                                        | `false`     | Disables the select.                        |
| `children`    | `JSX.Element`                                                    | —           | The `option` elements, without `data`.      |
| `ref`         | `Ref<HTMLElement>`                                               | —           | The `select`.                               |

## Styling

Write plain CSS against these selectors. Component rules live in `@layer slopkit.components`, so unlayered CSS wins.

- Root classes: `.slp-native-select`, plus `.slp-input-wrapper`. The box inside is an Input; the select is its `input-control` slot.
- Slots: `[data-slot="native-select-chevron"]`, inside the Input's right section.
