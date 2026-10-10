import { omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './space.module.css';
import { createStyleClasses, joinClass, type BoxSizeProps, type StyleGroup } from '../../../style-props';

export type SpaceStyleProps = Pick<BoxSizeProps, 'w' | 'h'>;

export type SpaceProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof SpaceStyleProps> & SpaceStyleProps;

const SPACE_GROUPS: StyleGroup[] = ['size'];

/** Empty space between elements: `h` for vertical space, `w` for horizontal space in a row. */
export function Space(props: SpaceProps) {
  const others = omit(props, 'class', 'w', 'h');
  const styleClasses = createStyleClasses(props, SPACE_GROUPS, 'Space');

  return <div class={joinClass(['slp-space', style.space, styleClasses()], props.class)} {...others} />;
}
