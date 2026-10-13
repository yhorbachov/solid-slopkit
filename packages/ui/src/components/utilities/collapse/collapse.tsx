import { createEffect, createMemo, omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import style from './collapse.module.css';
import { createPresence } from '../../primitives';
import { mergeDefaultProps, type ElementProps } from '../../../utils';
import { joinClass } from '../../../style-props';

export interface CollapseOwnProps {
  /** Whether the content is shown. Changing it animates the height. */
  expanded: boolean;
  /** Duration of the animation, in milliseconds. Defaults to 200. */
  duration?: number;
  /** CSS timing function of the animation. Defaults to `ease`. */
  timingFunction?: string;
  /** Whether the content also fades. Defaults to `true`. */
  animateOpacity?: boolean;
  /** Called when it has finished expanding. */
  onExpanded?: () => void;
  /** Called when it has finished collapsing. */
  onCollapsed?: () => void;
}

export type CollapseProps = ElementProps<JSX.HTMLAttributes<HTMLDivElement>, CollapseOwnProps>;

/**
 * A `div` that animates its height between zero and its content's, as `expanded` changes. Collapsed, it stays in the
 * DOM with `display: none`, so its content keeps its state and is out of the tab order and the accessibility tree.
 */
export function Collapse(props: CollapseProps) {
  const mergedProps = mergeDefaultProps({ duration: 200, timingFunction: 'ease', animateOpacity: true }, props);
  const others = omit(
    mergedProps,
    'ref',
    'class',
    'style',
    'expanded',
    'duration',
    'timingFunction',
    'animateOpacity',
    'onExpanded',
    'onCollapsed',
  );
  let root: HTMLDivElement | undefined;

  const presence = createPresence({
    present: () => props.expanded,
    element: () => root,
    onEntered: () => props.onExpanded?.(),
    onExited: () => props.onCollapsed?.(),
  });

  /** Sets the height and clipping inline, or clears them back to the content's own height. */
  const setHeight = (el: HTMLElement, height: string) => {
    el.style.height = height;
    el.style.overflow = height ? 'hidden' : '';
  };

  // CSS can't animate to or from `auto`, so the height is measured in pixels while it moves, and cleared once it has
  // settled so the content can grow again.
  createEffect(
    () => presence.status(),
    (status) => {
      const el = root;
      if (!el) return;
      if (status === 'open') {
        // From zero (the starting frame) or from wherever collapsing had got to, up to the content's height. Measuring
        // updates the styles, so the height is pinned to zero first: measured at `auto`, the transition would start
        // from the full height. Mid-collapse it's already pinned, and the running transition reverses.
        if (!el.style.height) setHeight(el, '0px');
        setHeight(el, `${el.scrollHeight}px`);
        let cancelled = false;
        void Promise.resolve()
          .then(() => Promise.allSettled((el.getAnimations?.() ?? []).map((animation) => animation.finished)))
          .then(() => {
            if (!cancelled) setHeight(el, '');
          });
        return () => {
          cancelled = true;
        };
      }
      if (status === 'ending') {
        // From the height it has now, which mid-expand is less than the content's, down to zero.
        setHeight(el, `${el.getBoundingClientRect().height}px`);
        void el.offsetHeight;
        setHeight(el, '0px');
      } else if (status === 'closed') {
        setHeight(el, '');
      }
    },
    { name: 'Collapse.height', defer: true },
  );

  // Any duration or easing, so they go in custom properties rather than data-attribute selectors.
  const styleValue = createMemo(
    () => ({
      ...props.style,
      '--_collapse-duration': `${mergedProps.duration}ms`,
      '--_collapse-timing-function': mergedProps.timingFunction,
      display: presence.mounted() ? props.style?.display : 'none',
    }),
    { name: 'Collapse.style' },
  );

  return (
    <div
      ref={[(el: HTMLDivElement) => (root = el), mergedProps.ref]}
      data-status={presence.status()}
      data-animate-opacity={mergedProps.animateOpacity ? '' : undefined}
      class={joinClass(['slp-collapse', style.collapse], mergedProps.class)}
      style={styleValue()}
      {...others}
    />
  );
}
