# Spotlight

```tsx
import { Spotlight, type SpotlightAction } from '@solid-slopkit/ui';

<Spotlight opened={opened()} onClose={() => setOpened(false)} actions={actions} title="Commands" />;
```

A searchable action list in a modal `<dialog>` in the browser's top layer. Requires `<SlopkitUi>`. Render it where it should inherit the theme. Opening focuses search; closing restores the opener after the exit animation. The app owns opening buttons and shortcuts. There is no global store or facade.

## Props

- `opened: boolean`, `onClose: () => void`: controlled visibility; close button, Escape and backdrop request closure.
- `actions: readonly SpotlightAction[]`: actions grouped by their `group`, in first-seen group order. Actions within each group retain input order. Ungrouped actions form one unnamed group. IDs must be unique.
- `query?: string`, `defaultQuery?: string` (default `''`), `onQueryChange?: (query: string) => void`: controlled or uncontrolled search. Default is read once. Uncontrolled text persists across openings; active action resets after closing.
- `onActionTrigger?: (action: SpotlightAction) => void`: called after the action's `onTrigger`.
- `closeOnActionTrigger?: boolean` (default `true`): requests closure after both callbacks. Callbacks are synchronous; async work and its progress belong to the app.
- `limit?: number`: maximum visible actions across groups; negative values behave as zero. Use a finite number.
- `filter?: (query: string, action: SpotlightAction) => boolean`: replaces default matching. Receives raw query. Default trims query and matches label, description or keywords case-insensitively.
- `searchLabel?: string` (`'Search actions'`), `searchPlaceholder?: string` (`'Search actions…'`), `actionsLabel?: string` (`'Actions'`), `nothingFound?: string` (`'No actions found'`): accessible names, placeholder and empty message.
- Shared dialog props: `title`, `withCloseButton` (`true`), `closeButtonLabel` (`'Close'`), `closeOnEscape` / `closeOnClickOutside` / `returnFocus` / `lockScroll` (`true`), `transition` (`'pop'`), `transitionDuration` (`200` ms), `onExited`.
- Native dialog attributes, `class`, `style`, `ref`. The dialog defaults to the accessible name `'Spotlight'` without a title; override with `aria-label`. `children` is not accepted.

## SpotlightAction

`id: string`, `label: string`, optional `description: string`, `keywords: readonly string[]`, `group: string`, `disabled: boolean`, `onTrigger: () => void`, `leftSection` and `rightSection` (`JSX.Element | (() => JSX.Element)`). Pass JSX decorations as functions, e.g. `rightSection: () => <Kbd>↵</Kbd>`, so they are created inside the mounted action after hydration. Sections are decorative, hidden from assistive technology, and must not contain interactive elements.

## Keyboard and accessibility

Search is a named combobox controlling a named listbox. Focus stays on search; `aria-activedescendant` points to the active action. Up/Down skip disabled actions and loop. Enter triggers the active action; no action is triggered until activated by arrows or pointer. Typing clears activation. Composition and modified keys do not trigger actions. Editing keys retain native behavior. Tab moves among dialog controls; actions are not tab stops. Escape requests closure through the provider's overlay order. Empty groups disappear and the empty message is a status outside the listbox.

## Styling

Root `.slp-spotlight`, with `data-status`. Slots: `spotlight-content`, `spotlight-header`, `spotlight-title`, `spotlight-close`, `spotlight-body`, `spotlight-search`, `spotlight-actions`, `spotlight-group`, `spotlight-group-label`, `spotlight-action`, `spotlight-action-body`, `spotlight-action-label`, `spotlight-action-description`, `spotlight-action-left-section`, `spotlight-action-right-section`, `spotlight-empty`. Action slots carry `data-value` (action ID), `data-active` and `data-disabled` as applicable. No public custom properties. Rules live in `@layer slopkit.components`; override with unlayered selectors.
