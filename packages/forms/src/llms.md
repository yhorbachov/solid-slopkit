# @solid-slopkit/forms

Schema-driven form state for SolidJS 2.x: a Solid store is the model, rules are attached to paths, and a field tree exposes every field's state as signals. It does not depend on `@solid-slopkit/ui`, but `bind()` produces exactly the props `@solid-slopkit/ui` inputs take.

Before writing a form, read the task guide at `node_modules/@solid-slopkit/forms/skills/forms/SKILL.md`: the rules that prevent the usual mistakes, and a first form. Each link below is a reference for one area. Paths are relative to this file.

## Setup

It is installed from a GitHub Release tarball, not from npm; once installed, the package name is `@solid-slopkit/forms`:

```bash
pnpm add solid-js @solidjs/web https://github.com/yhorbachov/solid-slopkit/releases/download/v<version>/solid-slopkit-forms-<version>.tgz
```

```ts
import { form, bind, control, submit, required, email } from '@solid-slopkit/forms';
import { createStore } from 'solid-js'; // the model is a Solid store
```

## API

Entry points: `form(model, setModel, schemaOrFn?)`, `submit(f, handler)`, `bind(f)`, `bind.text(f)`, `bind.checked(f)`, `control(f)`, `control.number(f)`, `control.checkbox(f)`, `control.select(f)`, `schema(fn)`.

Validators (attach to a path): `required`, `min`, `max`, `minLength`, `maxLength`, `email`, `pattern`, `validate`, `validateAsync`, `validateStandardSchema`; build a failure with `error(kind, message?)`.

Conditions: `disabled`, `hidden`, `readonly` (path, optional predicate over the context).

Combinators: `apply`, `applyWhen`, `applyWhenValue`, `applyEach`.

Metadata: `metadata`, `createMetadataKey`, and the keys `MIN`, `MAX`, `MIN_LENGTH`, `MAX_LENGTH`, `PATTERN`, `REQUIRED`.

Types: `Field`, `FieldState`, `SignalForm`, `SubmitHandler`, `Schema`, `SchemaFn`, `SchemaOrFn`, `SchemaPath`, `FieldContext`, `ValidationError`, `Condition`, `MetadataKey`, `StandardSchemaV1`, `ValueBinding`, `TextBinding`, `CheckedBinding`, and the `*ControlProps` of the native adapters.

## References

- [Binding](guides/binding.md): `bind`, `bind.text`, `bind.checked`, `control`; which field type fits which component.
- [Validation](guides/validation.md): validators, custom and cross-field rules, errors, Standard Schema.
- [Conditions and combinators](guides/conditions.md): `disabled` / `hidden` / `readonly`, `schema`, `apply`, `applyWhen`, `applyEach`.
- [Submit and async](guides/submit-and-async.md): `submit`, `$submitting`, `validateAsync`, `$pending`.
- [Metadata](guides/metadata.md): `metadata`, `$metadata`, the built-in keys, your own keys.
