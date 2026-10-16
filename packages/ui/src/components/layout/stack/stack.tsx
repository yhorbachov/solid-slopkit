import { createMemo, omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import style from './stack.module.css';
import { Flex } from '../flex';
import { joinClass, type FlexAlign, type FlexJustify, type SpacingValue } from '../../../style-props';
import type { ElementProps } from '../../../utils';

export interface StackOwnProps {
  /** Space between children, in spacing units. Default `4`. */
  gap?: SpacingValue;
  /** `align-items`. Default `'stretch'`. */
  align?: FlexAlign;
  /** `justify-content`. Default `'flex-start'`. */
  justify?: FlexJustify;
  /** Draws a line between children, in the middle of the gap. */
  divided?: boolean;
}

export type StackProps = ElementProps<JSX.HTMLAttributes<HTMLDivElement>, StackOwnProps>;

/** Stacks children vertically: a column Flex with a gap. Its props are not responsive; for that, use Flex. */
export function Stack(props: StackProps) {
  const others = omit(props, 'class', 'style', 'gap', 'align', 'justify', 'divided');

  // The dividers' CSS can't read the flex gap, so a divided Stack passes it on.
  const styleValue = createMemo(
    () =>
      props.divided
        ? { ...(props.style as JSX.CSSProperties | undefined), '--_stack-gap': `calc(var(--slp-spacing) * ${props.gap ?? 4})` }
        : props.style,
    { name: 'Stack.style' },
  );

  return (
    <Flex
      class={joinClass(['slp-stack', style.stack], props.class)}
      style={styleValue()}
      data-divided={props.divided ? '' : undefined}
      direction="column"
      gap={props.gap ?? 4}
      align={props.align ?? 'stretch'}
      justify={props.justify ?? 'flex-start'}
      {...others}
    />
  );
}
