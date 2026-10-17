/**
 * When a Canvas renders Frames on its own:
 * - `"demand"`: on the animation frame after something Invalidates it. Any number of Invalidations before that frame
 *   render one Frame.
 * - `"always"`: on every animation frame.
 * - `"never"`: never; only `advance()` renders. Invalidations wait until the mode changes.
 */
export type Frameloop = 'demand' | 'always' | 'never';

export interface FrameLoop {
  /** Asks for a Frame. */
  invalidate(): void;
  setMode(mode: Frameloop): void;
  /** The renderer has arrived: Frames can render from now on. */
  ready(): void;
  /** A Frame was just rendered outside the loop (`advance()`), so a pending Invalidation is met. */
  rendered(): void;
  dispose(): void;
}

/** Schedules Frames on animation frames. `render` draws one Frame. */
export function createFrameLoop(render: () => void, initial: Frameloop): FrameLoop {
  let mode = initial;
  let ready = false;
  let pending = false;
  let disposed = false;
  let frame: number | undefined;

  const cancel = () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
  };
  const request = () => {
    if (frame !== undefined || !ready || disposed) return;
    if (mode === 'always' || (mode === 'demand' && pending)) frame = requestAnimationFrame(tick);
  };
  const tick = () => {
    frame = undefined;
    // On demand, `advance()` may have met the Invalidation since this frame was requested.
    if (mode === 'always' || pending) {
      pending = false;
      render();
    }
    request();
  };

  return {
    invalidate() {
      pending = true;
      request();
    },
    setMode(next) {
      mode = next;
      if (mode === 'never') cancel();
      request();
    },
    ready() {
      ready = true;
      request();
    },
    rendered() {
      pending = false;
    },
    dispose() {
      disposed = true;
      cancel();
    },
  };
}
