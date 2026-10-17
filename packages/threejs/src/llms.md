# @solid-slopkit/threejs

three.js scenes as SolidJS 2.x components. A scene is part of the page's component tree: each Scene component creates its three.js Instance once and updates it through fine-grained bindings, with no custom renderer. Each link below is a reference for one area. Paths are relative to this file.

## Setup

It is installed from a GitHub Release tarball, not from npm; once installed, the package name is `@solid-slopkit/threejs`. `three` is a peer dependency (r171 or later), and so is `@types/three` for TypeScript:

```bash
pnpm add solid-js @solidjs/web three @types/three https://github.com/yhorbachov/solid-slopkit/releases/download/threejs-v<version>/solid-slopkit-threejs-<version>.tgz
```

## API

Entry points: `Canvas`, `useCanvas`, `invalidate`, `T` (a Scene component per three.js scene-graph class), `sceneComponent`.

Types: `CanvasProps`, `CanvasOwnProps`, `CanvasHandle`, `Frameloop`, `CanvasRenderer`, `CanvasSize`, `RendererFactory`, `DefaultCameraOptions`, `SceneClass`, `SceneComponent`, `InstanceProps`, `PartialValue`, `PropValue`, `SceneComponentProps`, `SceneRef`, `Attach`, `AttachFn`.

## References

- [Canvas](canvas/canvas.md): `Canvas`, its renderer, default camera and Frames, `invalidate()`, and `useCanvas()`.
- [Scene components](scene-component/scene-component.md): the `T` namespace, `sceneComponent`, Instances, their props and Partial values, Attach, Rebuild, Adopted Instances, refs and disposal.
