# Canvas

The root of a scene: a `<canvas>` that fills its parent, the scene, the default camera and the renderer. Every Scene component inside a Canvas belongs to its scene.

```tsx
import { Canvas, T, invalidate, onFrame, useCanvas } from '@solid-slopkit/threejs';
```

## Usage

```tsx
<div style={{ height: '400px' }}>
  <Canvas camera={{ fov: 50, position: [0, 2, 6] }}>
    <T.Mesh>
      <T.BoxGeometry />
      <T.MeshNormalMaterial />
    </T.Mesh>
  </Canvas>
</div>
```

- **Size:** the `<canvas>` is `display: block` at 100% of its parent's width and height, so give the parent a size. A `style` you pass is merged over those three. The Canvas measures the element with a `ResizeObserver` and sizes the renderer's drawing buffer to it (times `devicePixelRatio`), without touching the element's style.
- **Renderer:** a `WebGLRenderer` with antialiasing, unless `renderer` gives a factory. The factory is called once, after the Canvas mounts, with the `<canvas>` element. It may return a promise, for a renderer that has to be initialized first; no Frame renders until it resolves. The Canvas owns what the factory returns: it disposes it, and forces its WebGL context to be lost, when its owner is disposed. A renderer that resolves after that is disposed at once.
- **Default camera:** a `PerspectiveCamera`, set from `camera`: `fov` (default 75), `near` (0.1), `far` (1000) and `position` (`[0, 0, 5]`). It follows changes to the prop; a field left out goes back to its default.
- **Frames:** with `frameloop="demand"` (the default), a Frame renders on the animation frame after something Invalidates the Canvas, and any number of Invalidations before it render one Frame. Prop writes, Attach, detach and Rebuild Invalidate, and so do a resize, a change to `camera` and the renderer's arrival. An idle scene renders nothing. While a Frame callback is registered (see `onFrame()`), every animation frame renders one. `"always"` renders on every animation frame; `"never"` renders only through `advance()`, Frame callbacks or not, and keeps Invalidations until the mode changes.
- **Changes outside props:** after changing an Instance some other way (through a ref, in an event handler, when a texture finishes loading), call `useCanvas().invalidate()`, or the exported `invalidate()`, which Invalidates every Canvas in the page.
- **Context:** the Canvas is part of the component tree, so context from outside it reaches the components inside it.

## Props

Other props are passed to the `<canvas>` element.

| Prop        | Type                              | Default                                                  | Description                                         |
| ----------- | --------------------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| `renderer`  | `RendererFactory`                 | a `WebGLRenderer` with `antialias: true`                 | Creates the renderer for the `<canvas>`. Read once. |
| `camera`    | `DefaultCameraOptions`            | `{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }` | Settings of the default camera.                     |
| `frameloop` | `'demand' \| 'always' \| 'never'` | `'demand'`                                               | When Frames render on their own.                    |
| `style`     | `JSX.CSSProperties`               | —                                                        | Merged over the fill-the-parent style.              |
| `children`  | `JSX.Element`                     | —                                                        | The scene.                                          |

`RendererFactory` is `(canvas: HTMLCanvasElement) => CanvasRenderer | Promise<CanvasRenderer>`. `CanvasRenderer` is what the Canvas calls: `render(scene, camera)`, `setSize(width, height, updateStyle)`, `setPixelRatio(ratio)` and `dispose()`. `WebGLRenderer` fits, and so does a `WebGPURenderer` once `init()` has resolved:

```tsx
import { WebGPURenderer } from 'three/webgpu';

<Canvas
  renderer={async (canvas) => {
    const renderer = new WebGPURenderer({ canvas, antialias: true });
    await renderer.init();
    return renderer;
  }}
/>;
```

## useCanvas()

`useCanvas()` returns the `CanvasHandle` of the Canvas the calling component is inside, and throws outside one.

| Member         | Type                                | Description                                                                                                                                                                             |
| -------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scene`        | `Scene`                             | The scene every Instance in this Canvas belongs to.                                                                                                                                     |
| `camera`       | `PerspectiveCamera`                 | The default camera.                                                                                                                                                                     |
| `renderer`     | `() => CanvasRenderer \| undefined` | The renderer, once created; `undefined` before that and on the server.                                                                                                                  |
| `size`         | `() => CanvasSize`                  | The `<canvas>` element's `{ width, height }` in CSS pixels; `0 × 0` until measured.                                                                                                     |
| `time`         | `number`                            | Frame time in seconds: the sum of every Frame's `delta`. A plain number, not a signal.                                                                                                  |
| `advance()`    | `(delta?: number) => boolean`       | Runs the Frame callbacks with `delta` (seconds, default 0), then renders one Frame, whatever `frameloop` is. Returns `false`, running and rendering nothing, while there's no renderer. |
| `invalidate()` | `() => void`                        | Asks for a Frame. Needed only after changing an Instance outside its props.                                                                                                             |

`renderer` and `size` are signals: read them in JSX, a memo or an effect to follow their changes.

## onFrame()

`onFrame(callback)` registers a Frame callback on the Canvas the calling component is inside, and throws outside one. The callback runs before every Frame until the current owner is disposed, so a component's callback goes away with the component.

```tsx
function Spinning() {
  let mesh!: Mesh;
  onFrame((canvas, delta) => {
    mesh.rotation.y += delta;
    mesh.position.y = Math.sin(canvas.time);
  });
  return (
    <T.Mesh ref={mesh}>
      <T.BoxGeometry />
      <T.MeshNormalMaterial />
    </T.Mesh>
  );
}
```

- **Arguments:** a `FrameCallback` is `(canvas: CanvasHandle, delta: number) => void`. `delta` is the seconds since the previous animation frame that rendered, and 0 on the first Frame after the loop was idle, so an animation that starts doesn't jump. `canvas.time` is the sum of every `delta` so far.
- **Order:** callbacks run in registration order, and a parent component's before its children's. One registered while a Frame runs starts with the next Frame.
- **Continuous rendering:** with `frameloop="demand"`, a Canvas renders on every animation frame while any callback is registered, and goes back to rendering on demand when the last one is disposed. `"never"` stays manual: `advance(delta)` runs the callbacks with exactly that `delta`, which steps animations deterministically in tests.
- **Changing Instances:** change them directly, through a ref, as above. That runs no reactive code, and the Frame drawn right after shows it. A signal written in a callback reaches its props only when Solid flushes, after this Frame is drawn.
