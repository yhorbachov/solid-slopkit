import { BufferGeometry, Material, Object3D } from 'three';
import { reapplyPaths } from './props';

/** Attaches `self` to `parent` by hand, returning what detaches it again. */
export type AttachFn<Parent = any, Self = any> = (parent: Parent, self: Self) => () => void;

/**
 * Where an Instance goes in its parent: a property path (`'fog'`, `'material.map'`, `'material.0'`) or a function.
 * Without one, an `Object3D` is added as a child, a `BufferGeometry` goes to `geometry` and a `Material` to `material`.
 */
export type Attach<Parent = any, Self = any> = string | AttachFn<Parent, Self>;

// One property slot (an object and a key) that several Instances may claim at once, as when a `<Show>` swaps two
// materials. The slot shows the most recent claim still standing, and the value it had before any claim when none is.
// Each change writes the parent's Path props through that slot again (`material-opacity` onto the new material).
interface Slot {
  original: unknown;
  claims: unknown[];
}

const slots = new WeakMap<object, Map<PropertyKey, Slot>>();

function claim(target: Record<PropertyKey, unknown>, key: PropertyKey, value: unknown): () => void {
  let byKey = slots.get(target);
  if (!byKey) slots.set(target, (byKey = new Map()));
  let slot = byKey.get(key);
  if (!slot) byKey.set(key, (slot = { original: target[key], claims: [] }));
  const entry = { value };
  slot.claims.push(entry);
  target[key] = value;
  reapplyPaths(target, key);

  return () => {
    const current = slot!;
    current.claims.splice(current.claims.indexOf(entry), 1);
    const top = current.claims.at(-1) as { value: unknown } | undefined;
    target[key] = top ? top.value : current.original;
    if (!top) byKey!.delete(key);
    reapplyPaths(target, key);
  };
}

function attachToPath(parent: unknown, path: string, self: unknown): () => void {
  const keys = path.split('.');
  const last = keys.pop()!;
  let target = parent as Record<string, unknown>;
  for (const key of keys) {
    const next = target[key];
    if (next === null || typeof next !== 'object') {
      throw new Error(`Can't attach to "${path}": "${key}" is ${next === null ? 'null' : typeof next} on the parent.`);
    }
    target = next as Record<string, unknown>;
  }
  return claim(target, last, self);
}

/** Attaches `self` to `parent` and returns the detach, which restores what was there before. */
export function attach(parent: unknown, self: unknown, how: Attach | undefined): () => void {
  if (typeof how === 'function') return how(parent, self);
  if (typeof how === 'string') return attachToPath(parent, how, self);

  if (self instanceof Object3D) {
    if (!(parent instanceof Object3D)) {
      throw new Error(`Can't add ${self.type} to a parent that isn't an Object3D. Pass \`attach\` to say where it goes.`);
    }
    parent.add(self);
    return () => parent.remove(self);
  }
  if (self instanceof BufferGeometry) return attachToPath(parent, 'geometry', self);
  if (self instanceof Material) return attachToPath(parent, 'material', self);

  const name = (self as { constructor?: { name?: string } })?.constructor?.name ?? typeof self;
  throw new Error(`${name} has no default place in its parent. Pass \`attach\` with a property path or a function.`);
}
