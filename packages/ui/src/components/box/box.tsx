import { createMemo, omit } from 'solid-js';
import { Style } from '@solidjs/meta';
import { Polymorphic, type PolymorphicProps } from '../polymorphic';
import { type JSX, type ValidComponent } from '@solidjs/web';
import { hash } from '../../utils';
import { STYLE_PROPS, resolveStyleProps, styleCss, type BoxStyleProps, type StyleGroup } from './style-props';
import style from './box.module.css';

type BoxCommonProps = BoxStyleProps & {
  children?: JSX.Element;
  class?: JSX.ClassValue | JSX.RemoveAttribute;
};

// One class per distinct set of declarations in a group. Boxes with the same declarations share the class,
// and the shared `key` makes the head registry keep a single <style> for it.
function createStyleClass(props: BoxStyleProps, group: StyleGroup) {
  return createMemo(
    () => {
      const declarations = resolveStyleProps(props, group);
      if (Object.keys(declarations).length === 0) return undefined;
      const className = `slp-box-${hash(JSON.stringify(declarations))}`;
      return { className, css: styleCss(`.${className}`, declarations) };
    },
    { name: `Box.${group}` },
  );
}

export function Box<T extends ValidComponent = 'div'>(props: PolymorphicProps<T, BoxCommonProps>) {
  const others = omit(props, 'class', ...STYLE_PROPS);

  const spacing = createStyleClass(props, 'spacing');
  const size = createStyleClass(props, 'size');

  return (
    <>
      {spacing() && <Style key={spacing()!.className}>{spacing()!.css}</Style>}
      {size() && <Style key={size()!.className}>{size()!.css}</Style>}
      <Polymorphic as="div" class={['slp-box', style.box, spacing()?.className, size()?.className, props.class]} {...others} />
    </>
  );
}
