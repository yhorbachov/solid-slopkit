# @solid-slopkit/forms

## 0.1.0

### Patch Changes

- efe740e: SegmentedControl mounted in a hidden container (a closed tab or modal) no longer shows its indicator sliding in from the first option once it is shown, and no longer reports an untracked read when its props come from an inline spread such as `{...bind(f.x)}`. Forms adds `bind.nativeSelect(f)` for `NativeSelect`, whose `onChange` stays the native event, and the binding guide now has a row for every ui input. The ui LLM index describes every entry and has a guide to picking a single-value input; the Select and NativeSelect references say when to choose the other.

## 0.0.1

### Patch Changes

- First release: schema-driven form state for SolidJS 2.x. A Solid store is the model, rules attach to paths, every field's state is a signal, and `bind()` returns the props `@solid-slopkit/ui` inputs take. Includes async validation and submission. Ships its LLM references and skills.
