import { render } from '@solidjs/testing-library';
import { userEvent } from 'vitest/browser';
import { describe, expect, test, vi } from 'vitest';
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
    const indicator = group.querySelector('[data-slot="segmented-control-indicator"]')!;
    const item = (label: string) => getByText(label).closest('[data-slot="segmented-control-item"]')!;

    await expect.poll(() => box(indicator)).toEqual(box(item('React')));

    await userEvent.click(getByText('Svelte'));

    await expect.poll(() => box(indicator)).toEqual(box(item('Svelte')));
    expect(box(item('Svelte')).left).toBeGreaterThan(box(item('React')).left);
  });

  test('Tab reaches the selected item, and arrow keys move the selection past disabled items', async () => {
    const onChange = vi.fn();
    const { getByLabelText } = render(() => (
      <SegmentedControl
        aria-label="Framework"
        data={['React', { value: 'Vue', label: 'Vue', disabled: true }, 'Solid']}
        defaultValue="React"
        onChange={onChange}
        transitionDuration={0}
      />
    ));

    await userEvent.tab();
    expect(getByLabelText('React')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(getByLabelText('Solid')).toHaveFocus();
    expect(getByLabelText('Solid')).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('Solid');

    await userEvent.keyboard('{ArrowLeft}');
    expect(getByLabelText('React')).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('React');
  });

  test('read-only: arrow keys move focus but the selection stays', async () => {
    const onChange = vi.fn();
    const { getByLabelText } = render(() => (
      <SegmentedControl aria-label="Framework" data={['React', 'Solid']} readOnly onChange={onChange} transitionDuration={0} />
    ));

    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');

    expect(getByLabelText('React')).toBeChecked();
    expect(getByLabelText('Solid')).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });
});
