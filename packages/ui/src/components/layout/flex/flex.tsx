import { omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FLEX_STYLE_PROPS, createStyleClasses, joinClass, type FlexStyleProps, type StyleGroup } from '../../../style-props';

export type FlexProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof FlexStyleProps> & FlexStyleProps;

const FLEX_GROUPS: StyleGroup[] = ['flex'];

/** A `div` that is a flex container, with flex style props. For spacing and size, nest it in or around a Box. */
export function Flex(props: FlexProps) {
  const others = omit(props, 'class', ...FLEX_STYLE_PROPS);
  const styleClasses = createStyleClasses(props, FLEX_GROUPS, 'Flex');

  return <div class={joinClass(['slp-flex', styleClasses()], props.class)} {...others} />;
}
