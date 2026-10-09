export const BREAKPOINTS = { xs: '36em', sm: '48em', md: '62em', lg: '75em', xl: '88em' } as const;
export type Breakpoint = keyof typeof BREAKPOINTS;

/** A value for every width, or per breakpoint. Mobile-first: each breakpoint applies from its min-width up. */
export type ResponsiveValue<T> = T | Partial<Record<'base' | Breakpoint, T>>;

/** Spacing units: `4` is `calc(var(--slp-spacing) * 4)`, 1rem with the default 0.25rem unit. */
export type SpacingValue = number;

/** Spacing units, negative to pull, or `auto`. */
export type MarginValue = number | 'auto';

export interface BoxPaddingProps {
  p?: ResponsiveValue<SpacingValue>;
  px?: ResponsiveValue<SpacingValue>;
  py?: ResponsiveValue<SpacingValue>;
  pt?: ResponsiveValue<SpacingValue>;
  pr?: ResponsiveValue<SpacingValue>;
  pb?: ResponsiveValue<SpacingValue>;
  pl?: ResponsiveValue<SpacingValue>;
}

export interface BoxMarginProps {
  m?: ResponsiveValue<MarginValue>;
  mx?: ResponsiveValue<MarginValue>;
  my?: ResponsiveValue<MarginValue>;
  mt?: ResponsiveValue<MarginValue>;
  mr?: ResponsiveValue<MarginValue>;
  mb?: ResponsiveValue<MarginValue>;
  ml?: ResponsiveValue<MarginValue>;
}

/** Spacing units, or any CSS length such as `'100%'` or `'auto'`. */
export type SizeValue = number | (string & {});

export interface BoxSizeProps {
  w?: ResponsiveValue<SizeValue>;
  h?: ResponsiveValue<SizeValue>;
}

export type BoxStyleProps = BoxPaddingProps & BoxMarginProps & BoxSizeProps;

export const STYLE_PROPS = [
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'w',
  'h',
] as const satisfies (keyof BoxStyleProps)[];

// Each CSS property and the props that set it, most specific first: a side prop wins over its axis, the
// axis over the shorthand.
const PROPERTIES = {
  'padding-top': ['pt', 'py', 'p'],
  'padding-right': ['pr', 'px', 'p'],
  'padding-bottom': ['pb', 'py', 'p'],
  'padding-left': ['pl', 'px', 'p'],
  'margin-top': ['mt', 'my', 'm'],
  'margin-right': ['mr', 'mx', 'm'],
  'margin-bottom': ['mb', 'my', 'm'],
  'margin-left': ['ml', 'mx', 'm'],
  width: ['w'],
  height: ['h'],
} as const satisfies Record<string, (keyof BoxStyleProps)[]>;

type Key = 'base' | Breakpoint;
const KEYS = ['base', ...(Object.keys(BREAKPOINTS) as Breakpoint[])] as const;

export type StyleDeclarations = Partial<Record<Key, string[]>>;

function toBreakpoints<T>(value: ResponsiveValue<T> | undefined): Partial<Record<Key, T>> {
  if (value === undefined) return {};
  return typeof value === 'object' && value !== null ? (value as Partial<Record<Key, T>>) : { base: value };
}

// The CSS goes into a generated <style>, so a string must not be able to close the rule or the tag.
const UNSAFE_VALUE = /[;{}<>]/;

function cssValue(value: SizeValue): string | undefined {
  if (typeof value === 'string') return UNSAFE_VALUE.test(value) ? undefined : value;
  return value === 0 ? '0' : `calc(var(--slp-spacing) * ${value})`;
}

/**
 * Resolves style props into declarations per breakpoint. Each prop carries its value up through the
 * breakpoints first, then the most specific prop wins at each breakpoint: `p={{ md: 8 }} pl={2}` keeps the
 * left side at 2 everywhere. A declaration is only emitted where the property's value changes, and always
 * in the same order, so props that resolve to the same CSS produce the same declarations.
 */
export function resolveStyleProps(props: BoxStyleProps): StyleDeclarations {
  const declarations: StyleDeclarations = {};

  for (const [property, sourceKeys] of Object.entries(PROPERTIES)) {
    const sources = sourceKeys.map((source) => toBreakpoints<SizeValue>(props[source]));
    const current: (SizeValue | undefined)[] = sources.map(() => undefined);
    let previous: string | undefined;

    for (const key of KEYS) {
      sources.forEach((source, index) => {
        if (source[key] !== undefined) current[index] = source[key];
      });

      const value = current.find((value) => value !== undefined);
      const css = value === undefined ? undefined : cssValue(value);
      if (css === undefined || css === previous) continue;

      (declarations[key] ??= []).push(`${property}:${css}`);
      previous = css;
    }
  }

  return declarations;
}

/** CSS for `selector`, in the components layer so unlayered user CSS still wins. */
export function styleCss(selector: string, declarations: StyleDeclarations): string {
  const rules = KEYS.filter((key) => declarations[key]).map((key) => {
    const rule = `${selector}{${declarations[key]!.join(';')}}`;
    return key === 'base' ? rule : `@media (min-width:${BREAKPOINTS[key]}){${rule}}`;
  });
  return `@layer slopkit.components{${rules.join('')}}`;
}
