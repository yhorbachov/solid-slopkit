# Overlays use the browser's top layer, not portals

Overlays render in place and are promoted to the top layer by the browser. Popovers, menus, tooltips, hover cards and combobox dropdowns use the Popover API. Modal and Drawer use a modal `<dialog>`. The notification region uses a manual popover. We don't portal into `document.body`, and we don't keep a z-index scale.

The top layer removes the stacking-context and `overflow: hidden` clipping bugs that portals exist to work around. The browser provides light dismissal and Escape. `<dialog>` makes the rest of the page inert and contains focus. And because overlay content stays in its owner's DOM subtree, it keeps that subtree's theme and color scheme (ADR 0005) and context without anything being re-provided.

`@floating-ui/dom` is still used, but only for positioning an overlay against its anchor. CSS anchor positioning can replace it once it is inside our browser baseline (ADR 0010).

## Consequences

- The provider's overlay stack shrinks to the order of nested overlays, so we know which one Escape or an outside click closes. The browser owns stacking.
- Enter and exit animations have to work with top-layer transitions (`@starting-style`, `transition-behavior: allow-discrete`, `overlay`), which the presence primitive is built around.
