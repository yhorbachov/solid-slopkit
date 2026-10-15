import { render } from '@solidjs/testing-library';
import { flush } from 'solid-js';
import { userEvent } from 'vitest/browser';
import { describe, expect, test } from 'vitest';
import { SlopkitUi } from '../../provider';
import { Spotlight } from './spotlight';
import type { SpotlightAction } from './spotlight-data';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('<Spotlight /> in a browser', () => {
  test('the shortcut opens it with focus in the search; the keyboard finds and triggers an action; focus goes back', async () => {
    const triggered: string[] = [];
    const actions: SpotlightAction[] = Array.from({ length: 30 }, (_, index) => ({
      id: `page-${index}`,
      label: `Page ${index}`,
      onTrigger: () => triggered.push(`page-${index}`),
    }));
    const { getByRole, container } = render(() => (
      <SlopkitUi>
        <button type="button">Before</button>
        <Spotlight actions={actions} />
      </SlopkitUi>
    ));
    flush();
    const before = getByRole('button', { name: 'Before' });
    before.focus();

    const mod = /mac/i.test(navigator.platform) ? 'Meta' : 'Control';
    await userEvent.keyboard(`{${mod}>}k{/${mod}}`);
    await wait(300);
    const dialog = container.querySelector('dialog')!;
    expect(dialog.matches(':modal')).toBe(true);
    const search = getByRole('combobox', { name: 'Search' });
    expect(search).toHaveFocus();

    // The active action is kept in view as the keyboard moves.
    await userEvent.keyboard('{ArrowUp}');
    const last = getByRole('option', { name: 'Page 29' });
    expect(last).toHaveAttribute('data-active');
    const list = getByRole('listbox').getBoundingClientRect();
    const box = last.getBoundingClientRect();
    expect(box.bottom).toBeLessThanOrEqual(list.bottom + 1);
    expect(box.top).toBeGreaterThanOrEqual(list.top - 1);

    await userEvent.keyboard('Page 1');
    expect(getByRole('option', { name: 'Page 1' })).toHaveAttribute('data-active');
    await userEvent.keyboard('2{Enter}');
    await wait(300);
    expect(triggered).toEqual(['page-12']);
    expect(container.querySelector('dialog')).toBeNull();
    expect(before).toHaveFocus();
  });

  test('a click on an action keeps focus in the search until it closes; Escape closes it', async () => {
    const triggered: string[] = [];
    const { getByRole, container } = render(() => (
      <SlopkitUi>
        <Spotlight
          actions={[
            { id: 'a', label: 'Alpha', onTrigger: () => triggered.push('a') },
            { id: 'b', label: 'Beta', onTrigger: () => triggered.push('b') },
          ]}
          closeOnActionTrigger={false}
        />
      </SlopkitUi>
    ));
    flush();
    const mod = /mac/i.test(navigator.platform) ? 'Meta' : 'Control';
    await userEvent.keyboard(`{${mod}>}k{/${mod}}`);
    await wait(300);

    await userEvent.click(getByRole('option', { name: 'Beta' }));
    expect(triggered).toEqual(['b']);
    expect(getByRole('combobox', { name: 'Search' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await wait(300);
    expect(container.querySelector('dialog')).toBeNull();
  });
});
