import { createMemo, omit } from 'solid-js';
import { Polymorphic, type PolymorphicProps } from '../polymorphic';
import { type JSX, type ValidComponent } from '@solidjs/web';
import { useSlopkitUi } from '../provider/slopkit-ui';
import { STYLE_PROPS, resolveStyleClass, type BoxStyleProps, type StyleGroup } from './style-props';
import style from './box.module.css';

type BoxCommonProps = BoxStyleProps & {
  children?: JSX.Element;
  class?: JSX.ClassValue | JSX.RemoveAttribute;
};

// One class per distinct set of declarations in a group. Boxes with the same declarations share the class,
// and the provider adds its CSS once.
function createStyleClass(props: BoxStyleProps, group: StyleGroup, registerStyle: (className: string, css: string) => void) {
  return createMemo(
    () => {
      const styleClass = resolveStyleClass(props, group);
      if (styleClass === undefined) return undefined;
      registerStyle(styleClass.className, styleClass.css);
      return styleClass.className;
    },
    { name: `Box.${group}` },
  );
}

export function Box<T extends ValidComponent = 'div'>(props: PolymorphicProps<T, BoxCommonProps>) {
  const others = omit(props, 'class', ...STYLE_PROPS);

  const { registerStyle } = useSlopkitUi('Box');

  const spacing = createStyleClass(props, 'spacing', registerStyle);
  const size = createStyleClass(props, 'size', registerStyle);

  return <Polymorphic as="div" class={['slp-box', style.box, spacing(), size(), props.class]} {...others} />;
}
