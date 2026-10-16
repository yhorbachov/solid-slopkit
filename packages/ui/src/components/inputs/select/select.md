# Select

A labelled field that picks one value from a list in a dropdown, optionally searchable. Built on [Combobox](../combobox/combobox.md).

```tsx
import { Select } from '@solid-slopkit/ui';
```

## Usage

```tsx
<Select label="Country" placeholder="Pick one" data={['Austria', 'Belgium', 'Croatia']} />

<Select
  label="City"
  searchable
  clearable
  value={city()}
  onChange={(value) => setCity(value)}
  data={[
    { group: 'Nordics', items: ['Copenhagen', 'Oslo', 'Stockholm'] },
    { group: 'Baltics', items: [{ value: 'rix', label: 'Riga' }, { value: 'tll', label: 'Tallinn', disabled: true }] },
  ]}
/>
```

- **Data:** strings, `{ value, label?, disabled? }` items, and `{ group, items }` groups, in the order shown. A label defaults to its value. Options before the first group show without a heading.
- **Value:** uncontrolled with `defaultValue` (read once), or controlled with `value` (`null` for none). `onChange(value, item)` is called when it changes, with `null, null` when it's cleared.
- **Field:** without `searchable`, a `button` with `role="combobox"` showing the selected label, or the `placeholder`. With `searchable` (read once), a text field: typing filters the options by their labels (ignoring case) and makes the first match active; closing without choosing shows the selection again, and `nothingFoundMessage` (default `Nothing found`) shows when nothing matches.
- **Keyboard:** ArrowDown and ArrowUp open it on the selected option, else the first or last, and move; Home and End go to the ends (not in a searchable one). Enter chooses the active option and closes it; Escape and Tab close it. Without `searchable`, Enter and Space also open it, Space chooses the active option, and typing a letter opens it on the first option that starts with what was typed. Disabled options are skipped.
- **Pointer:** a press anywhere on the field (the chevron included) opens and closes it; a click on the label only focuses it. A click on an option chooses it. Focus stays on the field throughout.
- **Selected option:** marked with a check mark and the primary color, and `aria-selected="true"`. `allowDeselect` makes choosing it again clear the value.
- **Clearing:** `clearable` replaces the chevron with a clear button (named `clearLabel`, default `Clear`) while there's a value.
- **Forms:** `name` adds a hidden input with the value (empty for none).
- **Label and texts:** `label`, `labelSection`, `description`, `error`, `required`, `withAsterisk`, `size` and `id`, as on TextInput. The label names the field and the listbox. Without a label, pass `aria-label`.
- **Box:** an [Input](../input/input.md)'s box, with `variant`, `leftSection` and `rightSection` (which replaces the chevron). `disabled` and `readOnly` keep it closed.
- **Dropdown:** under the field and as wide as it; `comboboxProps` sets `position`, `offset`, `matchTargetWidth`, `transition` and `transitionDuration`. The list scrolls past 15rem. Needs a `<SlopkitUi>` above it.
- `class` and `style` go to the root (with the label and texts); other props, such as `aria-label` or `onBlur`, go to the field.

## Props

| Prop                  | Type                                                                     | Default           | Description                                   |
| --------------------- | ------------------------------------------------------------------------ | ----------------- | --------------------------------------------- |
| `data`                | `SelectData`                                                             | —                 | The options. Required.                        |
| `value`               | `string \| null`                                                         | —                 | The selected value, when controlled.          |
| `defaultValue`        | `string \| null`                                                         | `null`            | The value it starts with, when uncontrolled.  |
| `onChange`            | `(value: string \| null, item: SelectItem \| null) => void`              | —                 | Called when the selection changes.            |
| `placeholder`         | `string`                                                                 | —                 | Shown while nothing is selected.              |
| `searchable`          | `boolean`                                                                | `false`           | Lets typing filter the options. Read once.    |
| `clearable`           | `boolean`                                                                | `false`           | A button that clears the selection.           |
| `clearLabel`          | `string`                                                                 | `'Clear'`         | The clear button's name.                      |
| `allowDeselect`       | `boolean`                                                                | `false`           | Choosing the selected option again clears it. |
| `nothingFoundMessage` | `string`                                                                 | `'Nothing found'` | Shown when no option matches the search.      |
| `name`                | `string`                                                                 | —                 | Submits the value with a form.                |
| `readOnly`            | `boolean`                                                                | `false`           | Shows the value without letting it change.    |
| `disabled`            | `boolean`                                                                | `false`           | Disables the field.                           |
| `variant`             | `'outline' \| 'soft' \| 'ghost'`                                         | `'outline'`       | The box's look.                               |
| `leftSection`         | `JSX.Element`                                                            | —                 | Content before the value.                     |
| `rightSection`        | `JSX.Element`                                                            | a chevron         | Content after the value.                      |
| `comboboxProps`       | `{ position, offset, matchTargetWidth, transition, transitionDuration }` | —                 | The dropdown's position and animation.        |

Plus `label`, `labelSection`, `description`, `error`, `required`, `withAsterisk`, `size` and `id`, as on TextInput.

## Styling

Component rules live in `@layer slopkit.components`, so unlayered CSS wins.

- Root classes: `.slp-select`, plus `.slp-input-wrapper`, with InputWrapper's slots and attributes. The field box is an `.slp-input`, and the dropdown a [Combobox](../combobox/combobox.md)'s (`.slp-combobox`, `.slp-combobox-option`, …).
- Slots: `select-value` (with `data-placeholder` while nothing is selected), `select-option-check`, `select-option-label`, `select-clear`.
