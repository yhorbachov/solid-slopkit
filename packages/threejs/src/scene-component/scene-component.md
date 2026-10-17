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

- **Instance:** constructed once, with `new Class(...args)`. `args` is read once.
- **Parent:** the Instance of the Scene component around it, or the Canvas's scene at the top. A Scene component outside a Canvas throws.
- **Ref:** called once the Instance's props are applied and it is attached, with the Instance. It takes a variable (`let mesh!: THREE.Mesh; <Mesh ref={mesh} />`), a callback, or an array of them. Children attach after it, so read their effects later (in an effect or a Frame callback), not in the ref.
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

## Path props

A prop with one dash sets one field of the object in a property: `position-y={y()}`, `material-opacity={0.5}`, `shadow-mapSize={[2048, 2048]}`. The field gets the same copy rules as any prop, so `material-color="red"` copies into the material's `Color`. Each is its own binding: animating `position-y` writes one number per change, where `position={[0, y(), 0]}` writes all three.

- **One level:** `material-color-r` throws. Go deeper through a ref.
- **Attached later:** a Path prop is written again whenever Attach puts a new object in its property, so `material-opacity` on a `Mesh` reaches the material a child attaches after it, and the one a `<Show>` swaps in. A property that is `null` is skipped until something is attached to it.
- **Order:** with both `position` and `position-y`, the one listed later wins at mount, and after that whichever changed last.
- **Mistakes:** a property the Instance doesn't have, or a field its object doesn't have, throws (a plain record like `userData` takes new keys: `userData-id={7}`).
- **Types:** `PathProps<Instance>` types each one from the property's declared type, so `position-y="1"` is a type error. A `Mesh`'s `material` is declared as a `Material`, so `material-opacity` types but `material-color` doesn't; type the class with its material to get it: `sceneComponent(Mesh<BoxGeometry, MeshStandardMaterial>)`. TypeScript never checks a JSX attribute with a dash it doesn't know, so a misspelled Path prop such as `position-w` is caught when it runs, not by the types.

## Props

| Prop       | Type                            | Default              | Description                                             |
| ---------- | ------------------------------- | -------------------- | ------------------------------------------------------- |
| `args`     | the constructor's parameters    | `[]`                 | Constructor arguments of the Instance. Read once.       |
| `attach`   | `Attach` (`string \| AttachFn`) | by the Instance type | Where the Instance goes in its parent. Read once.       |
| `dispose`  | `boolean`                       | `true`               | `false` keeps the Instance after the component is gone. |
| `ref`      | `SceneRef<Instance>`            | —                    | Receives the Instance once it is attached.              |
| `children` | `JSX.Element`                   | —                    | Scene components that attach to this Instance.          |

Types: `SceneClass` (a constructible class), `InstanceProps<Instance>` (the Instance props), `PathProps<Instance>` (the Path props), `PropValue<V>` (what one of them accepts), `SceneComponent<C>` (what `sceneComponent(C)` returns), `SceneComponentProps<Instance, Args>`, `SceneRef<Instance>`, `Attach`, `AttachFn` (`(parent, self) => detach`).
