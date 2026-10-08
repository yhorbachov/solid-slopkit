import { createMemo, omit } from 'solid-js';
import { Polymorphic, type PolymorphicProps } from '../polymorphic';
import { mergeStyles } from '../../utils';
import { type JSX, type ValidComponent } from '@solidjs/web';
import style from './box.module.css';

type BoxCommonProps = {
  children?: JSX.Element;
  class?: JSX.ClassValue | JSX.RemoveAttribute;
  style?: JSX.CSSProperties | string | JSX.RemoveAttribute;
};

export function Box<T extends ValidComponent = 'div'>(props: PolymorphicProps<T, BoxCommonProps>) {
  const others = omit(props, 'class', 'style');

  const cssVariables = createMemo<JSX.CSSProperties>(() => {
    return {
      '--foo': 'bar',
    };
  });

  return (
    <Polymorphic
      as="div"
      class={['slp-box', style.box, props.class]}
      style={mergeStyles(cssVariables(), props.style)}
      {...others}
    />
  );
}
