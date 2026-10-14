import { render } from '@solidjs/testing-library';
import { createSignal, flush, For } from 'solid-js';
import { userEvent } from 'vitest/browser';
import { describe, expect, test, vi } from 'vitest';
import { SlopkitUi } from '../../provider';
import { Combobox } from './combobox';
import { createCombobox } from './create-combobox';

const countries = Array.from({ length: 40 }, (_, index) => `Country ${index + 1}`);

/** An input that filters 40 countries and opens on a click or on typing, and a button after it. */
function setup() {
  const [query, setQuery] = createSignal('');
  const onOptionSubmit = vi.fn();
  const result = render(() => {
    const store = createCombobox();
    const shown = () => countries.filter((country) => country.toLowerCase().includes(query().toLowerCase()));
    return (
      <SlopkitUi>
        <div style={{ padding: '20px' }}>
          <Combobox store={store} onOptionSubmit={onOptionSubmit}>
            <Combobox.Target>
              {(target) => (
                <input
                  {...target}
                  aria-label="Country"
                  style={{ width: '240px' }}
                  onClick={() => store.open()}
                  onInput={(event) => {
                    setQuery(event.currentTarget.value);
                    store.open();
                    store.activateFirst();
                  }}
                />
              )}
            </Combobox.Target>
            <Combobox.Dropdown data-testid="dropdown">
              <Combobox.Options aria-label="Countries">
                <For each={shown()}>{(country) => <Combobox.Option value={country}>{country}</Combobox.Option>}</For>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          <button type="button">After</button>
        </div>
      </SlopkitUi>
    );
  });
  const input = () => result.getByRole('combobox') as HTMLInputElement;
  const dropdown = () => result.queryByTestId('dropdown');
  return { ...result, input, dropdown, onOptionSubmit };
}

describe('<Combobox /> in a browser', () => {
  test('opens in the top layer under the target, as wide as it', async () => {
    const { input, dropdown } = setup();

    await userEvent.click(input());
    expect(dropdown()!.matches(':popover-open')).toBe(true);
    await expect
      .poll(() => Math.round(dropdown()!.getBoundingClientRect().top))
      .toBe(Math.round(input().getBoundingClientRect().bottom + 4));
    expect(Math.round(dropdown()!.getBoundingClientRect().width)).toBe(Math.round(input().getBoundingClientRect().width));
  });

  test('typing filters and makes the first match active; Enter chooses it, focus stays on the input', async () => {
    const { input, dropdown, onOptionSubmit, getByText } = setup();

    await userEvent.click(input());
    await userEvent.keyboard('2');
    expect(input()).toHaveAttribute('aria-activedescendant', getByText('Country 2').id);
    await userEvent.keyboard('{ArrowDown}');
    expect(input()).toHaveAttribute('aria-activedescendant', getByText('Country 12').id);
    await userEvent.keyboard('{Enter}');

    expect(onOptionSubmit).toHaveBeenCalledWith('Country 12');
    expect(input()).toHaveFocus();
    expect(input()).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(dropdown).toBeNull();
  });

  test('a click on an option chooses it and leaves focus on the input', async () => {
    const { input, onOptionSubmit, getByText } = setup();

    await userEvent.click(input());
    await userEvent.click(getByText('Country 3'));

    expect(onOptionSubmit).toHaveBeenCalledWith('Country 3');
    expect(input()).toHaveFocus();
  });

  test('the active option is scrolled into view in the listbox, and the page stays put', async () => {
    const { input, getByText, getByRole } = setup();
    const before = window.scrollY;

    await userEvent.click(input());
    await userEvent.keyboard('{ArrowUp}');
    const listbox = getByRole('listbox');
    const last = getByText('Country 40').getBoundingClientRect();
    const box = listbox.getBoundingClientRect();

    expect(input()).toHaveAttribute('aria-activedescendant', getByText('Country 40').id);
    expect(listbox.scrollTop).toBeGreaterThan(0);
    expect(last.bottom).toBeLessThanOrEqual(box.bottom + 1);
    expect(window.scrollY).toBe(before);
  });

  test('Escape closes it and keeps focus on the input', async () => {
    const { input, dropdown } = setup();

    await userEvent.click(input());
    await userEvent.keyboard('{Escape}');

    expect(input()).toHaveAttribute('aria-expanded', 'false');
    expect(input()).toHaveFocus();
    await expect.poll(dropdown).toBeNull();
  });

  test('a press outside closes it', async () => {
    const { input, getByText } = setup();

    await userEvent.click(input());
    await userEvent.click(getByText('After'));

    expect(input()).toHaveAttribute('aria-expanded', 'false');
  });

  test('Tab closes it and moves focus on', async () => {
    const { input, getByText } = setup();

    await userEvent.click(input());
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.tab();

    expect(input()).toHaveAttribute('aria-expanded', 'false');
    expect(getByText('After')).toHaveFocus();
  });

  test('a button target: Space opens it from a click handler, the arrows and End move, Enter chooses', async () => {
    const onOptionSubmit = vi.fn();
    const { getByText } = render(() => {
      const store = createCombobox();
      return (
        <SlopkitUi>
          <Combobox store={store} onOptionSubmit={onOptionSubmit}>
            <Combobox.Target>
              {(target) => (
                <button {...target} type="button" onClick={() => store.toggle()}>
                  Size
                </button>
              )}
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options aria-label="Sizes">
                <Combobox.Option value="s">Small</Combobox.Option>
                <Combobox.Option value="m">Medium</Combobox.Option>
                <Combobox.Option value="l">Large</Combobox.Option>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </SlopkitUi>
      );
    });
    const button = getByText('Size');
    button.focus();

    await userEvent.keyboard(' ');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{End}');
    expect(button).toHaveAttribute('aria-activedescendant', getByText('Large').id);
    await userEvent.keyboard('{ArrowUp}{Enter}');
    flush();
    expect(onOptionSubmit).toHaveBeenCalledWith('m');
    expect(button).toHaveFocus();
  });
});
