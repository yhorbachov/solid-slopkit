import type { SlopSize } from '../../core';

export const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type Breakpoint = (typeof BREAKPOINTS)[number];

/** A value for every width, or per breakpoint. Mobile-first: each breakpoint applies from its min-width up. */
export type ResponsiveValue<T> = T | Partial<Record<'base' | Breakpoint, T>>;

export type PaddingSide = 'pt' | 'pr' | 'pb' | 'pl';

/** Padding as theme spacing sizes, read from `--slp-spacing-<size>`. */
export interface BoxPaddingProps {
  p?: ResponsiveValue<SlopSize>;
  px?: ResponsiveValue<SlopSize>;
  py?: ResponsiveValue<SlopSize>;
  pt?: ResponsiveValue<SlopSize>;
  pr?: ResponsiveValue<SlopSize>;
  pb?: ResponsiveValue<SlopSize>;
  pl?: ResponsiveValue<SlopSize>;
}

export const PADDING_PROPS = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'] as const satisfies (keyof BoxPaddingProps)[];

// Most specific prop first: a side prop wins over its axis, the axis over `p`.
const SIDE_SOURCES: Record<PaddingSide, (keyof BoxPaddingProps)[]> = {
  pt: ['pt', 'py', 'p'],
  pr: ['pr', 'px', 'p'],
  pb: ['pb', 'py', 'p'],
  pl: ['pl', 'px', 'p'],
};

function toBreakpoints<T>(value: ResponsiveValue<T> | undefined): Partial<Record<'base' | Breakpoint, T>> {
  if (value === undefined) return {};
  return typeof value === 'object' && value !== null ? (value as Partial<Record<'base' | Breakpoint, T>>) : { base: value };
}

/**
 * Resolves padding props into class names for `box.module.css`: `pl-md` below the first breakpoint,
 * `md-pl-lg` from `md` up. Each prop carries its value up through the breakpoints first, then the most
 * specific prop wins at each breakpoint: `p={{ md: 'xl' }} pl="xs"` keeps the left side at `xs` everywhere.
 * A class is only added where the side's size changes.
 */
export function resolvePaddingClasses(props: BoxPaddingProps): string[] {
  const classes: string[] = [];

  for (const side of Object.keys(SIDE_SOURCES) as PaddingSide[]) {
    const sources = SIDE_SOURCES[side].map((source) => toBreakpoints(props[source]));
    const current: (SlopSize | undefined)[] = sources.map(() => undefined);
    let previous: SlopSize | undefined;

    for (const key of ['base', ...BREAKPOINTS] as const) {
      sources.forEach((source, index) => {
        if (source[key] !== undefined) current[index] = source[key];
      });

      const size = current.find((value) => value !== undefined);
      if (size === undefined || size === previous) continue;

      classes.push(key === 'base' ? `${side}-${size}` : `${key}-${side}-${size}`);
      previous = size;
    }
  }

  return classes;
}
