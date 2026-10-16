# The provider owns per-tree state; imperative APIs are client-only facades

`<SlopkitUi>` is required at the root of every app. It owns all runtime state that would otherwise be module-global: the generated-style registry, the locale used for `Intl` formatting, the color scheme preference, the notification and modal stores, and the order of nested overlays (which one Escape or an outside click closes; the browser's top layer owns stacking, see ADR 0011). On the server, each request renders its own provider, so none of this leaks between requests.

Imperative APIs follow one pattern. The real store lives in the provider and is reached with a hook (`useNotifications()`). A module-level facade (`notifications.show()`) forwards to the most recently mounted provider, so code outside components, such as a fetch wrapper's error handler, can still show a toast. On the server the facade does nothing, with a dev-mode warning.

## Considered Options

- **Global module stores:** the most convenient, but on the server they are shared across requests, and two roots (tests, micro-frontends) share one queue.
- **Provider-scoped only:** correct, but code outside the component tree can't show a notification unless the app passes the hook's result into it.

## Consequences

- Built-in text (accessible names like "Close" or "Next page", empty-state messages) is passed as component props with English defaults. The provider holds no translation dictionary.
