import { createMemo, omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useSlopkitUi } from '../provider/slopkit-ui';
import { STYLE_GROUP_NAMES, STYLE_PROPS, resolveStyleClass, type BoxStyleProps, type StyleGroup } from './style-props';
import style from './box.module.css';

export type BoxProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof BoxStyleProps> & BoxStyleProps;

// One class per distinct set of declarations in a group. Boxes with the same declarations share the class,
// and the provider adds its CSS once.
function registerStyleClass(
  props: BoxStyleProps,
  group: StyleGroup,
  registerStyle: (className: string, css: string) => void,
): string | undefined {
  const styleClass = resolveStyleClass(props, group);
  if (styleClass === undefined) return undefined;
  registerStyle(styleClass.className, styleClass.css);
  return styleClass.className;
}

// A string class is applied in one write; an array is normalized and applied entry by entry, which costs
// more per element. Only a user `class` that is an array or object needs the array form.
function joinClass(classes: (string | undefined)[], userClass: JSX.ClassValue | JSX.RemoveAttribute): JSX.ClassValue {
  if (userClass && typeof userClass !== 'string') return [...classes, userClass];
  let result = '';
  for (const value of classes) if (value) result += result ? ` ${value}` : value;
  return userClass ? `${result} ${userClass}` : result;
}

export function Box(props: BoxProps) {
  const others = omit(props, 'class', ...STYLE_PROPS);

  const { registerStyle } = useSlopkitUi('Box');

  // All groups in one memo: each Box pays for one computation, and a change in one group re-resolves the
  // others from the cache. Returns a string, so the class only updates when the result changes.
  const styleClasses = createMemo(
    () => {
      let result: string | undefined;
      for (const group of STYLE_GROUP_NAMES) {
        const className = registerStyleClass(props, group, registerStyle);
        if (className) result = result ? `${result} ${className}` : className;
      }
      return result;
    },
    { name: 'Box.styleClasses' },
  );

  return <div class={joinClass(['slp-box', style.box, styleClasses()], props.class)} {...others} />;
}
