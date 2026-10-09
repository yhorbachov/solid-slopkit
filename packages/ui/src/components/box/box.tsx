import { createMemo, omit } from 'solid-js';
import { Polymorphic, type PolymorphicProps } from '../polymorphic';
import { type JSX, type ValidComponent } from '@solidjs/web';
import { PADDING_PROPS, resolvePaddingClasses, type BoxPaddingProps } from './style-props';
import style from './box.module.css';
import { Style } from '@solidjs/meta';

type BoxCommonProps = BoxPaddingProps & {
  children?: JSX.Element;
  class?: JSX.ClassValue | JSX.RemoveAttribute;
};

export function Box<T extends ValidComponent = 'div'>(props: PolymorphicProps<T, BoxCommonProps>) {
  const others = omit(props, 'class', ...PADDING_PROPS);
  const KEY = 'hash_key';

  const paddingClasses = createMemo(() => resolvePaddingClasses(props).map((name) => style[name]), {
    name: 'Box.paddingClasses',
  });

  return (
    <>
      <Style key={KEY}>{`.slp-box { background: yellow; }`}</Style>
      <Polymorphic as="div" class={['slp-box', style.box, paddingClasses(), props.class]} {...others} />
    </>
  );
}
