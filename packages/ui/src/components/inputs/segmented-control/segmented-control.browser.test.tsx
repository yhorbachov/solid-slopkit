import { render } from '@solidjs/testing-library';
import { userEvent } from 'vitest/browser';
import { describe, expect, test } from 'vitest';
import { SegmentedControl } from './segmented-control';

// Rounded, since offsets are whole pixels and bounding rects are not.
const box = (el: Element) => {
  const { left, top, width, height } = el.getBoundingClientRect();
  return { left: Math.round(left), top: Math.round(top), width: Math.round(width), height: Math.round(height) };
};

describe('<SegmentedControl /> in a browser', () => {
  test('the indicator covers the selected item, and follows a click', async () => {
    const { getByRole, getByText } = render(() => (
      <SegmentedControl aria-label="Framework" data={['React', 'Solid', 'Svelte']} transitionDuration={0} />
    ));
    const group = getByRole('radiogroup');
    // The first child, until slots land in M0.29.
    const indicator = group.firstElementChild!;
    const item = (label: string) => getByText(label).parentElement!;

    await expect.poll(() => box(indicator)).toEqual(box(item('React')));

    await userEvent.click(getByText('Svelte'));

    await expect.poll(() => box(indicator)).toEqual(box(item('Svelte')));
    expect(box(item('Svelte')).left).toBeGreaterThan(box(item('React')).left);
  });
});
