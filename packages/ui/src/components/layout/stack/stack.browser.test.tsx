import { render } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { describe, expect, test } from 'vitest';
import { SlopkitUi } from '../../provider';
import { Box } from '../box';
import { Stack } from './stack';

const rect = (el: Element) => {
  const { left, top, width } = el.getBoundingClientRect();
  return { left: Math.round(left), top: Math.round(top), width: Math.round(width) };
};

describe('<Stack /> in a browser', () => {
  test('stacks children vertically, a gap of 4 apart, stretched to its width', async () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Stack data-testid="stack" style={{ width: '200px' }}>
          <Box data-testid="a" h={10} />
          <Box data-testid="b" h={10} />
        </Stack>
      </SlopkitUi>
    ));
    flush();
    const a = () => rect(getByTestId('a'));
    const b = () => rect(getByTestId('b'));

    await expect.poll(() => b().top - a().top).toBe(40 + 16);
    expect(b().left).toBe(a().left);
    expect(a().width).toBe(200);
  });

  test('align="center" centers children at their own width', async () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Stack data-testid="stack" align="center" gap={2} style={{ width: '200px' }}>
          <Box data-testid="a" w={10} h={10} />
        </Stack>
      </SlopkitUi>
    ));
    flush();
    const offset = () => {
      const stack = rect(getByTestId('stack'));
      const a = rect(getByTestId('a'));
      return { left: a.left - stack.left, top: a.top - stack.top, width: a.width };
    };

    await expect.poll(offset).toEqual({ left: 80, top: 0, width: 40 });
  });

  test('divided centers a line in the gap between children, which stay a gap apart', async () => {
    const { getByTestId } = render(() => (
      <SlopkitUi>
        <Stack divided gap={4} style={{ width: '200px' }}>
          <Box data-testid="a" h={10} />
          <Box data-testid="b" h={10} />
          <Box data-testid="c" h={10} />
        </Stack>
      </SlopkitUi>
    ));
    flush();
    const a = getByTestId('a');
    const b = getByTestId('b');
    const box = (el: Element) => el.getBoundingClientRect();

    // b's border box starts 8px below a (half the gap); its 1px line, then 8px of padding, then its content.
    await expect.poll(() => Math.round(box(b).top - box(a).bottom)).toBe(8);
    const css = getComputedStyle(b);
    expect([css.borderTopWidth, css.borderTopStyle, css.paddingTop]).toEqual(['1px', 'solid', '8px']);
    expect(getComputedStyle(a).borderTopStyle).toBe('none');
    expect(getComputedStyle(getByTestId('c')).borderTopStyle).toBe('solid');
  });
});
