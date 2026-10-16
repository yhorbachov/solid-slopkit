# Binding

`import { bind, control } from "@solid-slopkit/forms";`

A binding connects a field to a view element. There are two layers.

## bind(): slopkit components

`bind(f.x)` returns `{ value, onChange(value), onBlur, error, disabled, readOnly, required }`, all getters. Spread the whole object onto a component that takes a typed `value` and `onChange(value)`. Two variants cover the other inputs: `bind.text(f.x)` returns `onInput` instead of `onChange`, for the text inputs that pass `value` and `onInput` to their native element, and `bind.checked(f.x)` returns `checked` instead of `value`.

| Prop                         | Value                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `value` / `checked`          | the field's value                                                                         |
| `onChange(value)`, `onInput` | `$set(value)`; `onInput` reads the element's `value`                                      |
| `onBlur()`                   | `$markTouched()`                                                                          |
| `error`                      | the first error's message (`true` if it has none) once the field is touched; else `false` |
| `disabled`                   | `$disabled()`, including from a container above                                           |
| `readOnly`                   | `$readonly()`                                                                             |
| `required`                   | true when a `required()` rule is attached                                                 |

The field's type must be the type the component reports:

| Component                                    | Call                | Field type            |
| -------------------------------------------- | ------------------- | --------------------- |
| `TextInput`, `Textarea`, `PasswordInput`     | `bind.text(f.x)`    | `string`              |
| `NumberInput`                                | `bind(f.x)`         | `number \| undefined` |
| `Select`                                     | `bind(f.x)`         | `string \| null`      |
| `Radio.Group`                                | `bind(f.x)`         | `string`              |
| `MultiSelect`, `TagsInput`, `Checkbox.Group` | `bind(f.x)`         | `string[]`            |
| `Checkbox`, `Switch`                         | `bind.checked(f.x)` | `boolean`             |

A mismatch is a type error. `NumberInput` reports `undefined` when it is empty, so model that field as `number | undefined`; `min()` and `max()` skip an empty value, so pair them with `required()`.

Props after the spread win: `<TextInput {...bind.text(f.name)} error={f.name.$errors()[0]?.message} />` shows the error before the field is touched.

```tsx
import { createStore } from 'solid-js';
import { Checkbox, Code, NumberInput, Select, Stack, Switch, TextInput } from '@solid-slopkit/ui';
import { bind, form } from '@solid-slopkit/forms';

// bind() works on any input that takes a typed `value` and `onChange(value)`. The Field's type
// must be what the component reports: Select gives `string | null`, NumberInput `number | undefined`.
// Text inputs pass `onInput` to their element, so they use bind.text(); Checkbox and Switch take
// `checked`, so they use bind.checked().
export default function BindingDemo() {
  const [model, setModel] = createStore<{
    name: string;
    seats: number | undefined;
    plan: string | null;
    newsletter: boolean;
    darkMode: boolean;
  }>({ name: 'Ada', seats: 3, plan: 'team', newsletter: true, darkMode: false });
  const f = form(model, setModel);

  return (
    <Stack gap={2} style={{ 'max-width': '20rem' }}>
      <TextInput label="Name" {...bind.text(f.name)} />
      <NumberInput label="Seats" {...bind(f.seats)} />
      <Select label="Plan" data={['solo', 'team', 'company']} {...bind(f.plan)} />
      <Checkbox label="Newsletter" {...bind.checked(f.newsletter)} />
      <Switch label="Dark mode" {...bind.checked(f.darkMode)} />
      <Code block>{JSON.stringify(model, null, 2)}</Code>
    </Stack>
  );
}
```

## control(): native elements

`control(f.x)` spreads `value`, DOM-event handlers, `disabled` and `readonly` onto a plain element (`readonly` is the attribute; slopkit components take `readOnly`, which `bind` gives them). Checkboxes and selects have no native `readonly`, so their handlers refuse the edit and restore the element.

| Call                    | Element      | Field type                  |
| ----------------------- | ------------ | --------------------------- |
| `control(f.x)`          | text input   | `string`                    |
| `control.number(f.x)`   | number input | `number` (`NaN` when empty) |
| `control.checkbox(f.x)` | checkbox     | `boolean`                   |
| `control.select(f.x)`   | select       | `string`                    |

```tsx
import { createStore } from 'solid-js';
import { Code, Stack } from '@solid-slopkit/ui';
import { control, form } from '@solid-slopkit/forms';

// For plain DOM elements, control() spreads value and DOM-event handlers. Each type has an
// adapter: control (text), control.number, control.checkbox, control.select.
export default function NativeControlDemo() {
  const [model, setModel] = createStore({ name: 'Ada', age: 36, agree: false, color: 'green' });
  const f = form(model, setModel);

  return (
    <Stack gap={2} style={{ 'max-width': '20rem' }}>
      <label>
        Name <input {...control(f.name)} />
      </label>
      <label>
        Age <input type="number" {...control.number(f.age)} />
      </label>
      <label>
        <input type="checkbox" {...control.checkbox(f.agree)} /> Agree
      </label>
      <label>
        Color{' '}
        <select {...control.select(f.color)}>
          <option value="red">red</option>
          <option value="green">green</option>
        </select>
      </label>
      <Code block>{JSON.stringify(model, null, 2)}</Code>
    </Stack>
  );
}
```
