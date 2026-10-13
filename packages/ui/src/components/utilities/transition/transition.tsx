import { Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import style from './transition.module.css';
import { createPresence, type PresenceStatus } from '../../primitives';

/**
 * A ready-made enter and exit animation. The direction in the name is the way it moves while entering: `fade-up`
 * rises into place. `none` animates nothing, for writing your own CSS against `data-status`.
 */
export type TransitionName =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'scale-x'
  | 'scale-y'
  | 'pop'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'rotate-left'
  | 'rotate-right'
  | 'none';

/** What the child spreads on its root element: `<div {...transition}>`. */
export interface TransitionAttributes {
  ref: (element: HTMLElement) => void;
  class: string;
  style: JSX.CSSProperties;
  'data-transition': TransitionName;
  'data-status': PresenceStatus;
}

export interface TransitionProps {
  /** Whether the content is shown. Changing it plays the enter or exit animation. */
  mounted: boolean;
  /** The animation. Defaults to `fade`. */
  transition?: TransitionName;
  /** Enter duration, in milliseconds. Defaults to 200. */
  duration?: number;
  /** Exit duration, in milliseconds. Defaults to `duration`. */
  exitDuration?: number;
  /** CSS timing function of both. Defaults to `ease`. */
  timingFunction?: string;
  /** Keep the content in the DOM, with `display: none`, while it's hidden. Read once. */
  keepMounted?: boolean;
  /** Called when the enter animation has finished. */
  onEntered?: () => void;
  /** Called when the exit animation has finished and the content is gone. */
  onExited?: () => void;
  /** Renders the content. Spread the attributes on its root element; it must take a ref. */
  children: (transition: TransitionAttributes) => JSX.Element;
}

/**
 * Animates content in and out as `mounted` changes. The content stays rendered until its exit animation finishes,
 * then unmounts (or hides, with `keepMounted`). Under `prefers-reduced-motion`, it shows and hides at once.
 */
export function Transition(props: TransitionProps) {
  const keepMounted = untrack(() => !!props.keepMounted);
  let element: HTMLElement | undefined;

  const presence = createPresence({
    present: () => props.mounted,
    element: () => element,
    onEntered: () => props.onEntered?.(),
    onExited: () => props.onExited?.(),
  });

  const attributes: TransitionAttributes = {
    ref: (el) => (element = el),
    class: `slp-transition ${style.transition}`,
    get style() {
      const duration = props.duration ?? 200;
      return {
        '--_transition-duration': `${duration}ms`,
        '--_transition-exit-duration': `${props.exitDuration ?? duration}ms`,
        '--_transition-timing-function': props.timingFunction ?? 'ease',
        display: presence.mounted() ? undefined : 'none',
      };
    },
    get 'data-transition'() {
      return props.transition ?? 'fade';
    },
    get 'data-status'() {
      return presence.status();
    },
  };

  return <Show when={keepMounted || presence.mounted()}>{props.children(attributes)}</Show>;
}
