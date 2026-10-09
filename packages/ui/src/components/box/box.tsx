import { createMemo, omit } from 'solid-js';
import { Style } from '@solidjs/meta';
import { Polymorphic, type PolymorphicProps } from '../polymorphic';
import { type JSX, type ValidComponent } from '@solidjs/web';
import { hash } from '../../utils';
import { STYLE_PROPS, resolveStyleProps, styleCss, type BoxStyleProps } from './style-props';
import style from './box.module.css';

type BoxCommonProps = BoxStyleProps & {
  children?: JSX.Element;
  class?: JSX.ClassValue | JSX.RemoveAttribute;
};

export function Box<T extends ValidComponent = 'div'>(props: PolymorphicProps<T, BoxCommonProps>) {
  const others = omit(props, 'class', ...STYLE_PROPS);

  // One class per distinct set of declarations. Boxes with the same style props share the class, and the
  // shared `key` makes the head registry keep a single <style> for it.
  const styles = createMemo(
    () => {
      const declarations = resolveStyleProps(props);
      if (Object.keys(declarations).length === 0) return undefined;
      const className = `slp-box-${hash(JSON.stringify(declarations))}`;
      return { className, css: styleCss(`.${className}`, declarations) };
    },
    { name: 'Box.styles' },
  );

  return (
    <>
      {styles() && <Style key={styles()!.className}>{styles()!.css}</Style>}
      <Polymorphic as="div" class={['slp-box', style.box, styles()?.className, props.class]} {...others} />
    </>
  );
}
