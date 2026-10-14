# Link state is owned by the component, in attributes a router doesn't write

A router can mark the links on a page by itself. The app's router claims every `a[href]` the runtime creates, or sets an `href` on. It then writes `data-active` on each link whose path matches the location, or is a prefix of it, and adds `aria-current="page"` to each one whose path and query match, unless the link already has an `aria-current`. It ignores the hash, so every `#id` link on a page counts as current. Query strings are ignored for `data-active` too, so with `?page=3` links every page matches. A component that keeps its own idea of which link is current then shows them all as current, to sight and to screen readers.

So a component that renders links, or an element that can be a link, owns their state:

- **The state attribute is `data-current`**, never `data-active` or `data-pending`, which the router sets and removes. Pagination's current page, NavLink's `active` and TableOfContents' active link use `data-current`, and Pagination uses it in its button mode too, so one selector works in both.
- **Every link says whether it's current:** `aria-current` with its value (`"page"`, `"location"`) on the current one and `"false"` on the others. The router leaves an `aria-current` it didn't write alone, so it adds nothing. A button that isn't a link only gets `aria-current` when it's current.
- The links stay links the router manages. Navigation through them still goes through the router.

`test/link-claims.ts` claims links the way the router does in the worst case, marking every one as current. Each of these components has a test that renders under it.

## Considered Options

- **Opt the links out of the router** with an attribute it skips (`target="_self"`, the browser's default, or `rel="external"`): rejected. The router also stops handling clicks on those links, so Pagination's pages would load as whole documents instead of navigating in the app. TableOfContents used `target="_self"` briefly, because its links only jump within the page, and moved to the rule above for consistency.
- **Leave the state to the router:** rejected. It only knows paths, not a selected page passed as `value`, a section scrolled into view, or which NavLink the app considers current.
- **Render links where the runtime doesn't claim them** (today, an element made through a spread isn't): rejected. It depends on how the runtime happens to create elements, which can change.

## Consequences

- `data-current` replaces `data-active` in Pagination's, NavLink's and TableOfContents' styling contract (ADR 0013).
- Button and ActionIcon still mark `active` (their pressed look) with `data-active`. Rendered as a link through `as`, a router can set or remove it. They need the same treatment under another attribute name, which is not decided yet.
