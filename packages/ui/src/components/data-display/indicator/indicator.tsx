import { createMemo, omit, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './indicator.module.css';
import { mergeDefaultProps, type ElementProps } from '../../../utils';
import { joinClass } from '../../../style-props';
import type { SlopColor, SlopSize } from '../../../core';

export type IndicatorPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'middle-start'
  | 'middle-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

export interface IndicatorOwnProps {
  /** Where the mark sits on the child. Defaults to `top-end`. */
  position?: IndicatorPosition;
  /** Content of the mark, such as a count. Without one, the mark is a dot. */
  label?: JSX.Element;
  /** Color role of the mark. Defaults to `primary`. */
  color?: SlopColor;
  /** Defaults to `md`. */
  size?: SlopSize;
  /** Moves the mark toward the child's center, in px, for a round child such as an Avatar. */
  offset?: number;
  /** Animates a ping around the mark, for something in progress. */
  processing?: boolean;
  /** Hides the mark. */
  disabled?: boolean;
}

export type IndicatorProps = ElementProps<JSX.HTMLAttributes<HTMLSpanElement>, IndicatorOwnProps>;

/** Pins a dot or a small label to a corner or edge of its child. A `span` around the child. */
export function Indicator(props: IndicatorProps) {
  const mergedProps = mergeDefaultProps(
    { position: 'top-end' as IndicatorPosition, color: 'primary' as SlopColor, size: 'md' as SlopSize },
    props,
  );
  const others = omit(
    mergedProps,
    'class',
    'style',
    'children',
    'position',
    'label',
    'color',
    'size',
    'offset',
    'processing',
    'disabled',
  );

  // Read once: a JSX prop is a getter that creates its elements on every read.
  const label = createMemo(() => props.label, { name: 'Indicator.label' });
  const withLabel = () => label() != null && label() !== false;

  // Any number of px, so it goes in a custom property rather than a data-attribute selector.
  const styleValue = createMemo(
    () => (props.offset ? { ...props.style, '--_indicator-offset': `${props.offset}px` } : props.style),
    { name: 'Indicator.style' },
  );

  return (
    <span class={joinClass(['slp-indicator', style.indicator], mergedProps.class)} style={styleValue()} {...others}>
      {mergedProps.children}
      <Show when={!mergedProps.disabled}>
        {/* Hidden from assistive technology: put what it means in the child's accessible name instead. */}
        <span
          data-slot="indicator-mark"
          aria-hidden="true"
          data-position={mergedProps.position}
          data-color={mergedProps.color}
          data-size={mergedProps.size}
          data-with-label={withLabel() ? '' : undefined}
          data-processing={mergedProps.processing ? '' : undefined}
          class={style.mark}
        >
          {label()}
        </span>
      </Show>
    </span>
  );
}
