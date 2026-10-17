import { onCleanup, untrack, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { attach, type Attach } from './attach';
import { ParentContext } from './parent';

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

/** A component that wraps one three.js class and manages its Instance. */
export type SceneComponent<C extends SceneClass> = (
  props: SceneComponentProps<InstanceType<C>, ConstructorParameters<C>>,
) => JSX.Element;

function callRef<Instance>(ref: SceneRef<Instance>, instance: Instance) {
  if (typeof ref === 'function') (ref as (instance: Instance) => void)(instance);
  else if (Array.isArray(ref)) for (const each of ref) callRef(each, instance);
}

/**
 * Makes a Scene component for a three.js class: an add-on from `three/examples`, a class of your own, or any class
 * the `T` namespace doesn't have. The component constructs its Instance from `args`, attaches it to the Instance of
 * the Scene component around it (or to the Canvas's scene), and on disposal detaches it and calls its `dispose()`.
 */
export function sceneComponent<C extends SceneClass>(Class: C): SceneComponent<C> {
  const Component: SceneComponent<C> = (props) => {
    const parent = useContext(ParentContext);
    const instance = untrack(() => new Class(...(props.args ?? []))) as InstanceType<C>;
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
