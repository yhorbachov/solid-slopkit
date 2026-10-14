---
name: slopkit-spotlight
description: Add a searchable command palette with Spotlight, using controlled visibility and action data.
---

# Add a command palette

Read `dist/source/components/overlays/spotlight/spotlight.md` for the installed API (in this repository, `src/components/overlays/spotlight/spotlight.md`).

1. Render `Spotlight` inside `SlopkitUi`, where it should inherit the theme. Keep `opened` in a signal and set it false from `onClose`.
2. Give actions unique IDs, readable labels and `onTrigger` callbacks. Use `group` for headings, `description` for visible context and `keywords` for extra search terms. Disabled actions remain visible but cannot trigger.
3. Open from an app button. If the app needs a keyboard shortcut, register it in the app's lifecycle, remove it on cleanup, and respect editable targets, composition and already-handled events.
4. Use `query` and `onQueryChange` together for controlled search. Otherwise search persists across openings. Clear the controlled query when the app wants fresh search.
5. Pass JSX sections as functions (`rightSection: () => <Kbd>↵</Kbd>`) so they render inside the mounted action after hydration. Keep sections decorative. Do not place buttons or links inside action sections. Customize with `.slp-spotlight` and its documented slots, using plain CSS.
6. Override built-in text through props for the app's language. Use `title` or `aria-label` for the dialog name.
7. Leave `closeOnActionTrigger` enabled for navigation commands. Disable it for repeatable commands; the app owns async progress and errors.

Verify keyboard activation, disabled actions, focus restoration, empty results and light/dark styling in the app.
