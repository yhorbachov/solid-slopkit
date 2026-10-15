# Spotlight

A search over the app's actions, in a modal: a search field, then the actions it finds. The keyboard moves through them and Enter triggers one. ⌘K (Ctrl+K off Apple devices), `useSpotlight()` and the `spotlight` facade open it.

```tsx
import { Spotlight, useSpotlight, spotlight, type SpotlightActions } from '@solid-slopkit/ui';
```

## Usage

Render it once, inside `<SlopkitUi>`:

```tsx
const actions: SpotlightActions = [
  { id: 'home', label: 'Home', description: 'The start page', leftSection: () => <HomeIcon />, onTrigger: () => navigate('/') },
  {
    group: 'Settings',
    actions: [
      { id: 'profile', label: 'Profile', keywords: ['account', 'name'], onTrigger: () => navigate('/profile') },
      { id: 'billing', label: 'Billing', disabled: true },
    ],
  },
];

<SlopkitUi>
  <App />
  <Spotlight actions={actions} highlightQuery />
</SlopkitUi>;

// Anywhere below it:
const search = useSpotlight();
<Button onClick={() => search.open()}>Search</Button>;
```

- **Opening:** the shortcut (`shortcut`, default `'mod+K'`: ⌘K on Apple devices, Ctrl+K elsewhere) opens it from anywhere on the page, also from a field, and closes it again. Pass another (`'/'`, `'alt+P'`), several as an array, or `null` for none. Modifiers are `mod`, `ctrl`, `meta`, `alt` and `shift`, and must match exactly; a letter or digit also matches by its physical key. `useSpotlight()` returns `opened()`, `open()`, `close()` and `toggle()`.
- **One per tree:** the open state lives in the provider (a nested provider shares its root's), so render one Spotlight; a second warns in development, and both would open. Opening without one warns and does nothing.
- **Facade:** `spotlight.open / close / toggle`, importable anywhere, through the most recently mounted `<SlopkitUi>`. On the server it does nothing (with a dev-mode warning). Inside components, prefer the hook.
- **Actions:** `actions` holds actions and `{ group, actions }` groups, in the order they're shown. An action has an `id` (unique), a `label`, and optionally a `description` (a second line), `keywords` (searched, not shown), `leftSection` / `rightSection` (an icon, a shortcut, a badge: JSX, or a function that makes it), `disabled` and `onTrigger`. Actions of the same group are shown together under its heading, groups in the order they first appear.
- **Search:** by default an action is found when its label, description or keywords contain every word of the query, ignoring case; an empty query shows every action. `filter(query, actions)` replaces it, e.g. to rank results: it gets the actions flattened, each with its `group`, and returns those to show, in order. `limit` caps how many are shown. `highlightQuery` marks the query's words in the labels with Highlight.
- **Keyboard** (focus stays in the search field): ArrowDown and ArrowUp move the active action, looping and skipping disabled ones; Enter triggers it; Escape closes. A new query makes the first action found active. The active action is announced through `aria-activedescendant`, marked `data-active` and `aria-selected`, and scrolled into view. Home and End move the caret.
- **Pointer:** moving over an action makes it active; a click triggers it. Pressing an action doesn't take focus from the search field.
- **Triggering** calls the action's `onTrigger`, then closes it (`closeOnActionTrigger`, default `true`).
- **Query:** uncontrolled by default, and emptied once it has closed (`clearQueryOnClose`, default `true`). `query` and `onQueryChange` control it.
- **Nothing found:** the list is replaced by `nothingFound` (default `'Nothing found'`), and the field's `aria-expanded` turns `false`.
- **Names:** `searchLabel` (default `'Search'`) names the field and the dialog (an `aria-label` on Spotlight names the dialog instead); `actionsLabel` (default `'Actions'`) names the listbox; `searchPlaceholder` defaults to `'Search…'`.
- **Modal:** it's a [Modal](../modal/modal.md) without a header, `size` `lg` by default, and takes its props: `size`, `centered`, `fullScreen`, `closeOnClickOutside`, `closeOnEscape`, `returnFocus`, `lockScroll`, `transition`, `transitionDuration`, `onExited`. Other props, `class` and `style` go to the `<dialog>`. Focus goes back to where it was when it closes.
- **Sections as functions:** the actions are read only while it's open, so the server renders none of them. JSX made before that, such as in a component's body, is made on the server without being rendered, and hydration can't find it: give sections as functions there (`leftSection: () => <HomeIcon />`), which are called when the action is shown. JSX written inline in `actions={[…]}` is fine either way. A stable array for `actions` keeps the list from being rebuilt.

## Props

Plus the [Modal](../modal/modal.md) props listed above.

| Prop                   | Type                                    | Default           | Description                                |
| ---------------------- | --------------------------------------- | ----------------- | ------------------------------------------ |
| `actions`              | `SpotlightActions`                      | —                 | Actions and groups of them. Required.      |
| `shortcut`             | `string \| string[] \| null`            | `'mod+K'`         | The key press that opens and closes it.    |
| `query`                | `string`                                | —                 | The search text, for a controlled one.     |
| `onQueryChange`        | `(query: string) => void`               | —                 | Called with the search text as it changes. |
| `clearQueryOnClose`    | `boolean`                               | `true`            | Empties the search once it has closed.     |
| `filter`               | `(query, actions) => SpotlightAction[]` | words in the text | Picks the actions to show, in order.       |
| `limit`                | `number`                                | —                 | Shows at most this many.                   |
| `highlightQuery`       | `boolean`                               | `false`           | Marks the query's words in the labels.     |
| `closeOnActionTrigger` | `boolean`                               | `true`            | Whether triggering an action closes it.    |
| `searchPlaceholder`    | `string`                                | `'Search…'`       | The search field's placeholder.            |
| `searchLabel`          | `string`                                | `'Search'`        | Names the search field and the dialog.     |
| `actionsLabel`         | `string`                                | `'Actions'`       | Names the list of actions.                 |
| `nothingFound`         | `JSX.Element`                           | `'Nothing found'` | Shown when no action is found.             |

`filterActions(query, actions)`, the default filter, is exported for a filter that builds on it.

## Styling

Component rules live in `@layer slopkit.components`, so unlayered CSS wins.

- Root class, on the `<dialog>`: `.slp-spotlight`, which is also a `.slp-modal` with its attributes (`data-size`, `data-centered`, `data-status`) and slots (`modal-content`, `modal-body`).
- Slots: `[data-slot="spotlight-search"]` (around the field, an [Input](../../inputs/input/input.md)), `spotlight-actions` (the listbox), `spotlight-group`, `spotlight-group-label`, `spotlight-action` (with `data-active`, `data-disabled`), `spotlight-action-left-section`, `spotlight-action-body`, `spotlight-action-label`, `spotlight-action-description`, `spotlight-action-right-section`, `spotlight-empty`.
- The list's height: `.slp-spotlight [data-slot="spotlight-actions"] { max-height: 32rem }` (default `min(24rem, 60vh)`).
