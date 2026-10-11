import { render } from '@solidjs/testing-library';
import { userEvent } from 'vitest/browser';
import { describe, expect, test, vi } from 'vitest';
import { Button } from './button';

describe('<Button /> in a browser', () => {
  test('Tab reaches buttons in order and skips disabled ones; Enter and Space press them', async () => {
    const onSave = vi.fn();
    const onDiv = vi.fn();
    const { getByRole } = render(() => (
      <>
        <Button onClick={onSave}>Save</Button>
        <Button disabled>Disabled</Button>
        <Button as="div" disabled>
          Disabled div
        </Button>
        <Button as="div" onClick={onDiv}>
          Div
        </Button>
      </>
    ));

    await userEvent.tab();
    expect(getByRole('button', { name: 'Save' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onSave).toHaveBeenCalledTimes(2);

    await userEvent.tab();
    expect(getByRole('button', { name: 'Div' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onDiv).toHaveBeenCalledTimes(2);
  });

  test('Space on a role="button" element does not scroll the page', async () => {
    const { getByRole } = render(() => (
      <div style={{ height: '300vh' }}>
        <Button as="div">Div</Button>
      </div>
    ));
    getByRole('button', { name: 'Div' }).focus();

    await userEvent.keyboard(' ');
    expect(window.scrollY).toBe(0);
  });

  test('a medium button is 8 field units tall, and focus shows an outline', async () => {
    const { getByRole } = render(() => <Button color="primary">Save</Button>);
    const button = getByRole('button', { name: 'Save' });

    expect(button.getBoundingClientRect().height).toBe(32);
    await userEvent.tab();
    expect(getComputedStyle(button).outlineStyle).toBe('solid');
  });
});
