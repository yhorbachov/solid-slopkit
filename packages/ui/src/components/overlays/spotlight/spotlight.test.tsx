import { fireEvent, render } from '@solidjs/testing-library';
import { captureArtifact } from '@solidjs/diagnostics';
import { createSignal, flush, Show } from 'solid-js';
import axe from 'axe-core';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { expectHydration } from '../../../../test/ssr';
import { NO_DIAGNOSTICS } from '../../../../test/diagnostics';
import { SlopkitUi, spotlight, useSpotlight, type UseSpotlight } from '../../provider';
import { Spotlight, type SpotlightProps } from './spotlight';
import type { SpotlightActions } from './spotlight-data';

// Closing settles a microtask after a change when nothing animates, as in jsdom.
const settle = async () => {
  flush();
  for (let tick = 0; tick < 4; tick++) await Promise.resolve();
  flush();
};

const triggered: string[] = [];
const action = (id: string, label: string, extra: object = {}) => ({
  id,
  label,
  onTrigger: () => triggered.push(id),
  ...extra,
});
const ACTIONS: SpotlightActions = [
  action('home', 'Home', { description: 'The start page', rightSection: () => <span class="made">↵</span> }),
  action('docs', 'Documentation', { keywords: ['guide', 'manual'] }),
  {
    group: 'Settings',
    actions: [action('profile', 'Profile'), action('billing', 'Billing', { disabled: true }), action('security', 'Security')],
  },
];

function setup(props: Partial<SpotlightProps> = {}) {
  let api!: UseSpotlight;
  const Grab = () => {
    api = useSpotlight();
    return null;
  };
  const result = render(() => (
    <SlopkitUi>
      <Grab />
      <Spotlight actions={ACTIONS} {...props} />
    </SlopkitUi>
  ));
  flush();
  const dialog = () => result.container.querySelector('dialog');
  const search = () => result.getByRole('combobox', { hidden: true }) as HTMLInputElement;
  const options = () => [...result.container.querySelectorAll<HTMLElement>('[role="option"]')];
  const labels = () => options().map((option) => option.querySelector('[data-slot="spotlight-action-label"]')!.textContent);
  const active = () => options().find((option) => option.hasAttribute('data-active'));
  // Opened past its starting frame, so closing animates out and ends with onExited.
  const open = async () => {
    api.open();
    await settle();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await settle();
  };
  const type = (value: string) => {
    fireEvent.input(search(), { target: { value } });
    flush();
  };
  const key = (name: string, init: KeyboardEventInit = {}) => {
    fireEvent.keyDown(search(), { key: name, ...init });
    flush();
  };
  return { ...result, api: () => api, dialog, search, options, labels, active, open, type, key };
}

afterEach(() => {
  triggered.length = 0;
  vi.restoreAllMocks();
});

describe('<Spotlight />', () => {
  test('closed, it renders nothing', () => {
    const { dialog } = setup();
    expect(dialog()).toBeNull();
  });

  test('open: a modal named by the search label, with the search field and the actions in their groups', async () => {
    const { dialog, search, labels, container, open, getByRole } = setup();
    await open();

    expect(dialog()).toHaveClass('slp-spotlight', 'slp-modal');
    expect(dialog()).toHaveAttribute('aria-label', 'Search');
    expect(dialog()).toHaveAttribute('data-size', 'lg');
    expect(dialog()!.querySelector('[data-slot="modal-header"]')).toBeNull();
    expect(search()).toHaveAttribute('aria-label', 'Search');
    expect(search()).toHaveAttribute('placeholder', 'Search…');
    expect(search()).toHaveAttribute('aria-expanded', 'true');
    expect(search().closest('[data-slot="spotlight-search"]')).not.toBeNull();
    const listbox = getByRole('listbox', { hidden: true });
    expect(listbox).toHaveAttribute('aria-label', 'Actions');
    expect(search()).toHaveAttribute('aria-controls', listbox.id);
    expect(labels()).toEqual(['Home', 'Documentation', 'Profile', 'Billing', 'Security']);

    const group = getByRole('group', { name: 'Settings', hidden: true });
    expect(group).toHaveAttribute('data-slot', 'spotlight-group');
    expect(group.querySelectorAll('[role="option"]')).toHaveLength(3);
    expect(container.querySelector('[data-slot="spotlight-action-description"]')).toHaveTextContent('The start page');
    expect(container.querySelector('[data-slot="spotlight-action-right-section"] .made')).toHaveTextContent('↵');
    expect(getByRole('option', { name: /Billing/, hidden: true })).toHaveAttribute('aria-disabled', 'true');
  });

  test('typing filters by every word in the label, description or keywords; nothing found shows a message', async () => {
    const { type, labels, search, container, open } = setup();
    await open();

    type('manual');
    expect(labels()).toEqual(['Documentation']);
    type('start page');
    expect(labels()).toEqual(['Home']);
    type('SEC');
    expect(labels()).toEqual(['Security']);
    expect(container.querySelector('[data-slot="spotlight-group-label"]')).toHaveTextContent('Settings');

    type('nope');
    expect(labels()).toEqual([]);
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(container.querySelector('[data-slot="spotlight-empty"]')).toHaveTextContent('Nothing found');
    expect(search()).toHaveAttribute('aria-expanded', 'false');
    expect(search()).not.toHaveAttribute('aria-controls');
  });

  test('the first action found is active; the arrows move, skipping disabled ones and looping; a new query starts over', async () => {
    const { key, active, search, type, open } = setup();
    await open();
    const current = () => active()?.querySelector('[data-slot="spotlight-action-label"]')?.textContent;

    expect(current()).toBe('Home');
    expect(active()).toHaveAttribute('aria-selected', 'true');
    expect(search()).toHaveAttribute('aria-activedescendant', active()!.id);

    key('ArrowDown');
    key('ArrowDown');
    expect(current()).toBe('Profile');
    key('ArrowDown');
    expect(current()).toBe('Security');
    expect(search()).toHaveAttribute('aria-activedescendant', active()!.id);
    key('ArrowDown');
    expect(current()).toBe('Home');
    key('ArrowUp');
    expect(current()).toBe('Security');
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);

    type('o');
    expect(current()).toBe('Home');
  });

  test('Enter triggers the active action and closes it; so does a click; a disabled one does nothing', async () => {
    const { key, dialog, open, getByRole } = setup();
    await open();
    key('ArrowDown');
    key('Enter');
    await settle();
    expect(triggered).toEqual(['docs']);
    expect(dialog()).toBeNull();

    await open();
    fireEvent.click(getByRole('option', { name: /Billing/, hidden: true }));
    await settle();
    expect(triggered).toEqual(['docs']);
    fireEvent.click(getByRole('option', { name: /Profile/, hidden: true }));
    await settle();
    expect(triggered).toEqual(['docs', 'profile']);
    expect(dialog()).toBeNull();
  });

  test('the pointer over an action makes it active', async () => {
    const { open, active, getByRole } = setup();
    await open();
    fireEvent.pointerMove(getByRole('option', { name: /Profile/, hidden: true }));
    flush();
    expect(active()).toHaveTextContent('Profile');
    fireEvent.pointerMove(getByRole('option', { name: /Billing/, hidden: true }));
    flush();
    expect(active()).toHaveTextContent('Profile');
  });

  test('closeOnActionTrigger: false keeps it open', async () => {
    const { key, dialog, open } = setup({ closeOnActionTrigger: false });
    await open();
    key('Enter');
    await settle();
    expect(triggered).toEqual(['home']);
    expect(dialog()).not.toBeNull();
  });

  test('Ctrl+K opens and closes it, from anywhere; another shortcut, or none, can be set', async () => {
    const { dialog } = setup();
    fireEvent.keyDown(document.body, { key: 'k', code: 'KeyK', ctrlKey: true });
    await settle();
    expect(dialog()).not.toBeNull();
    fireEvent.keyDown(document.body, { key: 'k', code: 'KeyK', ctrlKey: true });
    await settle();
    expect(dialog()).toBeNull();
    fireEvent.keyDown(document.body, { key: 'k', code: 'KeyK', ctrlKey: true, shiftKey: true });
    fireEvent.keyDown(document.body, { key: 'k', code: 'KeyK' });
    await settle();
    expect(dialog()).toBeNull();
  });

  test('custom and disabled shortcuts', async () => {
    const custom = setup({ shortcut: ['/', 'alt+P'] });
    fireEvent.keyDown(document.body, { key: 'π', code: 'KeyP', altKey: true });
    await settle();
    expect(custom.dialog()).not.toBeNull();
    custom.unmount();

    const none = setup({ shortcut: null });
    fireEvent.keyDown(document.body, { key: 'k', code: 'KeyK', ctrlKey: true });
    await settle();
    expect(none.dialog()).toBeNull();
  });

  test('limit, a custom filter, and highlightQuery', async () => {
    const limited = setup({ limit: 2 });
    await limited.open();
    expect(limited.labels()).toEqual(['Home', 'Documentation']);
    limited.unmount();

    const custom = setup({
      filter: (query, actions) => actions.filter((one) => one.label.startsWith(query)),
      highlightQuery: true,
    });
    await custom.open();
    custom.type('Pro');
    expect(custom.labels()).toEqual(['Profile']);
    expect(custom.container.querySelector('.slp-mark')).toHaveTextContent('Pro');
  });

  test('the query is cleared once it closes, unless clearQueryOnClose is false', async () => {
    const cleared = setup();
    await cleared.open();
    cleared.type('home');
    cleared.api().close();
    await settle();
    await cleared.open();
    expect(cleared.search().value).toBe('');
    cleared.unmount();

    const kept = setup({ clearQueryOnClose: false });
    await kept.open();
    kept.type('home');
    kept.api().close();
    await settle();
    await kept.open();
    expect(kept.search().value).toBe('home');
    expect(kept.labels()).toEqual(['Home']);
  });

  test('a controlled query', async () => {
    const [query, setQuery] = createSignal('sec');
    const onQueryChange = vi.fn((next: string) => setQuery(next));
    const { open, labels, type, search } = setup({
      get query() {
        return query();
      },
      onQueryChange,
    });
    await open();
    expect(labels()).toEqual(['Security']);
    type('pro');
    expect(onQueryChange).toHaveBeenCalledWith('pro');
    expect(search().value).toBe('pro');
    expect(labels()).toEqual(['Profile']);
  });

  test('the built-in strings are props', async () => {
    const { open, search, dialog, type, container, getByRole } = setup({
      searchLabel: 'Suchen',
      searchPlaceholder: 'Suchen…',
      actionsLabel: 'Aktionen',
      nothingFound: 'Nichts gefunden',
    });
    await open();
    expect(dialog()).toHaveAttribute('aria-label', 'Suchen');
    expect(search()).toHaveAttribute('aria-label', 'Suchen');
    expect(search()).toHaveAttribute('placeholder', 'Suchen…');
    expect(getByRole('listbox', { hidden: true })).toHaveAttribute('aria-label', 'Aktionen');
    type('xyz');
    expect(container.querySelector('[data-slot="spotlight-empty"]')).toHaveTextContent('Nichts gefunden');
  });

  test('has no axe violations, with results and without', async () => {
    const { open, container, type } = setup();
    await open();
    expect((await axe.run(container)).violations).toEqual([]);
    type('nope');
    expect((await axe.run(container)).violations).toEqual([]);
  });

  test('typing and moving have no diagnostics or waste', async () => {
    const { open, type, key } = setup();
    await open();
    const { artifact } = await captureArtifact(
      async () => {
        type('s');
        type('se');
        key('ArrowDown');
        key('ArrowUp');
      },
      { scenario: 'spotlight' },
    );

    expect(artifact).toHaveNoDiagnostics(NO_DIAGNOSTICS);
    // A query that narrows the results checks once whether what derives from them changed: the active action, whether
    // any was found, and the groups' lists. Moving re-runs only the two actions it leaves and reaches.
    expect(artifact).toHaveNoWaste({ maxWastedRuns: 5 });
    expect(artifact).toStayWithinRerunBudget(2, { scope: /^Spotlight\.results$/ });
    expect(artifact).toStayWithinRerunBudget(4, { scope: /^Spotlight\.active$/ });
  });

  test('hydrates the server render without mismatches or diagnostics', async () => {
    await expectHydration('./spotlight.fixtures.tsx', 'host');
    await expectHydration('./spotlight.fixtures.tsx', 'actionsInBody');
  });
});

describe('useSpotlight() and the spotlight facade', () => {
  test('the hook throws outside <SlopkitUi>', () => {
    const Lost = () => {
      useSpotlight();
      return null;
    };
    expect(() => render(() => <Lost />)).toThrow('useSpotlight() must be called inside <SlopkitUi>.');
  });

  test('the hook opens, closes and toggles it, and says whether it is open', async () => {
    const { api, dialog } = setup();
    expect(api().opened()).toBe(false);
    api().toggle();
    await settle();
    expect(api().opened()).toBe(true);
    expect(dialog()).not.toBeNull();
    api().close();
    await settle();
    expect(dialog()).toBeNull();
  });

  test('the facade reaches the most recently mounted provider', async () => {
    const [second, setSecond] = createSignal(true);
    const { container } = render(() => (
      <>
        <div class="first">
          <SlopkitUi>
            <Spotlight actions={ACTIONS} shortcut={null} />
          </SlopkitUi>
        </div>
        <Show when={second()}>
          <div class="second">
            <SlopkitUi>
              <Spotlight actions={ACTIONS} shortcut={null} />
            </SlopkitUi>
          </div>
        </Show>
      </>
    ));
    flush();

    spotlight.open();
    await settle();
    expect(container.querySelector('.second dialog')).not.toBeNull();
    spotlight.close();
    await settle();

    setSecond(false);
    flush();
    spotlight.toggle();
    await settle();
    expect(container.querySelector('.first dialog')).not.toBeNull();
    spotlight.close();
    await settle();
  });

  test('without a <Spotlight>, opening warns and does nothing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let api!: UseSpotlight;
    const Grab = () => {
      api = useSpotlight();
      return null;
    };
    render(() => (
      <SlopkitUi>
        <Grab />
      </SlopkitUi>
    ));
    api.open();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no <Spotlight> is mounted'));
    expect(api.opened()).toBe(false);
  });
});
