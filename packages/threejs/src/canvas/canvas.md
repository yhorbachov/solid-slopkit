# Canvas

The root of a scene: a `<canvas>` that fills its parent, the scene, the default camera and the renderer. Every Scene component inside a Canvas belongs to its scene.

```tsx
import { Canvas, T, invalidate, useCanvas } from '@solid-slopkit/threejs';
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
- **Frames:** with `frameloop="demand"` (the default), a Frame renders on the animation frame after something Invalidates the Canvas, and any number of Invalidations before it render one Frame. Prop writes, Attach, detach and Rebuild Invalidate, and so do a resize, a change to `camera` and the renderer's arrival. An idle scene renders nothing. `"always"` renders on every animation frame; `"never"` renders only through `advance()`, and keeps Invalidations until the mode changes.
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

| Member         | Type                                | Description                                                                                                    |
| -------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `scene`        | `Scene`                             | The scene every Instance in this Canvas belongs to.                                                            |
| `camera`       | `PerspectiveCamera`                 | The default camera.                                                                                            |
| `renderer`     | `() => CanvasRenderer \| undefined` | The renderer, once created; `undefined` before that and on the server.                                         |
| `size`         | `() => CanvasSize`                  | The `<canvas>` element's `{ width, height }` in CSS pixels; `0 × 0` until measured.                            |
| `advance()`    | `() => boolean`                     | Renders one Frame now, whatever `frameloop` is. Returns `false`, rendering nothing, while there's no renderer. |
| `invalidate()` | `() => void`                        | Asks for a Frame. Needed only after changing an Instance outside its props.                                    |

`renderer` and `size` are signals: read them in JSX, a memo or an effect to follow their changes.
