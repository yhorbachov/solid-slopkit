# Themes are CSS selectors; color scheme is separate; no JS theme object

A theme is a CSS rule, `[data-slp-theme="<name>"]` (or `:root` for the default), that sets the design tokens. It can apply to any subtree, and themes nest. The light/dark **color scheme** is separate from the theme and uses the platform's `color-scheme` property:

- `slopkit.base` sets `:root { color-scheme: light dark }`, which follows the OS with no JS and no flash. `[data-slp-color-scheme="light" | "dark"]` forces one scheme.
- A theme that supports both schemes writes its tokens with `light-dark()` and must not set `color-scheme`, so the user's choice applies.
- A theme that supports one scheme sets `color-scheme` itself. It lives in `slopkit.themes`, a later layer than the toggle, so it pins the scheme. That way native UI like scrollbars and form popups never disagrees with the surfaces.
- Component CSS only reads tokens. It never uses `light-dark()` or hard-coded colors, so every component follows whatever the theme does.

`<SlopkitUi>` provides `useColorScheme()`. It returns the stored preference (`light | dark | auto`) and the scheme actually showing, persists the choice, and uses `useHead` to render a small pre-hydration script so a saved choice applies before first paint.

Tokens are CSS-only. There is no Mantine-style `createTheme()` object for colors, radius or spacing. Anything CSS can express is themed in CSS. There are no app-wide default props either: an app that wants every `Button` small writes a one-line wrapper component.

## Considered Options

- **Mantine's model** (one theme in JS via `createTheme`, plus a global color scheme): rejected because it puts tokens in JS, needs the provider to render them into CSS, and can't scope a different theme to a subtree.
- **daisyUI's model** (dark mode is just another theme): the base of this design, but on its own it can't follow the OS without JS. `light-dark()` adds that.
