# Scene components

A Scene component wraps one three.js class and manages its Instance: it constructs it, attaches it to its parent, and detaches and disposes it with its owner. `sceneComponent(Class)` makes one for any class.

```tsx
import { sceneComponent } from '@solid-slopkit/threejs';
```

## Usage

```tsx
import { Canvas, sceneComponent } from '@solid-slopkit/threejs';
import * as THREE from 'three';

const Mesh = sceneComponent(THREE.Mesh);
const BoxGeometry = sceneComponent(THREE.BoxGeometry);
const MeshStandardMaterial = sceneComponent(THREE.MeshStandardMaterial);

<Canvas>
  <Mesh>
    <BoxGeometry args={[1, 1, 1]} />
    <MeshStandardMaterial />
  </Mesh>
</Canvas>;
```

- **Instance:** constructed with `new Class(...args)`, and constructed again when `args` changes (see Rebuild).
- **Parent:** the Instance of the Scene component around it, or the Canvas's scene at the top. A Scene component outside a Canvas throws.
- **Ref:** called once the Instance's props are applied and it is attached, with the Instance. It takes a variable (`let mesh!: THREE.Mesh; <Mesh ref={mesh} />`), a callback, or an array of them. Children attach after it, so read their effects later (in an effect or a Frame callback), not in the ref. After a Rebuild it is called again with the new Instance, once the children have moved to it, so a variable ref always holds the current one.
- **Disposal:** when its owner is disposed (a `<Show>` turns false, a `<For>` drops its item, the Canvas goes), the Instance is detached and its `dispose()` is called, if it has one. Pass `dispose={false}` to keep an Instance you hold on to elsewhere.
- **Children:** Scene components inside it attach to its Instance. The scene is part of the component tree, so `<Show>`, `<For>`, context and your own components work inside it.

## Attach

How an Instance joins its parent:

| Instance           | Default                                                      |
| ------------------ | ------------------------------------------------------------ |
| an `Object3D`      | `parent.add(instance)`; the parent must be an `Object3D` too |
| a `BufferGeometry` | assigned to `parent.geometry`                                |
| a `Material`       | assigned to `parent.material`                                |
| anything else      | none: pass `attach`, or it throws                            |

`attach` overrides the default. Read once.

- **A property path:** `attach="fog"` on a `Fog` inside the Canvas sets `scene.fog`; `attach="material.map"` on a `Texture` inside a `Mesh` sets `mesh.material.map`. A number in the path indexes an array: `attach="material.1"`. Every key before the last must lead to an object, or it throws.
- **A function:** `attach={(parent, self) => { …; return () => { … } }}` attaches by hand and returns what detaches.

Detaching restores what was there before. When several Instances claim one property, as with two materials behind `<Show>`s, the property holds the most recent claim still standing, and its original value once none is: a `Mesh`'s material goes back to the `MeshBasicMaterial` it was constructed with.

## Rebuild

Many three.js classes take their configuration only in the constructor (a `BoxGeometry`'s size), so a change to `args` rebuilds the Instance: `<BoxGeometry args={[width(), 1, 1]} />`.

1. A new Instance is constructed from the new `args`, and the old one is disposed (unless `dispose={false}`).
2. The current props are applied to the new one.
3. It takes the old one's place: the same position among its parent's children, or the same claim on the property it was attached to (a claim made after it still wins).
4. The children move to it, in order. Their components don't run again, so their state, effects and refs survive.
5. The ref is called with it.

`args` is compared by value, so `args={[1, 1, 1]}` re-evaluated with the same numbers is not a change. A Rebuild costs a new Instance and its GPU upload, so animate through props, not `args`.

## Instance props

Every prop that isn't one of the component's own (below) sets the Instance's property of the same name: `<Mesh position={[0, 1, 0]} visible={shown()} />`. Each prop is its own binding, so a change re-runs only that prop's write, and props are applied before the Instance is attached and its ref runs. Which props a component has is read once; their values are reactive.

A property that holds a math object (one with `set`: `Vector3`, `Euler`, `Quaternion`, `Color`, `Layers`, `Matrix4`, …) is copied into, never replaced, so code that holds `mesh.position` keeps seeing the current value:

| Value                      | Write                                                           | Example                                                                          |
| -------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| anything for a `Color`     | `color.set(value)`: a CSS color string, a hex number, a `Color` | `color="hotpink"`, `emissive={0x111111}`                                         |
| an array                   | `set(...value)`                                                 | `position={[0, 1, 0]}`, `rotation={[0, Math.PI, 0, 'YXZ']}`, `color={[1, 0, 0]}` |
| a number                   | `setScalar(value)`, or `set(value)` when there's no `setScalar` | `scale={2}`, `layers={1}`                                                        |
| an object of the same type | `copy(value)`                                                   | `quaternion={q}`                                                                 |
| `undefined`                | nothing: the math object keeps its value                        |                                                                                  |

Any other value is assigned: `visible={false}`, `roughness={0.5}`, `material={shared}`. The types follow the same rules (`PropValue<V>`): `position` takes a `Vector3` or `[x, y, z]`, never a string, and methods aren't props.

## Partial values

An object literal given for a property that holds an instance of a class writes only the fields it lists, with the same rules as any prop, at any depth:

```tsx
<T.Mesh position={{ y: y() }} />
<T.DirectionalLight shadow={{ mapSize: [2048, 2048], camera: { far: 50 } }} />
<T.Mesh material={{ opacity: 0.5, transparent: true }}>
  <T.MeshStandardMaterial />
</T.Mesh>
```

- **Fields:** each field gets the copy rules (`mapSize: [2048, 2048]` copies into the `Vector2`, `color: 'red'` into the `Color`), and a nested object literal is a Partial value of its own. Fields the literal leaves out keep their values.
- **Attached later:** a Partial value is written again whenever Attach puts a new object in its property, so `material={{ opacity: 0.5 }}` on a `Mesh` reaches the material a child attaches after it, and the one a `<Show>` swaps in. A property that is `null` is skipped until something is attached to it.
- **Missing fields:** a field the current object doesn't have is skipped, never added: before its child attaches, a `Mesh` holds a `MeshBasicMaterial`, which has no `emissive`.
- **Not a Partial value:** an instance of a class is assigned or copied as usual (`material={shared}`, `position={new Vector3()}`), and a property that holds an object literal itself, like `userData`, is replaced as a whole.
- **Types:** `PartialValue<O>` types the fields from the property's declared type, so `position={{ w: 1 }}` and `position={{ y: '1' }}` are type errors, at any depth. A `Mesh`'s `material` is declared as a `Material`, so `material={{ opacity }}` types but `material={{ color }}` doesn't; type the class with its material to get it: `sceneComponent(Mesh<BoxGeometry, MeshStandardMaterial>)`.

## Props

| Prop       | Type                            | Default              | Description                                                  |
| ---------- | ------------------------------- | -------------------- | ------------------------------------------------------------ |
| `args`     | the constructor's parameters    | `[]`                 | Constructor arguments of the Instance. A change rebuilds it. |
| `attach`   | `Attach` (`string \| AttachFn`) | by the Instance type | Where the Instance goes in its parent. Read once.            |
| `dispose`  | `boolean`                       | `true`               | `false` keeps the Instance after the component is gone.      |
| `ref`      | `SceneRef<Instance>`            | —                    | Receives the Instance once attached, and after each Rebuild. |
| `children` | `JSX.Element`                   | —                    | Scene components that attach to this Instance.               |

Types: `SceneClass` (a constructible class), `InstanceProps<Instance>` (the Instance props), `PartialValue<O>` (a Partial value for an `O`), `PropValue<V>` (what one of them accepts), `SceneComponent<C>` (what `sceneComponent(C)` returns), `SceneComponentProps<Instance, Args>`, `SceneRef<Instance>`, `Attach`, `AttachFn` (`(parent, self) => detach`).
