import { createMemo, omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './ring-progress.module.css';
import { mergeDefaultProps, type ElementProps } from '../../../utils';
import { joinClass } from '../../../style-props';
import type { SlopColor, SlopSize } from '../../../core';

export interface RingProgressOwnProps {
  /** How far along, from 0 to `max`. Without one, the ring is indeterminate. */
  value?: number;
  /** The value of a full ring. Defaults to `100`. */
  max?: number;
  /** Color role of the arc. Defaults to `primary`. */
  color?: SlopColor;
  /** Diameter of the ring. Defaults to `md`. */
  size?: SlopSize;
  /** The accessible name, unless `aria-labelledby` points at a visible one. Defaults to `Progress`. */
  label?: string;
  /** Content centered in the ring, such as the percentage. */
  children?: JSX.Element;
}

export type RingProgressProps = ElementProps<JSX.HTMLAttributes<HTMLDivElement>, RingProgressOwnProps>;

/** Shows how far a task has come as a ring: a `div` with `role="progressbar"`, with content in its center. */
export function RingProgress(props: RingProgressProps) {
  const mergedProps = mergeDefaultProps(
    { max: 100, color: 'primary' as SlopColor, size: 'md' as SlopSize, label: 'Progress' },
    props,
  );
  const others = omit(mergedProps, 'class', 'style', 'children', 'value', 'max', 'color', 'size', 'label');

  const value = createMemo(() => (props.value == null ? undefined : Math.min(Math.max(props.value, 0), mergedProps.max)), {
    name: 'RingProgress.value',
  });

  // The arc's length out of 100 (the circle's pathLength), as a custom property.
  const styleValue = createMemo(
    () => {
      const current = value();
      if (current === undefined) return props.style;
      const percent = mergedProps.max > 0 ? (current * 100) / mergedProps.max : 0;
      return { ...props.style, '--_ring-value': String(percent) };
    },
    { name: 'RingProgress.style' },
  );

  return (
    <div
      role="progressbar"
      aria-label={props['aria-labelledby'] ? undefined : mergedProps.label}
      aria-valuemin={0}
      aria-valuemax={mergedProps.max}
      aria-valuenow={value()}
      data-color={mergedProps.color}
      data-size={mergedProps.size}
      data-indeterminate={value() === undefined ? '' : undefined}
      data-empty={value() === 0 ? '' : undefined}
      class={joinClass(['slp-ring-progress', style.ring], mergedProps.class)}
      style={styleValue()}
      {...others}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" class={style.svg}>
        <circle data-slot="ring-progress-track" class={style.track} cx="50" cy="50" r="44" />
        <circle data-slot="ring-progress-arc" class={style.arc} cx="50" cy="50" r="44" pathLength="100" />
      </svg>
      <span data-slot="ring-progress-label" class={style.label}>
        {mergedProps.children}
      </span>
    </div>
  );
}
