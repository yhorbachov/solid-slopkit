# NavLink

A link in a navigation list, such as a sidebar, with the current page drawn as active.

```tsx
import { NavLink } from '@solid-slopkit/ui';
```

## Usage

```tsx
<nav aria-label="Main">
  <NavLink href="/" label="Dashboard" leftSection={<Gauge />} active={location.pathname === '/'} />
  <NavLink href="/inbox" label="Inbox" description="Messages from your team" rightSection={<Badge>3</Badge>} />
  <NavLink as={A} href="/reports" label="Reports" />
  <NavLink label="Settings" defaultOpened>
    <NavLink href="/settings/profile" label="Profile" />
    <NavLink href="/settings/security" label="Security" />
  </NavLink>
</nav>
```

- **Row:** as wide as its container. `label`, an optional smaller `description` under it, `leftSection` (usually an icon) and `rightSection` (such as a Badge). Text wraps unless `noWrap`, which cuts it with an ellipsis.
- **Current page:** `active` draws it in `color` (`primary` by default) and sets `aria-current="page"`. NavLink doesn't know the route; set `active` from your router. `variant` is `soft` (tinted, default) or `solid` (filled).
- **Link:** an `a` by default; `as` renders a router's link component, which gets `href` and the rest. `disabled` removes the `href`, keeps `role="link"` with `aria-disabled="true"`, and ignores clicks.
- **Parent:** passing children makes it a `button` with `aria-expanded` that shows and hides those nested NavLinks, indented under it, with a chevron that turns as it opens. A parent doesn't navigate. Uncontrolled with `defaultOpened` (read once), controlled with `opened` + `onChange(opened)`. Whether it has children is read once. Closed children stay in the DOM but out of the tab order. `chevron` replaces the chevron; `disableChevronRotation` keeps it still. A click handler that calls `preventDefault()` keeps it as it is.
- Put the links in a `nav` (with `aria-label` when the page has several). Other props go to the link, or to a parent's button.

## Props

| Prop                     | Type                        | Default     | Description                                    |
| ------------------------ | --------------------------- | ----------- | ---------------------------------------------- |
| `label`                  | `JSX.Element`               |             | The link's text.                               |
| `description`            | `JSX.Element`               |             | A second, smaller line under the label.        |
| `leftSection`            | `JSX.Element`               |             | Content before the label.                      |
| `rightSection`           | `JSX.Element`               |             | Content after the label.                       |
| `active`                 | `boolean`                   | `false`     | Marks the current page.                        |
| `variant`                | `'soft' \| 'solid'`         | `'soft'`    | How the active link is drawn.                  |
| `color`                  | `SlopColor`                 | `'primary'` | The active link's color role.                  |
| `disabled`               | `boolean`                   | `false`     | Keeps it from being followed or opened.        |
| `noWrap`                 | `boolean`                   | `false`     | Cuts long text with an ellipsis.               |
| `as`                     | `ValidComponent`            | `'a'`       | Renders another link component.                |
| `children`               | `JSX.Element`               |             | Nested NavLinks, which make it a parent.       |
| `opened`                 | `boolean`                   |             | Whether a parent's children show (controlled). |
| `defaultOpened`          | `boolean`                   | `false`     | Whether they show at first.                    |
| `onChange`               | `(opened: boolean) => void` |             | Called when a parent is pressed.               |
| `chevron`                | `JSX.Element`               |             | Replaces a parent's chevron.                   |
| `disableChevronRotation` | `boolean`                   | `false`     | Keeps the chevron still.                       |

## Styling

Component rules live in `@layer slopkit.components`, so unlayered CSS wins.

- Root class: `.slp-nav-link` (the link, or a parent's button), with `data-active`, `data-variant`, `data-color`, `data-disabled`, `data-no-wrap` and, on a parent, `data-opened`.
- Slots: `nav-link-left-section`, `nav-link-body` (holding `nav-link-label` and `nav-link-description`), `nav-link-right-section`, `nav-link-chevron` (parent only).
- A parent's children follow it in `.slp-nav-link-children` (`data-opened`), whose `nav-link-children-body` slot sets the indent (`padding-inline-start`, `1rem`).
- Custom properties, on the nav link or an ancestor: `--slp-nav-link-color` (the active color) and `--slp-nav-link-content` (the text on a `solid` active link).
