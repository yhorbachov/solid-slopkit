import { createEffect, createMemo, createRenderEffect, onCleanup, untrack, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { Color, ColorRepresentation } from 'three';
import { attach, type Attach, type Attachment } from './attach';
import { ParentContext } from './parent';
import { bindProps, copyPlain } from './props';

/** A three.js class a Scene component can wrap. */
export type SceneClass = new (...args: any[]) => object;

/** A ref to an Instance: a variable (`ref={mesh}`), a callback, or an array of them. */
export type SceneRef<Instance> = Instance | ((instance: Instance) => void) | undefined | SceneRef<Instance>[];

/** The props every Scene component takes. */
export interface SceneComponentProps<Instance, Args extends unknown[]> {
  /** The constructor arguments of the Instance. A change rebuilds it: a new Instance takes the old one's place. */
  args?: Args;
  /** Where the Instance goes in its parent, when the default isn't right. Read once. */
  attach?: Attach<any, Instance>;
  /** Pass `false` to keep the Instance alive after the component is gone, instead of disposing it. */
  dispose?: boolean;
  /** Receives the Instance once it is attached, and again with the new one after each Rebuild. */
  ref?: SceneRef<Instance>;
  /** Scene components that attach to this Instance. */
  children?: JSX.Element;
}

type Method = (...args: any[]) => any;

type FieldKeys<O> = { [F in keyof O & string]: O[F] extends Method ? never : F }[keyof O & string];

/**
 * A Partial value: an object literal listing some fields of the object a property holds, each taking what a prop for
 * it would take, at any depth. Only the fields it lists are written.
 */
export type PartialValue<O> = { [F in FieldKeys<O>]?: PropValue<O[F]> };

/**
 * What a prop for one property of an Instance accepts: for a `Color`, anything `Color.set` takes; for another math
 * object, the object, its `set` arguments as an array, and a number when it has `setScalar` or a one-argument `set`;
 * for any other object, a Partial value too.
 */
export type PropValue<V> = V extends Color
  ? ColorRepresentation | [r: number, g: number, b: number] | PartialValue<Color>
  : V extends { set(...args: infer A): unknown }
    ?
        | V
        | A
        | (V extends { setScalar(scalar: number): unknown } ? number : A extends [infer Only] ? Only : never)
        | PartialValue<V>
    : V extends Method | readonly unknown[]
      ? V
      : V extends object
        ? V | PartialValue<V>
        : V;

type Reserved = keyof SceneComponentProps<unknown, unknown[]>;

/** A prop for every property of an Instance that isn't a method. */
export type InstanceProps<Instance> = {
  [K in keyof Instance as K extends Reserved ? never : Instance[K] extends Method ? never : K]?: PropValue<Instance[K]>;
};

/** A component that wraps one three.js class and manages its Instance. */
export type SceneComponent<C extends SceneClass> = (
  props: SceneComponentProps<InstanceType<C>, ConstructorParameters<C>> & InstanceProps<InstanceType<C>>,
) => JSX.Element;

function callRef<Instance>(ref: SceneRef<Instance>, instance: Instance) {
  if (typeof ref === 'function') (ref as (instance: Instance) => void)(instance);
  else if (Array.isArray(ref)) for (const each of ref) callRef(each, instance);
}

function sameArgs(a: unknown[], b: unknown[]) {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

/**
 * Makes a Scene component for a three.js class: an add-on from `three/examples`, a class of your own, or any class
 * the `T` namespace doesn't have. The component constructs its Instance from `args`, attaches it to the Instance of
 * the Scene component around it (or to the Canvas's scene), and on disposal detaches it and calls its `dispose()`.
 * Every other prop sets the property of the same name on the Instance, copying into math objects; an object literal
 * writes only the fields it lists. When `args` changes, a Rebuild puts a new Instance in the old one's place.
 */
export function sceneComponent<C extends SceneClass>(Class: C): SceneComponent<C> {
  const Component: SceneComponent<C> = (props) => {
    const name = Class.name;
    const parent = useContext(ParentContext);

    const args = createMemo(() => copyPlain(props.args ?? []) as unknown[], { name: `${name}.args`, equals: sameArgs });
    // A Rebuild is this memo running again. The cleanup disposes the Instance it made, before the next one is made
    // and when the component's owner is disposed.
    const instance = createMemo(
      () => {
        const made = new Class(...args()) as InstanceType<C>;
        onCleanup(() => {
          if (untrack(() => props.dispose) !== false) (made as { dispose?: () => void }).dispose?.();
        });
        return made;
      },
      { name: `${name}.instance` },
    );

    // Created before Attach, so the props are on the Instance before it joins its parent, at mount and on a Rebuild.
    // oxlint-disable-next-line solid/reactivity -- bindProps reads the accessor inside its own render effects
    bindProps(instance, props, name);

    // Attach follows the parent: a Rebuild of the parent detaches this Instance from the old one and attaches it to
    // the new one. A Rebuild of this component swaps the new Instance into the old one's place instead.
    let attachment: Attachment | undefined;
    createRenderEffect(
      () => parent(),
      (into) => {
        const current = attach(
          into,
          untrack(instance),
          untrack(() => props.attach),
        );
        attachment = current;
        return () => {
          current.detach();
          if (attachment === current) attachment = undefined;
        };
      },
      { name: `${name}.attach` },
    );
    createRenderEffect(
      () => instance(),
      (next) => attachment?.swap(next),
      { name: `${name}.swap`, defer: true },
    );

    // The ref gets the Instance at mount, and after a Rebuild once the children have moved to the new one.
    callRef(
      untrack(() => props.ref),
      untrack(instance),
    );
    createEffect(
      () => instance(),
      (next) =>
        callRef(
          untrack(() => props.ref),
          next,
        ),
      { name: `${name}.ref`, defer: true },
    );

    return <ParentContext value={instance}>{props.children}</ParentContext>;
  };
  Object.defineProperty(Component, 'name', { value: Class.name });
  return Component;
}
