export const BREAKPOINTS = { xs: '36em', sm: '48em', md: '62em', lg: '75em', xl: '88em' } as const;
export type Breakpoint = keyof typeof BREAKPOINTS;

/** A value for every width, or per breakpoint. Mobile-first: each breakpoint applies from its min-width up. */
export type ResponsiveValue<T> = T | Partial<Record<'base' | Breakpoint, T>>;

/** Padding in spacing units: `4` is `calc(var(--slp-spacing) * 4)`, 1rem with the default 0.25rem unit. */
export interface BoxPaddingProps {
  p?: ResponsiveValue<number>;
  px?: ResponsiveValue<number>;
  py?: ResponsiveValue<number>;
  pt?: ResponsiveValue<number>;
  pr?: ResponsiveValue<number>;
  pb?: ResponsiveValue<number>;
  pl?: ResponsiveValue<number>;
}

export const PADDING_PROPS = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'] as const satisfies (keyof BoxPaddingProps)[];

// Most specific prop first: a side prop wins over its axis, the axis over `p`.
const SIDES = {
  'padding-top': ['pt', 'py', 'p'],
  'padding-right': ['pr', 'px', 'p'],
  'padding-bottom': ['pb', 'py', 'p'],
  'padding-left': ['pl', 'px', 'p'],
} as const satisfies Record<string, (keyof BoxPaddingProps)[]>;

type Key = 'base' | Breakpoint;
const KEYS = ['base', ...(Object.keys(BREAKPOINTS) as Breakpoint[])] as const;

function toBreakpoints<T>(value: ResponsiveValue<T> | undefined): Partial<Record<Key, T>> {
  if (value === undefined) return {};
  return typeof value === 'object' && value !== null ? (value as Partial<Record<Key, T>>) : { base: value };
}

function spacing(value: number): string {
  return value === 0 ? '0' : `calc(var(--slp-spacing) * ${value})`;
}

/**
 * Resolves padding props into declarations per breakpoint. Each prop carries its value up through the
 * breakpoints first, then the most specific prop wins at each breakpoint: `p={{ md: 8 }} pl={2}` keeps the
 * left side at 2 everywhere. A declaration is only emitted where the side's value changes.
 */
export function resolvePadding(props: BoxPaddingProps): Partial<Record<Key, string[]>> {
  const declarations: Partial<Record<Key, string[]>> = {};

  for (const [property, sourceKeys] of Object.entries(SIDES)) {
    const sources = sourceKeys.map((source) => toBreakpoints(props[source]));
    const current: (number | undefined)[] = sources.map(() => undefined);
    let previous: number | undefined;

    for (const key of KEYS) {
      sources.forEach((source, index) => {
        if (source[key] !== undefined) current[index] = source[key];
      });

      const value = current.find((value) => value !== undefined);
      if (value === undefined || value === previous) continue;

      (declarations[key] ??= []).push(`${property}:${spacing(value)}`);
      previous = value;
    }
  }

  return declarations;
}

/** CSS for `selector`, in the components layer so unlayered user CSS still wins. */
export function paddingCss(selector: string, declarations: Partial<Record<Key, string[]>>): string {
  const rules = KEYS.filter((key) => declarations[key]).map((key) => {
    const rule = `${selector}{${declarations[key]!.join(';')}}`;
    return key === 'base' ? rule : `@media (min-width:${BREAKPOINTS[key]}){${rule}}`;
  });
  return `@layer slopkit.components{${rules.join('')}}`;
}
