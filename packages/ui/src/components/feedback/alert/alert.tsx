import { createMemo, omit, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './alert.module.css';
import { mergeDefaultProps, type ElementProps } from '../../../utils';
import { joinClass } from '../../../style-props';
import type { SlopColor } from '../../../core';

export type AlertVariant = 'soft' | 'solid' | 'outline';

export interface AlertOwnProps {
  /** A short heading, above the message. */
  title?: JSX.Element;
  /** An icon on the start side, usually matching the color. */
  icon?: JSX.Element;
  /** Color role. Defaults to `info`. */
  color?: SlopColor;
  /** Visual style. Defaults to `soft`. */
  variant?: AlertVariant;
}

export type AlertProps = ElementProps<JSX.HTMLAttributes<HTMLDivElement>, AlertOwnProps>;

const hasContent = (value: JSX.Element) => value != null && value !== false;

/** A message that needs the reader's attention: a `div` with `role="alert"`, an optional icon and title. */
export function Alert(props: AlertProps) {
  const mergedProps = mergeDefaultProps({ color: 'info' as SlopColor, variant: 'soft' as AlertVariant }, props);
  const others = omit(mergedProps, 'class', 'children', 'title', 'icon', 'color', 'variant');

  // Read once: a JSX prop is a getter that creates its elements on every read.
  const title = createMemo(() => props.title, { name: 'Alert.title' });
  const icon = createMemo(() => props.icon, { name: 'Alert.icon' });

  return (
    <div
      role="alert"
      data-color={mergedProps.color}
      data-variant={mergedProps.variant}
      data-with-icon={hasContent(icon()) ? '' : undefined}
      class={joinClass(['slp-alert', style.alert], mergedProps.class)}
      {...others}
    >
      <Show when={hasContent(icon())}>
        <div data-slot="alert-icon" class={style.icon}>
          {icon()}
        </div>
      </Show>
      <div data-slot="alert-content" class={style.content}>
        <Show when={hasContent(title())}>
          <div data-slot="alert-title" class={style.title}>
            {title()}
          </div>
        </Show>
        <div data-slot="alert-message" class={style.message}>
          {mergedProps.children}
        </div>
      </div>
    </div>
  );
}
