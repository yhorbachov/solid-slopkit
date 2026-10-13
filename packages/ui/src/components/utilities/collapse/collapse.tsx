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

interface GapSide {
  property: 'marginTop' | 'marginBottom';
  size: number;
}

/** Whether a sibling takes part in the parent's layout, and so has a gap next to it. */
const isShown = (element: Element): boolean => {
  const { display, position } = getComputedStyle(element);
  return display !== 'none' && position !== 'absolute' && position !== 'fixed';
};

/**
 * Where the parent's gap sits next to `el`, when the parent is a column flexbox with a row gap: after it when a shown
 * sibling follows, else before it. Hiding `el` removes that gap from the layout. Not in a grid, whose rows can't
 * shrink below zero, so a negative margin can't take the gap back.
 */
function findGapSide(el: HTMLElement): GapSide | undefined {
  const parent = el.parentElement;
  if (!parent) return undefined;
  const style = getComputedStyle(parent);
  const size = parseFloat(style.rowGap);
  if (!style.display.includes('flex') || !style.flexDirection.startsWith('column') || !(size > 0)) return undefined;

  let next = el.nextElementSibling;
  while (next && !isShown(next)) next = next.nextElementSibling;
  let previous = el.previousElementSibling;
  while (previous && !isShown(previous)) previous = previous.previousElementSibling;
  // In a reversed column, the next sibling sits above.
  const reversed = style.flexDirection === 'column-reverse';
  if (next) return { property: reversed ? 'marginTop' : 'marginBottom', size };
  if (previous) return { property: reversed ? 'marginBottom' : 'marginTop', size };
  return undefined;
}

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

  // The side its parent's gap is taken back on while it moves, if it's stacked in a column with a gap.
  let gapSide: GapSide | undefined;
  const setGapMargin = (el: HTMLElement, value: string) => {
    if (gapSide) el.style[gapSide.property] = value;
  };
  const clearGapMargin = (el: HTMLElement) => {
    setGapMargin(el, '');
    gapSide = undefined;
  };

  // CSS can't animate to or from `auto`, so the height is measured in pixels while it moves, and cleared once it has
  // settled so the content can grow again. In a column flexbox, the parent's gap next to it would stay at height zero
  // and vanish all at once when it's hidden (or appear all at once when it's shown), so a negative margin of the gap's
  // size moves with the height.
  createEffect(
    () => presence.status(),
    (status) => {
      const el = root;
      if (!el) return;
      if (status === 'starting') {
        // Shown at height zero for one frame: without the gap too.
        gapSide = findGapSide(el);
        setGapMargin(el, gapSide ? `${-gapSide.size}px` : '');
        return;
      }
      if (status === 'open') {
        // From zero (the starting frame) or from wherever collapsing had got to, up to the content's height. Measuring
        // updates the styles, so the height is pinned to zero first: measured at `auto`, the transition would start
        // from the full height. Mid-collapse it's already pinned, and the running transition reverses.
        if (!el.style.height) setHeight(el, '0px');
        setHeight(el, `${el.scrollHeight}px`);
        setGapMargin(el, '0px');
        let cancelled = false;
        void Promise.resolve()
          .then(() => Promise.allSettled((el.getAnimations?.() ?? []).map((animation) => animation.finished)))
          .then(() => {
            if (cancelled) return;
            setHeight(el, '');
            clearGapMargin(el);
          });
        return () => {
          cancelled = true;
        };
      }
      if (status === 'ending') {
        // From where it is now, which mid-expand is short of the content's height and of the full gap, down to zero.
        gapSide ??= findGapSide(el);
        setHeight(el, `${el.getBoundingClientRect().height}px`);
        if (gapSide) setGapMargin(el, getComputedStyle(el)[gapSide.property]);
        void el.offsetHeight;
        setHeight(el, '0px');
        setGapMargin(el, gapSide ? `${-gapSide.size}px` : '');
      } else if (status === 'closed') {
        setHeight(el, '');
        clearGapMargin(el);
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
