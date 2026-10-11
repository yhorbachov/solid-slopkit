---
name: slopkit-theming
description: Theme @solid-slopkit/ui apps — change the default look, write a new theme, scope a theme to part of the page, add a light/dark toggle, and customize one component with CSS. Use when changing colors, radius, sizes or fonts, or adding dark mode.
---

# Theming and color scheme in @solid-slopkit/ui

Everything visual in this library comes from CSS custom properties, the **tokens** (`--slp-*`). Components only read tokens, so a theme is just CSS that sets them. There is no JS theme object and nothing to pass to the provider. The light/dark **color scheme** is separate from the theme: a theme supplies values for one or both schemes, and the user's preference picks between them.

Component references (props, selectors, CSS variables) are in `node_modules/@solid-slopkit/ui/dist/source/llms.md`.

## Setup

```tsx
import { SlopkitUi } from '@solid-slopkit/ui';
import '@solid-slopkit/ui/styles/slopkit.css'; // layers, palettes, base styles, color scheme
import '@solid-slopkit/ui/styles/default-theme.css'; // the default theme, light and dark
import './theme.css'; // your overrides and themes, after the two above

export function Root() {
  return <SlopkitUi>{/* app */}</SlopkitUi>;
}
```

The stylesheets declare these cascade layers, in order: `slopkit.reset`, `slopkit.base`, `slopkit.themes`, `slopkit.components`, `slopkit.utilities`. Unlayered CSS beats every layer whatever its specificity, so your own rules always win without `!important`.

## The tokens

| Token                                  | What it is                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `--slp-color-base-100`, `-200`, `-300` | Surfaces: the page, then slightly darker (light) or lighter (dark) layers.                                     |
| `--slp-color-base-content`             | Text on the base surfaces.                                                                                     |
| `--slp-color-<role>`                   | The eight **color roles**: `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`. |
| `--slp-color-<role>-content`           | Text that stays readable on that role's color. Always set it together with the role.                           |
| `--slp-radius-field`                   | Corner radius of buttons and inputs.                                                                           |
| `--slp-radius-box`                     | Corner radius of cards and dialogs.                                                                            |
| `--slp-radius-selector`                | Corner radius of checkboxes and toggles.                                                                       |
| `--slp-size-field`                     | Unit of control heights. A medium Button is 8 units tall.                                                      |
| `--slp-spacing`                        | Unit of the layout components' spacing props: `p={4}` is 4 units.                                              |
| `--slp-border`                         | Border width.                                                                                                  |
| `--slp-depth`                          | `0` for flat controls, `1` for subtle shadows and highlights.                                                  |
| `--slp-font-family`                    | Body font. Set in `slopkit.css`, not in the theme.                                                             |

A theme sets solid colors only. Components derive soft, outline, hover and pressed tints from each role and its content color with `color-mix()`.

The `color` prop of a component takes a color role and nothing else. There are no palette names or raw colors in props.

## Change the default look

Override tokens in unlayered CSS. Set only what you change; the rest keeps the default theme's values.

```css
:root {
  --slp-color-primary: light-dark(#6741d9, #9775fa);
  --slp-color-primary-content: light-dark(#ffffff, #1f1f1f);
  --slp-radius-field: 0.5rem;
  --slp-depth: 1;
}
```

Use `light-dark(<light>, <dark>)` for any color that should differ between schemes, as the default theme does. A plain value applies to both.

## Write a named theme

A theme is a rule on `[data-slp-theme="<name>"]`. Put it in the `slopkit.themes` layer, after the default theme's import, and set `data-slp-theme` on `<html>` for the whole page or on any element for a subtree. Themes nest: the innermost one wins for its subtree.

```css
@layer slopkit.themes {
  [data-slp-theme='ocean'] {
    --slp-color-base-100: light-dark(#f8fbff, #0f1a24);
    --slp-color-base-200: light-dark(#eef5fc, #16232f);
    --slp-color-base-300: light-dark(#dce9f5, #1f3040);
    --slp-color-base-content: light-dark(#0f1a24, #d6e6f5);
    --slp-color-primary: light-dark(#1971c2, #4dabf7);
    --slp-color-primary-content: light-dark(#ffffff, #0f1a24);
    /* …every role you want to differ from the default theme */
  }
}
```

```tsx
<section data-slp-theme="ocean">…</section>
```

Tokens the theme leaves out are inherited from the enclosing theme, usually the default one on `:root`.

### Both schemes, or one

- **A theme for both schemes** writes its colors with `light-dark()` and must **not** set `color-scheme`. The user's preference then picks the scheme.
- **A theme for one scheme** writes plain colors and sets `color-scheme: light` or `color-scheme: dark` in its rule. Inside `slopkit.themes` that wins over the preference, so the surfaces, native scrollbars and form controls never disagree. The user's toggle has no effect under it, so disable or hide your toggle while that theme is active.

```css
@layer slopkit.themes {
  [data-slp-theme='paper'] {
    color-scheme: light;
    --slp-color-base-100: #fffdf7;
    /* … */
  }
}
```

Check contrast for every role against its content color, and for `base-content` against each base color, in each scheme the theme supports. Aim for 4.5:1 for text.

## Color scheme

By default the page follows the OS: `slopkit.css` sets `color-scheme: light dark` on `:root`, and `light-dark()` resolves against it with no JS.

`useColorScheme()` gives the user a choice that persists:

```tsx
import { Button, useColorScheme } from '@solid-slopkit/ui';

function SchemeToggle() {
  const scheme = useColorScheme();
  return (
    <Button variant="ghost" shape="square" aria-label="Toggle color scheme" onClick={() => scheme.toggleColorScheme()}>
      <MoonIcon class="icon-light" />
      <SunIcon class="icon-dark" />
    </Button>
  );
}
```

- `colorScheme()` is the stored preference (`'light' | 'dark' | 'auto'`), and `resolvedColorScheme()` is the scheme it resolves to. `setColorScheme(p)`, `toggleColorScheme()` and `clearColorScheme()` change it.
- The preference is stored in localStorage (key `slp-color-scheme`, or the provider's `colorSchemeStorageKey`) and applied as `data-slp-color-scheme` on `<html>`. A head script the provider renders applies it before first paint.
- **With SSR, don't render first-paint UI from the accessors.** The server can't read localStorage, so the server render and the hydrating client both use the default, and the accessors catch up after hydration. Pick anything that must be right immediately, like the toggle's icon above, in CSS:

```css
.icon-dark {
  display: none;
}
:root[data-slp-color-scheme='dark'] .icon-light {
  display: none;
}
:root[data-slp-color-scheme='dark'] .icon-dark {
  display: inline;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-slp-color-scheme]) .icon-light {
    display: none;
  }
  :root:not([data-slp-color-scheme]) .icon-dark {
    display: inline;
  }
}
```

- `defaultColorScheme` on `<SlopkitUi>` sets the preference used when nothing is stored (default `'auto'`).
- `data-slp-color-scheme="light"` or `"dark"` on any element forces that scheme for its subtree, for example a dark hero section on a light page.

## Customize one component

Don't add a theme to restyle one component. Write unlayered CSS against its public selectors, which each component's reference lists:

- the root class, e.g. `.slp-button`;
- state and variant attributes on the root, e.g. `[data-variant='outline']`, `[data-size='lg']`;
- public CSS variables for values that feed several declarations, e.g. `--slp-button-color` and `--slp-button-content`.

```css
.slp-button[data-variant='solid'] {
  font-weight: 600;
}

.checkout .slp-button {
  --slp-button-color: #2b8a3e; /* a one-off color that isn't a color role */
  --slp-button-content: #ffffff;
}
```

Per instance, pass `class` or `style`:

```tsx
<Button style={{ '--slp-button-color': '#2b8a3e', '--slp-button-content': '#fff' }}>Pay</Button>
```

## Palettes

`slopkit.css` defines 14 palettes of 10 shades for your own CSS and themes: `--slp-gray-0` … `--slp-gray-9`, and the same for `dark`, `red`, `pink`, `grape`, `violet`, `indigo`, `blue`, `cyan`, `teal`, `green`, `lime`, `yellow` and `orange`. Components never read them.

```css
:root {
  --slp-color-accent: light-dark(var(--slp-teal-7), var(--slp-teal-4));
}
```

## Mistakes to avoid

- Setting `color-scheme` in a theme that uses `light-dark()`: it pins the scheme and the toggle stops working.
- Setting a role without its `-content` color: text on solid buttons may become unreadable.
- Hard-coding colors in component overrides instead of reading tokens: they won't follow the theme or the scheme.
- Importing a theme before `default-theme.css` and setting it on `<html>`: both rules match `<html>` with the same specificity in the same layer, so the later default theme wins. Import your themes after it.
- Reading `resolvedColorScheme()` to render markup that must be correct on first paint in an SSR app.
