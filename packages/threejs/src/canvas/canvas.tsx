import { createContext, createEffect, createSignal, omit, onSettled, untrack, useContext } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { PerspectiveCamera, Scene, WebGLRenderer, type Camera } from 'three';
import { ParentContext } from '../scene-component/parent';

/** What a Canvas needs from a renderer. `WebGLRenderer` and an initialized `WebGPURenderer` both fit. */
export interface CanvasRenderer {
  render(scene: Scene, camera: Camera): unknown;
  setSize(width: number, height: number, updateStyle?: boolean): unknown;
  setPixelRatio(ratio: number): unknown;
  dispose(): unknown;
}

/**
 * Creates the Canvas's renderer for its `<canvas>` element. It may return a promise (a `WebGPURenderer` has to be
 * initialized first); no Frame renders before it resolves.
 */
export type RendererFactory = (canvas: HTMLCanvasElement) => CanvasRenderer | Promise<CanvasRenderer>;

/** Settings of the default camera, a `PerspectiveCamera`. */
export interface DefaultCameraOptions {
  /** Vertical field of view, in degrees. Defaults to 75. */
  fov?: number;
  /** Near clipping plane. Defaults to 0.1. */
  near?: number;
  /** Far clipping plane. Defaults to 1000. */
  far?: number;
  /** Position in the scene. Defaults to `[0, 0, 5]`. */
  position?: readonly [x: number, y: number, z: number];
}

/** The size of a Canvas's `<canvas>` element, in CSS pixels. */
export interface CanvasSize {
  width: number;
  height: number;
}

/** A Canvas, as the components inside it see it. */
export interface CanvasHandle {
  /** The scene every Instance in this Canvas belongs to. */
  readonly scene: Scene;
  /** The default camera. */
  readonly camera: PerspectiveCamera;
  /** The renderer, once the factory has returned or resolved; `undefined` before that and on the server. */
  readonly renderer: () => CanvasRenderer | undefined;
  /** The `<canvas>` element's size, kept up to date as it resizes. `0 × 0` until it has been measured. */
  readonly size: () => CanvasSize;
  /** Renders one Frame now. Returns `false`, and renders nothing, while there is no renderer yet. */
  advance(): boolean;
}

export interface CanvasOwnProps {
  /** Creates the renderer. Read once. Defaults to a `WebGLRenderer` with antialiasing. */
  renderer?: RendererFactory;
  /** Settings of the default camera. */
  camera?: DefaultCameraOptions;
  /** The scene: Scene components, and any component that renders them. */
  children?: JSX.Element;
}

export type CanvasProps = Omit<JSX.CanvasHTMLAttributes<HTMLCanvasElement>, keyof CanvasOwnProps | 'ref' | 'style'> &
  CanvasOwnProps & { style?: JSX.CSSProperties };

const CanvasContext = createContext<CanvasHandle>();

const DEFAULT_POSITION = [0, 0, 5] as const;

const defaultRenderer: RendererFactory = (canvas) => new WebGLRenderer({ canvas, antialias: true });

function isThenable<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as { then?: unknown }).then === 'function';
}

// Frees the GPU context right away instead of when the canvas is garbage-collected: browsers cap how many WebGL
// contexts a page may hold.
function release(renderer: CanvasRenderer) {
  renderer.dispose();
  (renderer as { forceContextLoss?: () => void }).forceContextLoss?.();
}

/**
 * The root of a scene: a `<canvas>` that fills its parent, the scene, the default camera and the renderer. Every
 * Scene component inside it belongs to its scene. Frames render only when `advance()` is called on the Canvas
 * handle (`useCanvas()`).
 */
export function Canvas(props: CanvasProps) {
  const others = omit(props, 'renderer', 'camera', 'children', 'style');
  let canvas: HTMLCanvasElement | undefined;

  const scene = new Scene();
  const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.set(...DEFAULT_POSITION);

  const [renderer, setRenderer] = createSignal<CanvasRenderer | undefined>(undefined, { name: 'Canvas.renderer' });
  const [size, setSize] = createSignal<CanvasSize>(
    { width: 0, height: 0 },
    { name: 'Canvas.size', equals: (a, b) => a.width === b.width && a.height === b.height },
  );

  createEffect(
    () => {
      const options = props.camera;
      const position = options?.position ?? DEFAULT_POSITION;
      return {
        fov: options?.fov ?? 75,
        near: options?.near ?? 0.1,
        far: options?.far ?? 1000,
        position: [position[0], position[1], position[2]] as const,
      };
    },
    ({ fov, near, far, position }) => {
      camera.fov = fov;
      camera.near = near;
      camera.far = far;
      camera.position.set(...position);
      camera.updateProjectionMatrix();
    },
    { name: 'Canvas.camera' },
  );

  createEffect(
    () => ({ current: renderer(), size: size() }),
    ({ current, size }) => {
      current?.setSize(size.width, size.height, false);
    },
    { name: 'Canvas.rendererSize' },
  );

  onSettled(() => {
    if (!canvas) return;
    const element = canvas;
    let disposed = false;
    let current: CanvasRenderer | undefined;
    const adopt = (made: CanvasRenderer) => {
      if (disposed) return release(made);
      current = made;
      made.setPixelRatio(window.devicePixelRatio);
      setRenderer(made);
    };
    const made = (untrack(() => props.renderer) ?? defaultRenderer)(element);
    if (isThenable(made)) void made.then(adopt);
    else adopt(made);

    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);

    return () => {
      disposed = true;
      observer.disconnect();
      if (current) release(current);
    };
  });

  const handle: CanvasHandle = {
    scene,
    camera,
    renderer,
    size,
    advance() {
      const current = untrack(renderer);
      if (!current) return false;
      current.render(scene, camera);
      return true;
    },
  };

  return (
    <>
      <canvas
        ref={(el: HTMLCanvasElement) => (canvas = el)}
        {...others}
        style={{ display: 'block', width: '100%', height: '100%', ...props.style }}
      />
      <CanvasContext value={handle}>
        <ParentContext value={scene}>{props.children}</ParentContext>
      </CanvasContext>
    </>
  );
}

/** The Canvas the calling component is inside. Throws outside a Canvas. */
export function useCanvas(): CanvasHandle {
  return useContext(CanvasContext);
}
