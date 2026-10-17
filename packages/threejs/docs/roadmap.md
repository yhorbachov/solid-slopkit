# @solid-slopkit/threejs roadmap to 0.0.1

0.0.1 is the first release: the core, plus orbit controls as the first helper. Decisions live in [docs/adr](./adr) (repo-wide ones in [/docs/adr](../../../docs/adr)) and vocabulary in [CONTEXT.md](../CONTEXT.md). Use its terms (**Canvas**, **Scene component**, **Instance**, **Attach**, **Rebuild**, **Invalidate**, …) in code, tests and docs.

## Rules for agents

- **Do one step at a time.** Only implement the step you were asked for, identified by its ID (e.g. `T1.04`). Don't start the next step, finish a whole milestone, or build "while I'm here" extras, even when the next step looks small or obviously related.
- A step that needs something that doesn't exist yet is **blocked**. Say so and stop; don't build the dependency inside the step.
- When a step is done, tick its box in this file in the same commit.
- Scenes are Solid components, not a custom renderer (ADR 0025). Don't introduce a reconciler, intrinsic lowercase tags or a compiler mode.

## Definition of done (every step)

- jsdom tests against the real three.js scene graph, using the stub renderer and `frameloop="never"` with manual advance (T1.01). Tests that need a GPU context, real layout or real pointer input go in the browser project (`*.browser.test.tsx`).
- `toHaveNoDiagnostics()`, plus a re-run budget on the main update path (`@solidjs/diagnostics/vitest`). A prop change re-runs only its own binding.
- No leaks: every **Owned Instance** a test creates is disposed when its owner is, and nothing is disposed that the component didn't construct.
- The LLM reference for the topic (next to the source, indexed in `src/llms.md`, ADR 0012) is updated in the same commit.
- Exported from the package entry (or its subpath), and the entry never imports a subpath (ADR 0002).

---

## T0 — Foundations

- [x] **T0.01** Package scaffold modeled on `packages/forms`: `package.json` (the `solid` export condition, ADR 0001), `tsconfig.json` / `tsconfig.build.json`, build and typecheck scripts, a jsdom vitest project and an empty entry. Peers: `solid-js`, `@solidjs/web`, `three` (required; pick and justify the lowest supported version) and `@types/three`. `pnpm build`, `test`, `lint` and `format:check` pass from the root. `three` is `>=0.171.0 <1`: r171 is the first release where `three` and `three/webgpu` share one `three.core.js`, so their classes are identical and the WebGPU opt-in (T1.15) attaches the same Instances. `@types/three` uses the same range and is an optional peer, for JavaScript consumers.
- [x] **T0.02** A vitest browser project (Chromium) for `*.browser.test.tsx`, with one smoke test that creates a `WebGLRenderer` on a real canvas. The smoke test (`test/webgl.browser.test.ts`) reads back a drawn pixel, so it fails if headless Chromium only fakes the context.

## T1 — Core

- [x] **T1.01** **Canvas**: renders a `<canvas>` that fills its parent and tracks its size, creates the scene, the default `PerspectiveCamera` (configured by a `camera` prop) and the renderer through the `renderer` factory (`WebGLRenderer` by default; the factory may return a promise, and no **Frame** renders before it resolves). Provides the Canvas context and disposes the renderer with its owner. Ships the test harness: a stub renderer that records draws, and `frameloop="never"` with a manual advance. Until T1.08 every Canvas renders only on `advance()` (on the handle from `useCanvas()`), so there is no `frameloop` prop yet; the default camera's aspect ratio follows the canvas from T1.11. The harness is internal to the package's tests (`test/harness.ts`).
- [x] **T1.02** `sceneComponent(Class)`: constructs the **Owned Instance** from **Args**, **Attaches** it (an `Object3D` is added; `BufferGeometry` goes to `geometry`, `Material` to `material`; `attach` takes a property path or a `(parent, self) => detach` function), restores the previous value on detach, calls `ref` with the set-up Instance, and disposes it with its owner unless `dispose={false}`. The ref runs before the children attach; Attach claims on one property stack, so the most recent claim still standing wins.
- [x] **T1.03** Props: each prop is its own binding. A value with `set` is copied into, not replaced: an array spreads into `set`, a number goes to `setScalar` where it exists, a same-type object to `copy`, and a `Color` takes anything `Color.set` accepts. Everything else is assigned. Bindings are render effects, so props are applied synchronously before Attach and the ref. A number goes to `set` for a type with no `setScalar` (`Layers`), `undefined` leaves a math object as it is, and which props a component has is read once.
- [x] **T1.04** **Partial values**: an object literal for a property that holds an object writes only the fields it lists, with the copy rules, at any depth (`position={{ y: 1 }}`, `shadow={{ mapSize: [2048, 2048], camera: { far: 50 } }}`), typed from the declared types. It is written again when Attach puts a new object in its property, and skipped while that property is `null`; fields the current object lacks are skipped. Replaces the dashed Path props first built here (ADR 0026).
- [x] **T1.05** **Rebuild**: a change to `args` constructs a new Instance, applies the current props, swaps it into the parent's slot, moves the children, calls `ref` again and disposes the old one. Children and their state survive. `args` is compared by value. The new Instance keeps the old one's position among its siblings and its place in a slot's claims, and the ref runs again once the children have moved.
- [ ] **T1.06** **Adopted Instances**: the `object` prop hands in an existing Instance, which is attached, detached and swapped when `object` changes, but never disposed.
- [ ] **T1.07** The `T` namespace: a script generates one Scene component per constructible scene-graph class three.js exports (objects, cameras, lights, geometries, materials, textures, fog, helpers; not math types, loaders or renderers), each importing only its own class, exported only as `export * as T`. A production build of a one-mesh app proves unused members are dropped.
- [ ] **T1.08** Frames on demand: prop writes, Attach, detach and Rebuild **Invalidate**, writes in one tick coalesce into one Frame, `invalidate()` is exported for changes outside props, and `frameloop` accepts `"always"` and `"never"`.
- [ ] **T1.09** `onFrame(cb)`: **Frame callbacks** owned by the current owner, run in registration order before each Frame. While any is registered, the Canvas renders continuously.
- [ ] **T1.10** `onRender(cb)`: a **Render callback** replaces the default draw. A second one on the same Canvas is a dev error.
- [ ] **T1.11** **Active camera**: an `active` prop on camera components, a stack where the most recently activated wins and the previous one returns when it is deactivated or disposed, with aspect ratio or orthographic frustum kept in sync with the canvas size.
- [ ] **T1.12** Pointer events on `Object3D` Scene components (`onClick`, `onPointerDown/Up/Move`, `onPointerOver/Out/Enter/Leave`, `onWheel`, `onContextMenu`). Only **Interactive Instances** are hit-tested, on pointer events only. Events bubble nearest hit first, `stopPropagation()` works, the event carries the intersection, and pointer capture works for drags. Browser tests cover real raycasts.
- [ ] **T1.13** `loadAsset(Loader, () => url)`: an async accessor that suspends under `<Loading>`. The **Asset cache** is keyed by loader class and URL, counts references per reactive owner, and disposes an **Asset** once it stays unreferenced past a short grace period. Also `preloadAsset(...)` and loader configuration (e.g. DRACO, KTX2). Mounting one Asset twice needs an explicit clone, and the docs say so.
- [ ] **T1.14** SSR: on the server the Canvas renders only its `<canvas>` and an optional `fallback`, never its children. On the client the scene mounts after hydration. An SSR test asserts a clean hydration and no Solid diagnostics in the server log.
- [ ] **T1.15** WebGPU opt-in: a browser test renders through a `renderer` factory that returns an initialized `WebGPURenderer`, and the docs show the one-line opt-in.

## T2 — Helpers

- [ ] **T2.01** Orbit controls at `@solid-slopkit/threejs/controls`: bound to the Active camera and the canvas, **Invalidate** on change so on-demand scenes redraw while dragging, and disposed with their owner.

## T3 — Release 0.0.1

- [ ] **T3.01** Skills (`skills/<area>/SKILL.md`, ADR 0012): describing a scene, animating with Frame callbacks and Partial values, loading Assets.
- [ ] **T3.02** A threejs section on the docs site with live examples, client-only per T1.14, and a sidebar entry and home-page card.
- [ ] **T3.03** `release:pack` and a release workflow for `threejs-v<version>` tags (ADR 0001), modeled on the UI's.
- [ ] **T3.04** Audit before release: every LLM reference, skill and docs page matches the API.

## Not in 0.0.1

- More helpers (environment maps, HTML overlays anchored in 3D, text, post-processing, performance monitors), each behind its own subpath.
- Named phases for Frame callbacks; registration order holds until a real case needs more.
- `WebGPURenderer` as the default.
