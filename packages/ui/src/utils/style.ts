import type { JSX } from '@solidjs/web';

type StyleValue = JSX.CSSProperties | string | JSX.RemoveAttribute;

function styleToString(style: JSX.CSSProperties): string {
  return Object.entries(style)
    .filter(([, value]) => value != null)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}

/**
 * Merges `style` values, later ones winning. Objects merge into one object; if any value is a string,
 * all are joined into one CSS string instead, since parsing CSS text back into an object is lossy.
 */
export function mergeStyles(...styles: StyleValue[]): JSX.CSSProperties | string | undefined {
  const values = styles.filter(
    (style): style is JSX.CSSProperties | string =>
      typeof style === 'string' ? style.trim() !== '' : !!style && Object.keys(style).length > 0,
  );

  if (values.length === 0) return undefined;
  if (values.length === 1) return values[0];

  if (values.some((style) => typeof style === 'string')) {
    return values.map((style) => (typeof style === 'string' ? style : styleToString(style))).join(';');
  }

  return Object.assign({}, ...values);
}
