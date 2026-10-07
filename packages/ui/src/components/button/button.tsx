import { createMemo, omit, type ParentProps } from 'solid-js';
import { Polymorphic, type ElementOf, type PolymorphicProps } from '../polymorphic';
import style from './button.module.css';
import type { JSX, ValidComponent } from '@solidjs/web';
import { mergeDefaultProps, mergeRefs } from '../../utils';
import { createTagName } from '../primitives';
import { isButton } from './is-button';

export interface ButtonRootOptions {}

type ButtonRootCommonProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  disabled?: boolean;
  type: string | undefined;
  ref: T | ((el: T) => void);
  tabIndex: number | string | undefined;
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

  const mergedProps = mergeDefaultProps({ type: 'button' }, props as ButtonRootProps);
  const others = omit(mergedProps, 'ref', 'type', 'disabled');
  const tagName = createTagName(
    () => ref,
    () => 'button',
  );

  const isNativeButton = createMemo(() => {
    const elementTagName = tagName();
    if (!elementTagName) return false;
    return isButton({ tagName: elementTagName, type: props.type });
  });

  const isNativeInput = createMemo(() => tagName() === 'input');

  const isNativeLink = createMemo(() => {
    return tagName() === 'a' && ref?.getAttribute('href');
  });

  return (
    <Polymorphic<ButtonRootRenderProps>
      as="button"
      ref={mergeRefs((el) => (ref = el), props.ref as any)}
      type={isNativeButton() || isNativeInput() ? props.type : undefined}
      role={!isNativeButton() && !isNativeLink() ? 'button' : undefined}
      tabIndex={!isNativeButton() && !isNativeLink() && !props.disabled ? 0 : undefined}
      disabled={isNativeButton() || isNativeInput() ? props.disabled : undefined}
      aria-disabled={!isNativeButton() && !isNativeInput() && props.disabled ? true : undefined}
      data-disabled={props.disabled ? '' : undefined}
      {...others}
    />
  );
}
