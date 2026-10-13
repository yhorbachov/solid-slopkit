import { createEffect, createSignal, flush, untrack, type Accessor } from 'solid-js';

/**
 * Where an element is in its life:
 * - `closed`: not shown.
 * - `starting`: just shown, for one frame, so CSS transitions start from the styles it has here.
 * - `open`: shown. Enter transitions run toward these styles, and enter keyframe animations run here.
 * - `ending`: still shown while the exit transitions and animations run, then `closed`.
 */
export type PresenceStatus = 'closed' | 'starting' | 'open' | 'ending';

export interface PresenceOptions {
  /** Whether it should be shown. */
  present: () => boolean;
  /** The element that animates. Its own animations, and its pseudo-elements' (such as `::backdrop`), are waited for. */
  element: () => HTMLElement | undefined;
  /** Called when the enter animations have finished. */
  onEntered?: () => void;
  /** Called when the exit animations have finished and it's no longer shown. */
  onExited?: () => void;
}

export interface Presence {
  /**
   * Whether the element should be shown: from the moment `present` turns true until its exit animations have
   * finished. Render content, or keep a popover or `<dialog>` open in the top layer, while it's true.
   */
  mounted: Accessor<boolean>;
  /** Render it as `data-status` on the element, and write the transitions and animations against it. */
  status: Accessor<PresenceStatus>;
}

/** The element's own running animations and its pseudo-elements', leaving out those that never end. */
function finiteAnimations(element: HTMLElement): Animation[] {
  if (typeof element.getAnimations !== 'function') return [];
  return element.getAnimations({ subtree: true }).filter((animation) => {
    const effect = animation.effect;
    if (!(effect instanceof KeyframeEffect) || effect.target !== element) return false;
    return effect.getComputedTiming().endTime !== Infinity;
  });
}

/**
 * Enter and exit transitions for an element that's shown and hidden, including one in the top layer. Closing keeps
 * it shown (`mounted`) in the `ending` status until its animations finish, so a popover or `<dialog>` leaves the top
 * layer only afterwards; this works in every browser of the baseline, with or without `@starting-style` and
 * `overlay`. Opening shows it in the `starting` status for one frame, then `open`, so plain transitions run.
 *
 * CSS decides what moves: with no transitions or animations (or none under `prefers-reduced-motion`), it closes in a
 * microtask, before the next paint, and opens a frame later. It starts in `open` or `closed` without animating, which is also what the server renders.
 */
export function createPresence(options: PresenceOptions): Presence {
  const initial: PresenceStatus = untrack(options.present) ? 'open' : 'closed';
  const [status, writeStatus] = createSignal<PresenceStatus>(initial, { name: 'presence.status' });
  // Its own signal rather than derived from the status, so what depends on it doesn't re-run for each status in
  // between: it only changes on entering `starting` and `closed`.
  const [mounted, setMounted] = createSignal(initial !== 'closed', { name: 'presence.mounted' });
  const setStatus = (next: PresenceStatus) => {
    writeStatus(next);
    setMounted(next !== 'closed');
  };

  createEffect(
    () => options.present(),
    (present) => {
      const current = untrack(status);
      if (present) {
        // Coming back while it's leaving reverses from where it is, with no starting frame.
        if (current === 'closed') setStatus('starting');
        else if (current === 'ending') setStatus('open');
      } else if (current !== 'closed') {
        setStatus('ending');
      }
    },
    { name: 'presence.present', defer: true },
  );

  let previous = untrack(status);
  createEffect(
    () => status(),
    (next) => {
      const from = previous;
      previous = next;
      let cancelled = false;
      // Settles after the animations, or in a microtask when there are none: before the next paint, but never as a
      // write from this effect, which reads the status it would write.
      const whenFinished = (done: () => void) => {
        const element = options.element();
        const animations = element ? finiteAnimations(element) : [];
        void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
          if (cancelled) return;
          done();
          flush();
        });
      };

      if (next === 'starting') {
        // A frame later, every effect of this flush has run (a popover is in the top layer), so the starting styles
        // can be computed before switching away from them.
        const frame = requestAnimationFrame(() => {
          void options.element()?.offsetWidth;
          setStatus('open');
          flush();
        });
        return () => cancelAnimationFrame(frame);
      }
      if (next === 'open' && from === 'starting') {
        // Animations from a status change are only created at the next style update, which getAnimations runs.
        whenFinished(() => options.onEntered?.());
      } else if (next === 'ending') {
        whenFinished(() => {
          setStatus('closed');
          options.onExited?.();
        });
      }
      return () => {
        cancelled = true;
      };
    },
    { name: 'presence.animations', defer: true },
  );

  return { mounted, status };
}
