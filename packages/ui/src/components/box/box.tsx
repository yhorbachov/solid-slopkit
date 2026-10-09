import { omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './box.module.css';
import { BOX_STYLE_PROPS, createStyleClasses, joinClass, type BoxStyleProps, type StyleGroup } from '../../style-props';

export type BoxProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof BoxStyleProps> & BoxStyleProps;

const BOX_GROUPS: StyleGroup[] = ['spacing', 'size', 'display'];

/** A `div` with spacing, size and display style props. */
export function Box(props: BoxProps) {
  const others = omit(props, 'class', ...BOX_STYLE_PROPS);
  const styleClasses = createStyleClasses(props, BOX_GROUPS, 'Box');

  return <div class={joinClass(['slp-box', style.box, styleClasses()], props.class)} {...others} />;
}
