import { createRenderEffect, onCleanup } from 'solid-js';
import { Color, type ColorRepresentation } from 'three';

/** Props that configure the Scene component itself rather than a property of its Instance. */
export const RESERVED_PROPS = new Set(['args', 'attach', 'dispose', 'ref', 'children']);

type Settable = { set(...args: unknown[]): unknown; setScalar?: (scalar: number) => unknown; copy?: (v: unknown) => unknown };

function isSettable(value: unknown): value is Settable {
  return value !== null && typeof value === 'object' && typeof (value as Settable).set === 'function';
}

/**
 * Writes one prop to an Instance. A property that holds a math object (anything with `set`) is copied into, never
 * replaced, so code holding that object keeps seeing the Instance's value: a `Color` takes whatever `Color.set`
 * takes, an array spreads into `set`, a number goes to `setScalar` (or `set`, for a one-argument type like `Layers`),
 * and an object of the same type is copied. `undefined` leaves a math object as it is. Anything else is assigned.
 */
export function applyProp(instance: object, key: string, value: unknown) {
  const target = instance as Record<string, unknown>;
  const current = target[key];
  if (!isSettable(current)) {
    target[key] = value;
    return;
  }
  if (value === undefined || value === current) return;
  if (current instanceof Color && !Array.isArray(value)) current.set(value as ColorRepresentation);
  else if (Array.isArray(value)) current.set(...value);
  else if (typeof value === 'number') {
    if (typeof current.setScalar === 'function') current.setScalar(value);
    else current.set(value);
  } else if (
    value !== null &&
    typeof value === 'object' &&
    value.constructor === current.constructor &&
    typeof current.copy === 'function'
  ) {
    current.copy(value);
  } else target[key] = value;
}

// The Path props bound to each Instance, by the property they go through (`material` for `material-opacity`). When
// Attach puts a new value in that property, they are written again to it.
const pathBindings = new WeakMap<object, Map<string, Set<() => void>>>();

/** Writes the Path props that go through `instance[head]` again. Attach calls it after it changes that property. */
export function reapplyPaths(instance: object, head: PropertyKey) {
  if (typeof head !== 'string') return;
  for (const reapply of pathBindings.get(instance)?.get(head) ?? []) reapply();
}

function applyPath(instance: object, key: string, head: string, field: string, value: unknown) {
  const owner = (instance as Record<string, unknown>)[head];
  // An empty slot is written once something is attached to it.
  if (owner === null) return;
  if (owner === undefined || typeof owner !== 'object') {
    throw new Error(`Can't set "${key}": "${head}" is ${owner === undefined ? 'undefined' : typeof owner} on the Instance.`);
  }
  // TypeScript doesn't check JSX attributes with a dash it doesn't know, so a misspelled field is caught here. A plain
  // record (`userData`) takes new keys.
  if (!(field in owner) && Object.getPrototypeOf(owner) !== Object.prototype) {
    throw new Error(`Can't set "${key}": ${owner.constructor.name} has no "${field}".`);
  }
  applyProp(owner, field, value);
}

function registerPath(instance: object, head: string, reapply: () => void) {
  let byHead = pathBindings.get(instance);
  if (!byHead) pathBindings.set(instance, (byHead = new Map()));
  let bindings = byHead.get(head);
  if (!bindings) byHead.set(head, (bindings = new Set()));
  bindings.add(reapply);
  onCleanup(() => bindings.delete(reapply));
}

/**
 * Binds every prop that isn't reserved to the Instance, each through its own render effect: the first write happens
 * now, so the Instance is set up before it is attached, and a change re-runs only that prop's binding. Which props
 * there are is read once; their values are reactive. A Path prop (`position-y`, `material-opacity`) sets one field of
 * the object in a property of the Instance, with the same copy rules, and is written again when Attach puts a new
 * object in that property.
 */
export function bindProps(instance: object, props: Record<string, unknown>, name: string) {
  for (const key of Object.keys(props)) {
    if (RESERVED_PROPS.has(key)) continue;
    const dash = key.indexOf('-');
    let write = (value: unknown) => applyProp(instance, key, value);
    if (dash !== -1) {
      const head = key.slice(0, dash);
      const field = key.slice(dash + 1);
      if (!head || !field || field.includes('-')) {
        throw new Error(`"${key}" isn't a Path prop: they go one level deep, like "position-y" or "material-opacity".`);
      }
      let latest: unknown;
      write = (value) => {
        latest = value;
        applyPath(instance, key, head, field, value);
      };
      registerPath(instance, head, () => applyPath(instance, key, head, field, latest));
    }
    createRenderEffect(
      // Arrays are copied here, in the tracked read, so an array from a store is never read in the apply phase.
      () => {
        const value = props[key];
        return Array.isArray(value) ? [...value] : value;
      },
      write,
      { name: `${name}.${key}` },
    );
  }
}
