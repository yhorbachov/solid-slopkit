import { createRenderEffect } from 'solid-js';
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

/**
 * Binds every prop that isn't reserved to the Instance, each through its own render effect: the first write happens
 * now, so the Instance is set up before it is attached, and a change re-runs only that prop's binding. Which props
 * there are is read once; their values are reactive.
 */
export function bindProps(instance: object, props: Record<string, unknown>, name: string) {
  for (const key of Object.keys(props)) {
    if (RESERVED_PROPS.has(key)) continue;
    createRenderEffect(
      // Arrays are copied here, in the tracked read, so an array from a store is never read in the apply phase.
      () => {
        const value = props[key];
        return Array.isArray(value) ? [...value] : value;
      },
      (value) => applyProp(instance, key, value),
      { name: `${name}.${key}` },
    );
  }
}
