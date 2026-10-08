import { createMemo, omit } from 'solid-js';
import { Polymorphic, type ElementOf, type PolymorphicProps } from '../polymorphic';
import style from './button.module.css';
import { type JSX, type ValidComponent } from '@solidjs/web';
import { mergeDefaultProps, mergeRefs } from '../../utils';
import { createTagName } from '../primitives';
import { isButton } from './is-button';
import type { SlopColor, SlopSize } from '../../core';

export interface ButtonRootOptions {}

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'dash' | 'ghost' | 'link';

export type ButtonShape = 'default' | 'square' | 'circle';

type ButtonRootCommonProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  disabled?: boolean;
  type: string | undefined;
  ref: T | ((el: T) => void);
  tabIndex: number | string | undefined;
  class?: JSX.ClassValue | JSX.RemoveAttribute;

  /** Visual style. Defaults to `solid`. */
  variant?: ButtonVariant;

  /** Theme color. Without one the button uses the base colors. */
  color?: SlopColor;

  /** Defaults to `md`. */
  size?: SlopSize;

  /** `square` and `circle` make a fixed-width button for a single icon. */
  shape?: ButtonShape;

  /** Stretches the button to the width of its container. */
  fullWidth?: boolean;

  /** Forces the pressed look, e.g. for a toggled button. */
  active?: boolean;

  /** Shows a spinner over the content and disables the button. */
  loading?: boolean;

  /** Content before the label, usually an icon. */
  leftSection?: JSX.Element;

  /** Content after the label, usually an icon. */
  rightSection?: JSX.Element;
};

export interface ButtonRootRenderProps extends ButtonRootCommonProps {
  role: 'menuitem' | 'button' | undefined;
  'aria-disabled': 'true' | undefined;
  'aria-busy': 'true' | undefined;
  'data-disabled': string | undefined;
}

export type ButtonRootProps<T extends ValidComponent | HTMLElement = HTMLElement> = ButtonRootOptions &
  Partial<ButtonRootCommonProps<ElementOf<T>>>;

export function Button<T extends ValidComponent = 'button'>(props: PolymorphicProps<T, ButtonRootProps<T>>) {
  let ref: HTMLElement | undefined;

  const mergedProps = mergeDefaultProps(
    { type: 'button', size: 'md', variant: 'solid', shape: 'default' },
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
    'shape',
    'fullWidth',
    'active',
  );
  const tagName = createTagName(
    () => ref,
    () => (props as { as?: ValidComponent }).as ?? 'button',
  );

  const isNativeButton = createMemo(() => {
    const elementTagName = tagName();
    if (!elementTagName) return false;
    return isButton({ tagName: elementTagName, type: mergedProps.type });
  });

  const isNativeInput = createMemo(() => tagName() === 'input');

  // Read from props, not the DOM, so it stays reactive and works during SSR.
  const isNativeLink = createMemo(() => tagName() === 'a' && (props as { href?: string }).href != null);

  const isNativeControl = createMemo(() => isNativeButton() || isNativeInput());

  // Loading blocks interaction like `disabled`, but keeps the button's own look.
  const isInert = createMemo(() => !!mergedProps.disabled || !!mergedProps.loading);

  const elementType = createMemo(() => (isNativeControl() ? mergedProps.type : undefined));

  // Kept in a memo rather than inline in the JSX: an inline ternary on a call compiles to a
  // lazily-created memo on the server, which shifts hydration keys against the client.
  const nativeDisabled = createMemo(() => (isNativeControl() ? isInert() : undefined));

  return (
    <Polymorphic<ButtonRootRenderProps>
      as="button"
      ref={mergeRefs((el) => (ref = el), mergedProps.ref as any)}
      type={elementType()}
      role={!isNativeButton() && !isNativeLink() ? 'button' : undefined}
      tabIndex={!isNativeButton() && !isNativeLink() && !isInert() ? 0 : undefined}
      disabled={nativeDisabled()}
      aria-disabled={!isNativeControl() && isInert() ? 'true' : undefined}
      aria-busy={mergedProps.loading ? 'true' : undefined}
      data-disabled={mergedProps.disabled ? '' : undefined}
      data-loading={mergedProps.loading ? '' : undefined}
      data-active={mergedProps.active ? '' : undefined}
      data-full-width={mergedProps.fullWidth ? '' : undefined}
      data-size={mergedProps.size}
      data-color={mergedProps.color}
      data-variant={mergedProps.variant}
      data-shape={mergedProps.shape}
      class={['slp-button', style.button, mergedProps.class]}
      {...others}
    >
      <span data-slot="loader" aria-hidden="true" />
      <span data-slot="icon">{mergedProps.leftSection}</span>
      <span data-slot="label">{mergedProps.children}</span>
      <span data-slot="icon">{mergedProps.rightSection}</span>
    </Polymorphic>
  );
}
