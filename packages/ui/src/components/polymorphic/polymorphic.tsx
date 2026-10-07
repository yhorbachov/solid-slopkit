import type { OverrideProps } from '../../utils';
import { omit } from 'solid-js';
import type { ValidComponent, ComponentProps } from '@solidjs/web';
import { dynamic, type JSX } from '@solidjs/web';

export type ElementOf<T> = T extends HTMLElement ? T : T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : any;

export interface PolymorphicAttributes<T extends ValidComponent> {
  as?: T | keyof JSX.HTMLElementTags;
}

/**
 * Props used by a polymorphic component.
 */
export type PolymorphicProps<T extends ValidComponent, Props extends {} = {}> = OverrideProps<
  ComponentProps<T>,
  Props & PolymorphicAttributes<T>
>;

/**
 * Helper type to get the exact props in Polymnorphic `as` callback.
 */
export type PolymorphicCallbackProps<CustomProps extends {}, Options extends {}, RenderProps extends {}> = Omit<
  CustomProps,
  keyof Options | keyof RenderProps
> &
  RenderProps;

export function Polymorphic<RenderProps>(props: RenderProps & PolymorphicAttributes<ValidComponent>): JSX.Element {
  const others = omit(props, 'as');
  const Element = dynamic(() => props.as);

  return <Element {...others} />;
}
