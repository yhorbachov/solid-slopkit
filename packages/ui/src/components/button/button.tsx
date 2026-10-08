import { createMemo, omit } from 'solid-js';
import { Polymorphic, type ElementOf, type PolymorphicProps } from '../polymorphic';
import style from './button.module.css';
import { type JSX, type ValidComponent } from '@solidjs/web';
import { mergeDefaultProps, mergeRefs } from '../../utils';
import { createTagName } from '../primitives';
import { isButton } from './is-button';
import type { SlopColor, SlopSize } from '../../core';

export interface ButtonRootOptions {}

export type ButtonVariant = 'filled' | 'light' | 'outline' | 'subtle';

type ButtonRootCommonProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  disabled?: boolean;
  type: string | undefined;
  ref: T | ((el: T) => void);
  tabIndex: number | string | undefined;
  class?: JSX.ClassValue | JSX.RemoveAttribute;

  variant?: ButtonVariant;
  color?: SlopColor;
  size?: SlopSize;

  /** Shows a Loader over the label and disables the button. */
  loading?: boolean;

  /** Content before the label, usually an icon. */
  leftSection?: JSX.Element;

  /** Content after the label, usually an icon. */
  rightSection?: JSX.Element;
};

export interface ButtonRootRenderProps extends ButtonRootCommonProps {
  role: 'menuitem' | 'button' | undefined;
  'aria-disabled': boolean | undefined;
  'data-disabled': string | undefined;
}

export type ButtonRootProps<T extends ValidComponent | HTMLElement = HTMLElement> = ButtonRootOptions &
  Partial<ButtonRootCommonProps<ElementOf<T>>>;

export function Button<T extends ValidComponent = 'button'>(props: PolymorphicProps<T, ButtonRootProps<T>>) {
  let ref: HTMLElement | undefined;

  const mergedProps = mergeDefaultProps(
    { type: 'button', size: 'md', variant: 'filled', color: 'neutral' },
    props as ButtonRootProps,
  );

  const others = omit(
    mergedProps,
    'ref',
    'type',
    'disabled',
    'class',
    'children',
    'leftSection',
    'rightSection',
    'loading',
    'size',
    'variant',
    'color',
  );
  const tagName = createTagName(
    () => ref,
    () => 'button',
  );

  const isNativeButton = createMemo(() => {
    const elementTagName = tagName();
    if (!elementTagName) return false;
    return isButton({ tagName: elementTagName, type: mergedProps.type });
  });

  const isNativeInput = createMemo(() => tagName() === 'input');

  const isNativeLink = createMemo(() => {
    return tagName() === 'a' && ref?.getAttribute('href');
  });

  const elementType = createMemo(() => (isNativeButton() || isNativeInput() ? mergedProps.type : undefined));
  const disabled = createMemo(() => {
    if (mergedProps.loading) return true;
    return isNativeButton() || isNativeInput() ? mergedProps.disabled : undefined;
  });

  return (
    <Polymorphic<ButtonRootRenderProps>
      as="button"
      ref={mergeRefs((el) => (ref = el), mergedProps.ref as any)}
      type={elementType()}
      role={!isNativeButton() && !isNativeLink() ? 'button' : undefined}
      tabIndex={!isNativeButton() && !isNativeLink() && !mergedProps.disabled ? 0 : undefined}
      disabled={disabled()}
      aria-disabled={disabled()}
      data-disabled={disabled() ? '' : undefined}
      data-size={mergedProps.size}
      data-loading={mergedProps.loading}
      data-color={mergedProps.color}
      data-variant={mergedProps.variant}
      class={['slp-button', style.button, mergedProps.class]}
      {...others}
    >
      <span data-slot="loader" />
      <span data-slot="icon">{mergedProps.leftSection}</span>
      <span data-slot="label">{mergedProps.children}</span>
      <span data-slot="icon">{mergedProps.rightSection}</span>
    </Polymorphic>
  );
}
