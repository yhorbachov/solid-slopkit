// The default theme's contrast rule (M8.02): every role reaches 4.5:1 against its content color, and as text on
// base-100, in both color schemes. Warning as text is the one exception the theme's comment names.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'default-theme.css'), 'utf8');

const BLACK = '#000000';
const WHITE = '#ffffff';

/** A token's value in each scheme: both arguments of `light-dark()`, or the one value twice. */
function token(name: string): { light: string; dark: string } {
  const value = css.match(new RegExp(`--slp-${name}:\\s*([^;]+);`))?.[1].trim();
  if (!value) throw new Error(`--slp-${name} is not set`);
  const hex = (color: string) => (color === 'oklch(0% 0 0)' ? BLACK : color === 'oklch(100% 0 0)' ? WHITE : color);
  const pair = value.match(/^light-dark\((.+),\s*(.+)\)$/);
  return pair ? { light: hex(pair[1].trim()), dark: hex(pair[2].trim()) } : { light: hex(value), dark: hex(value) };
}

function luminance(color: string): number {
  const channels = [1, 3, 5].map((index) => parseInt(color.slice(index, index + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

const ROLES = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
const SCHEMES = ['light', 'dark'] as const;

describe('default theme contrast', () => {
  test.each(SCHEMES.flatMap((scheme) => ROLES.map((role) => [scheme, role] as const)))(
    '%s %s reaches 4.5:1 against its content color',
    (scheme, role) => {
      expect(contrast(token(`color-${role}`)[scheme], token(`color-${role}-content`)[scheme])).toBeGreaterThanOrEqual(4.5);
    },
  );

  test.each(SCHEMES.flatMap((scheme) => ROLES.filter((role) => role !== 'warning').map((role) => [scheme, role] as const)))(
    '%s %s reaches 4.5:1 as text on base-100',
    (scheme, role) => {
      expect(contrast(token(`color-${role}`)[scheme], token('color-base-100')[scheme])).toBeGreaterThanOrEqual(4.5);
    },
  );

  test('warning reaches 4.5:1 as text on base-100 in dark', () => {
    expect(contrast(token('color-warning').dark, token('color-base-100').dark)).toBeGreaterThanOrEqual(4.5);
  });

  test.each(SCHEMES.flatMap((scheme) => ['base-100', 'base-200', 'base-300', 'muted'].map((base) => [scheme, base] as const)))(
    '%s muted-content reaches 4.5:1 on %s',
    (scheme, base) => {
      expect(contrast(token('color-muted-content')[scheme], token(`color-${base}`)[scheme])).toBeGreaterThanOrEqual(4.5);
    },
  );

  test.each(SCHEMES.flatMap((scheme) => ['base-100', 'base-200', 'base-300', 'muted'].map((base) => [scheme, base] as const)))(
    '%s base-content reaches 4.5:1 on %s',
    (scheme, base) => {
      expect(contrast(token('color-base-content')[scheme], token(`color-${base}`)[scheme])).toBeGreaterThanOrEqual(4.5);
    },
  );
});
