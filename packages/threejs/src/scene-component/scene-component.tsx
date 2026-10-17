import { onCleanup, untrack, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { Color, ColorRepresentation, Object3D } from 'three';
import { attach, type Attach } from './attach';
import { ParentContext } from './parent';
import { bindProps } from './props';

/** A three.js class a Scene component can wrap. */
export type SceneClass = new (...args: any[]) => object;

/** A ref to an Instance: a variable (`ref={mesh}`), a callback, or an array of them. */
export type SceneRef<Instance> = Instance | ((instance: Instance) => void) | undefined | SceneRef<Instance>[];

/** The props every Scene component takes. */
export interface SceneComponentProps<Instance, Args extends unknown[]> {
  /** The constructor arguments of the Instance. Read once. */
  args?: Args;
  /** Where the Instance goes in its parent, when the default isn't right. Read once. */
  attach?: Attach<any, Instance>;
  /** Pass `false` to keep the Instance alive after the component is gone, instead of disposing it. */
  dispose?: boolean;
  /** Receives the Instance once it is attached. */
  ref?: SceneRef<Instance>;
  /** Scene components that attach to this Instance. */
  children?: JSX.Element;
}

/**
 * What a prop for one property of an Instance accepts: for a `Color`, anything `Color.set` takes; for another math
 * object, the object, its `set` arguments as an array, and a number when it has `setScalar` or a one-argument `set`.
 */
export type PropValue<V> = V extends Color
  ? ColorRepresentation | [r: number, g: number, b: number]
  : V extends { set(...args: infer A): unknown }
    ? V | A | (V extends { setScalar(scalar: number): unknown } ? number : A extends [infer Only] ? Only : never)
    : V;

type Reserved = keyof SceneComponentProps<unknown, unknown[]>;

/** A prop for every property of an Instance that isn't a method. */
export type InstanceProps<Instance> = {
  [K in keyof Instance as K extends Reserved ? never : Instance[K] extends (...args: any[]) => any ? never : K]?: PropValue<
    Instance[K]
  >;
};

type Method = (...args: any[]) => any;

// The object a Path prop goes through: a property's type without null, arrays (a Mesh's material can be an array),
// functions and other Object3Ds (`parent` and `children` aren't paths).
type PathTarget<V> = Exclude<V, null | undefined | readonly unknown[] | Object3D | Method> & object;

type FieldKeys<O> = { [F in keyof O & string]: O[F] extends Method ? never : F }[keyof O & string];

type PathKeys<Instance> = {
  [K in keyof Instance & string]: [PathTarget<Instance[K]>] extends [never]
    ? never
    : `${K}-${FieldKeys<PathTarget<Instance[K]>>}`;
}[keyof Instance & string];

type PathValue<Instance, P> = P extends `${infer K}-${infer F}`
  ? K extends keyof Instance
    ? F extends keyof PathTarget<Instance[K]>
      ? PropValue<PathTarget<Instance[K]>[F]>
      : never
    : never
  : never;

/**
 * A Path prop for every field of every object-valued property of an Instance, one level deep: `position-y`,
 * `material-opacity`, `shadow-mapSize`. They follow the property's declared type: a `Mesh`'s `material` is a
 * `Material`, so `material-color` needs a `Mesh` typed with its material (`sceneComponent(Mesh<BoxGeometry,
 * MeshStandardMaterial>)`).
 */
export type PathProps<Instance> = { [P in PathKeys<Instance>]?: PathValue<Instance, P> };

/** A component that wraps one three.js class and manages its Instance. */
export type SceneComponent<C extends SceneClass> = (
  props: SceneComponentProps<InstanceType<C>, ConstructorParameters<C>> &
    InstanceProps<InstanceType<C>> &
    PathProps<InstanceType<C>>,
) => JSX.Element;

function callRef<Instance>(ref: SceneRef<Instance>, instance: Instance) {
  if (typeof ref === 'function') (ref as (instance: Instance) => void)(instance);
  else if (Array.isArray(ref)) for (const each of ref) callRef(each, instance);
}

/**
 * Makes a Scene component for a three.js class: an add-on from `three/examples`, a class of your own, or any class
 * the `T` namespace doesn't have. The component constructs its Instance from `args`, attaches it to the Instance of
 * the Scene component around it (or to the Canvas's scene), and on disposal detaches it and calls its `dispose()`.
 * Every other prop sets the property of the same name on the Instance, copying into math objects.
 */
export function sceneComponent<C extends SceneClass>(Class: C): SceneComponent<C> {
  const Component: SceneComponent<C> = (props) => {
    const parent = useContext(ParentContext);
    const instance = untrack(() => new Class(...(props.args ?? []))) as InstanceType<C>;
    bindProps(instance, props, Class.name);
    const detach = attach(
      parent,
      instance,
      untrack(() => props.attach),
    );

    onCleanup(() => {
      detach();
      if (untrack(() => props.dispose) !== false) (instance as { dispose?: () => void }).dispose?.();
    });

    callRef(
      untrack(() => props.ref),
      instance,
    );
    return <ParentContext value={instance}>{props.children}</ParentContext>;
  };
  Object.defineProperty(Component, 'name', { value: Class.name });
  return Component;
}
