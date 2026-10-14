import { fireEvent, render } from '@solidjs/testing-library';
import { captureArtifact } from '@solidjs/diagnostics';
import { createSignal, flush } from 'solid-js';
import axe from 'axe-core';
import { describe, expect, test, vi } from 'vitest';
import { SlopkitUi } from '../../provider';
import { Spotlight, type SpotlightProps } from './spotlight';
import { expectHydration } from '../../../../test/ssr';
import { NO_DIAGNOSTICS } from '../../../../test/diagnostics';

const actions = [
  { id: 'home', label: 'Home', description: 'Overview', group: 'Pages', keywords: ['start'] },
  { id: 'settings', label: 'Settings', group: 'Pages', disabled: true },
  { id: 'save', label: 'Save', group: 'Commands' },
];
function setup(props: Partial<SpotlightProps> = {}) {
  const [opened, setOpened] = createSignal(true);
  const close = vi.fn(() => setOpened(false));
  const result = render(() => (
    <SlopkitUi>
      <Spotlight opened={opened()} onClose={close} actions={actions} transitionDuration={0} {...props} />
    </SlopkitUi>
  ));
  flush();
  const search = () => result.getByRole('combobox', { hidden: true }) as HTMLInputElement;
  const options = () => [...result.container.querySelectorAll<HTMLElement>('[role="option"]')];
  const type = (value: string) => {
    fireEvent.input(search(), { target: { value } });
    flush();
  };
  return { ...result, close, setOpened, search, options, type };
}

describe('<Spotlight />', () => {
  test('filters labels, descriptions and keywords, removes empty groups, and keeps surviving actions', () => {
    const { type, options, container } = setup();
    const home = options()[0];
    for (const query of [' HOME ', 'overview', 'start']) {
      type(query);
      expect(options()).toEqual([home]);
      expect(container.querySelectorAll('[role="group"]')).toHaveLength(1);
    }
    type('missing');
    expect(options()).toEqual([]);
    expect(container.querySelector('[role="status"]')).toHaveTextContent('No actions found');
  });

  test('limit spans groups and custom filtering replaces default matching', () => {
    const { options, type } = setup({ limit: 1, filter: (query, action) => action.id.startsWith(query) });
    expect(options().map((option) => option.dataset.value)).toEqual(['home']);
    type('s');
    expect(options().map((option) => option.dataset.value)).toEqual(['settings']);
  });

  test('controlled query follows the parent, reports edits, and responds to external changes', () => {
    const [query, setQuery] = createSignal('home');
    const changed = vi.fn();
    const { options, type, search } = setup({
      get query() {
        return query();
      },
      onQueryChange: changed,
    });
    type('save');
    expect(changed).toHaveBeenCalledWith('save');
    expect(options().map((option) => option.dataset.value)).toEqual(['home']);
    setQuery('save');
    flush();
    expect(search().value).toBe('save');
    expect(options().map((option) => option.dataset.value)).toEqual(['save']);
  });

  test('triggers callbacks in order, closes by default, and ignores disabled actions', () => {
    const calls: string[] = [];
    const { options, close } = setup({
      actions: [
        { id: 'one', label: 'One', onTrigger: () => calls.push('action') },
        { id: 'two', label: 'Two', disabled: true },
      ],
      onActionTrigger: (action) => calls.push(action.id),
    });
    fireEvent.click(options()[1]);
    expect(calls).toEqual([]);
    expect(close).not.toHaveBeenCalled();
    fireEvent.click(options()[0]);
    expect(calls).toEqual(['action', 'one']);
    expect(close).toHaveBeenCalledTimes(1);
  });

  test('can keep the palette open and translate all built-in strings', () => {
    const { options, close, search, type, container } = setup({
      closeOnActionTrigger: false,
      searchLabel: 'Find',
      searchPlaceholder: 'Type',
      actionsLabel: 'Commands',
      nothingFound: 'Empty',
      closeButtonLabel: 'Dismiss',
      'aria-label': 'Palette',
    });
    fireEvent.click(options()[0]);
    expect(close).not.toHaveBeenCalled();
    expect(search()).toHaveAttribute('aria-label', 'Find');
    expect(search()).toHaveAttribute('placeholder', 'Type');
    expect(container.querySelector('dialog')).toHaveAttribute('aria-label', 'Palette');
    type('missing');
    expect(container.querySelector('[role="status"]')).toHaveTextContent('Empty');
  });

  test('external query changes clear references to removed active actions', async () => {
    const [query, setQuery] = createSignal('');
    const { search, options } = setup({
      get query() {
        return query();
      },
    });
    fireEvent.keyDown(search(), { key: 'ArrowDown' });
    expect(search()).toHaveAttribute('aria-activedescendant', options()[0].id);
    setQuery('save');
    flush();
    await Promise.resolve();
    flush();
    expect(search()).not.toHaveAttribute('aria-activedescendant');
  });

  test('uncontrolled query persists across closing and reopening; active state does not', async () => {
    const { type, search, setOpened } = setup();
    type('save');
    fireEvent.keyDown(search(), { key: 'ArrowDown' });
    setOpened(false);
    flush();
    await vi.waitFor(() => expect(document.querySelector('dialog')).toBeNull());
    setOpened(true);
    flush();
    expect(search().value).toBe('save');
    expect(search()).not.toHaveAttribute('aria-activedescendant');
  });

  test.each([
    {},
    { defaultQuery: 'missing' },
    { limit: 0, withCloseButton: false },
    { title: 'Commands', actions: [{ id: 'one', label: 'One', description: 'Details', leftSection: '↗', rightSection: 'K' }] },
  ])('has no axe violations for %j', async (props) => {
    const { container } = setup(props);
    expect((await axe.run(container)).violations).toEqual([]);
  });

  test('filtering has no diagnostics and stays within its derivation budget', async () => {
    const { type } = setup();
    const { artifact } = await captureArtifact(() => type('home'), { scenario: 'spotlight-filter' });
    expect(artifact).toHaveNoDiagnostics(NO_DIAGNOSTICS);
    expect(artifact).toStayWithinRerunBudget(1, { scope: /^Spotlight.shown$/ });
    expect(artifact).toStayWithinRerunBudget(0, { scope: /^Spotlight.groups$/ });
    // Filtering checks whether the empty state and group remain visible; For also checks surviving rows.
    expect(artifact).toHaveNoWaste({ maxWastedRuns: 3 });
  });

  test('keyboard movement updates only the active descendant', async () => {
    const { search } = setup();
    const { artifact } = await captureArtifact(() => fireEvent.keyDown(search(), { key: 'ArrowDown' }), {
      scenario: 'spotlight-arrow',
    });
    expect(artifact).toHaveNoDiagnostics(NO_DIAGNOSTICS);
    expect(artifact).toStayWithinRerunBudget(0, { scope: /^Spotlight\./ });
    expect(artifact).toHaveNoWaste();
  });

  test('hydrates open, closed and empty renders', async () => {
    for (const name of ['closed', 'open', 'empty']) await expectHydration('./spotlight.fixtures.tsx', name);
  });
});
