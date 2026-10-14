import { render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { userEvent } from 'vitest/browser';
import { describe, expect, test, vi } from 'vitest';
import axe from 'axe-core';
import { SlopkitUi } from '../../provider';
import { Spotlight, type SpotlightProps } from './spotlight';

function setup(props: Partial<SpotlightProps> = {}) {
  const [opened, setOpened] = createSignal(false);
  const trigger = vi.fn();
  const result = render(() => (
    <SlopkitUi>
      <button
        onClick={() => {
          setOpened(true);
          flush();
        }}
      >
        Open commands
      </button>
      <Spotlight
        opened={opened()}
        onClose={() => {
          setOpened(false);
          flush();
        }}
        transitionDuration={0}
        actions={[
          { id: 'home', label: 'Home' },
          { id: 'disabled', label: 'Disabled', disabled: true },
          { id: 'save', label: 'Save' },
        ]}
        onActionTrigger={trigger}
        {...props}
      />
    </SlopkitUi>
  ));
  const dialog = () => result.container.querySelector('dialog');
  const search = () => result.getByRole('combobox');
  const open = async () => {
    await userEvent.click(result.getByText('Open commands'));
    await expect.poll(() => dialog()?.open).toBe(true);
  };
  const active = () => dialog()?.querySelector('[data-active]')?.textContent;
  return { ...result, open, dialog, search, trigger, active };
}
describe('<Spotlight /> in a browser', () => {
  test('opens in the top layer, focuses search, skips disabled actions, loops, and Enter triggers', async () => {
    const { open, dialog, search, active, trigger, getByText } = setup();
    await open();
    expect(dialog()!.matches(':modal')).toBe(true);
    expect(search()).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(active()).toBe('Home');
    await userEvent.keyboard('{ArrowDown}');
    expect(active()).toBe('Save');
    await userEvent.keyboard('{ArrowDown}');
    expect(active()).toBe('Home');
    await userEvent.keyboard('{ArrowUp}');
    expect(active()).toBe('Save');
    expect(search()).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(trigger).toHaveBeenCalledWith(expect.objectContaining({ id: 'save' }));
    await expect.poll(dialog).toBeNull();
    expect(getByText('Open commands')).toHaveFocus();
  });
  test('typing clears activation, preserves focus and editing keys, and never submits during composition', async () => {
    const { open, search, active, trigger } = setup({ closeOnActionTrigger: false });
    await open();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.type(search(), 'sav');
    expect(active()).toBeUndefined();
    expect(search()).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(trigger).not.toHaveBeenCalled();
    await userEvent.keyboard('{ArrowDown}');
    expect(active()).toBe('Save');
    search().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }));
    expect(trigger).not.toHaveBeenCalled();
    await userEvent.keyboard('{ArrowLeft}');
    expect((search() as HTMLInputElement).selectionStart).toBe(2);
  });
  test('pointer actions keep search focus; Tab stays in the dialog; Escape restores the opener', async () => {
    const { open, search, dialog, getByText, trigger } = setup({ closeOnActionTrigger: false });
    await open();
    await userEvent.click(getByText('Save'));
    expect(trigger).toHaveBeenCalledTimes(1);
    expect(search()).toHaveFocus();
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toHaveAttribute('data-slot', 'spotlight-close');
    await userEvent.keyboard('{Escape}');
    await expect.poll(dialog).toBeNull();
    expect(getByText('Open commands')).toHaveFocus();
  });
  test('backdrop dismisses; dismissal can be disabled', async () => {
    const first = setup();
    await first.open();
    await userEvent.click(document.body, { position: { x: 5, y: 5 } });
    await expect.poll(first.dialog).toBeNull();
    first.unmount();
    const second = setup({ closeOnClickOutside: false, closeOnEscape: false });
    await second.open();
    await userEvent.click(document.body, { position: { x: 5, y: 5 } });
    await userEvent.keyboard('{Escape}');
    expect(second.dialog()!.open).toBe(true);
  });
  test('scrolls keyboard-active actions into view and stays inside the viewport', async () => {
    const { open, dialog, search } = setup({
      actions: Array.from({ length: 40 }, (_, i) => ({ id: String(i), label: `Action ${i}` })),
    });
    await open();
    await userEvent.keyboard('{ArrowUp}');
    const list = dialog()!.querySelector<HTMLElement>('[role="listbox"]')!;
    const active = dialog()!.querySelector<HTMLElement>('[data-active]')!;
    expect(list.scrollTop).toBeGreaterThan(0);
    expect(active.getBoundingClientRect().bottom).toBeLessThanOrEqual(list.getBoundingClientRect().bottom + 1);
    expect(dialog()!.querySelector('[data-slot="spotlight-content"]')!.getBoundingClientRect().width).toBeLessThanOrEqual(
      window.innerWidth,
    );
    expect(search()).toHaveFocus();
  });
  test.each(['light', 'dark'] as const)('has no axe violations in %s', async (scheme) => {
    const { open, container } = setup();
    container.setAttribute('data-slp-color-scheme', scheme);
    await open();
    expect((await axe.run(container)).violations).toEqual([]);
  });
});
