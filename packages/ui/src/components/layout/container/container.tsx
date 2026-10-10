import { omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './container.module.css';
import {
  CONTAINER_STYLE_PROPS,
  createStyleClasses,
  joinClass,
  type ContainerStyleProps,
  type StyleGroup,
} from '../../../style-props';

export type ContainerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof ContainerStyleProps | 'fluid'> &
  ContainerStyleProps & {
    /** Full width, ignoring `size`. The padding stays. */
    fluid?: boolean;
  };

const CONTAINER_GROUPS: StyleGroup[] = ['container'];

/** Centers its content horizontally with a max width and inline padding. */
export function Container(props: ContainerProps) {
  const others = omit(props, 'class', 'fluid', ...CONTAINER_STYLE_PROPS);
  const styleClasses = createStyleClasses(
    {
      get size() {
        return props.fluid ? '100%' : props.size;
      },
    },
    CONTAINER_GROUPS,
    'Container',
  );

  return <div class={joinClass(['slp-container', style.container, styleClasses()], props.class)} {...others} />;
}
