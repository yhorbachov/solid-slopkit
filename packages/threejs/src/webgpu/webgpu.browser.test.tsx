import { render } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { Color, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import { expect, test } from 'vitest';
import { Canvas, sceneComponent, useCanvas, type CanvasHandle } from '..';
import { webgpuRenderer } from '.';

// The height of the default camera's view at the origin: 75° of field of view from 5 units away.
const VIEW_HEIGHT = 2 * 5 * Math.tan(((75 / 2) * Math.PI) / 180);

const T = {
  Mesh: sceneComponent(Mesh),
  PlaneGeometry: sceneComponent(PlaneGeometry),
  MeshBasicMaterial: sceneComponent(MeshBasicMaterial),
};

// Copies the canvas's current picture into a 2D canvas and reads one CSS pixel of it.
function pixel(canvas: HTMLCanvasElement, x: number, y: number) {
  const copy = document.createElement('canvas');
  copy.width = canvas.width;
  copy.height = canvas.height;
  const context = copy.getContext('2d')!;
  context.drawImage(canvas, 0, 0);
  const ratio = canvas.width / canvas.clientWidth;
  return [...context.getImageData(Math.floor(x * ratio), Math.floor(y * ratio), 1, 1).data];
}

test('a Canvas renders its scene through webgpuRenderer(), on the WebGPU backend', async () => {
  let handle!: CanvasHandle;
  const Probe = () => {
    handle = useCanvas();
    return null;
  };
  const { container, unmount } = render(() => (
    <div style={{ width: '100px', height: '100px' }}>
      <Canvas renderer={webgpuRenderer()} frameloop="never">
        <Probe />
        {/* A red square in the middle, a fifth of the view wide, on black. */}
        <T.Mesh scale={VIEW_HEIGHT / 5}>
          <T.PlaneGeometry />
          <T.MeshBasicMaterial color="#ff0000" />
        </T.Mesh>
      </Canvas>
    </div>
  ));
  flush();
  handle.scene.background = new Color(0x000000);

  await expect.poll(() => handle.renderer()).toBeDefined();
  await expect.poll(() => handle.size()).toEqual({ width: 100, height: 100 });
  flush();
  const renderer = handle.renderer() as WebGPURenderer;
  expect((renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend).toBe(true);

  expect(handle.advance()).toBe(true);
  const canvas = container.querySelector('canvas')!;
  expect(pixel(canvas, 50, 50)).toEqual([255, 0, 0, 255]);
  expect(pixel(canvas, 5, 5)).toEqual([0, 0, 0, 255]);

  unmount();
});
