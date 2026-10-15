import {
  createMemo,
  createProjection,
  createSignal,
  createUniqueId,
  flush,
  For,
  omit,
  onCleanup,
  onSettled,
  Show,
  untrack,
} from 'solid-js';
import type { JSX } from '@solidjs/web';
import style from './spotlight.module.css';
import { Modal, type ModalOwnProps } from '../modal';
import { Input } from '../../inputs/input';
import { Highlight } from '../../typography/highlight';
import { findEnabledIndex } from '../../primitives';
import { useSlopkitUi } from '../../provider/slopkit-ui';
import type { SpotlightStore } from '../../provider/spotlight';
import type { ElementProps } from '../../../utils';
import { joinClass } from '../../../style-props';
import {
  filterActions,
  flattenActions,
  groupActions,
  matchesShortcut,
  type SpotlightAction,
  type SpotlightActions,
  type SpotlightFilter,
  type SpotlightSection,
} from './spotlight-data';

export interface SpotlightOwnProps extends Omit<
  ModalOwnProps,
  'opened' | 'onClose' | 'title' | 'withCloseButton' | 'closeButtonLabel'
> {
  /** The actions, and groups of them, in the order they're shown. */
  actions: SpotlightActions;
  /**
   * The key press that opens and closes it, such as `'mod+K'` (⌘K on Apple devices, Ctrl+K elsewhere), or several.
   * `null` turns it off. Defaults to `'mod+K'`.
   */
  shortcut?: string | readonly string[] | null;
  /** The search text, for a controlled one. */
  query?: string;
  /** Called with the search text as it changes. */
  onQueryChange?: (query: string) => void;
  /** Empties the search once it has closed. Defaults to `true`. */
  clearQueryOnClose?: boolean;
  /** Picks the actions to show for a query. Defaults to every word in the label, description or keywords. */
  filter?: SpotlightFilter;
  /** Shows at most this many of the actions found. */
  limit?: number;
  /** Marks the query's words in the labels. */
  highlightQuery?: boolean;
  /** Whether triggering an action closes it. Defaults to `true`. */
  closeOnActionTrigger?: boolean;
  /** The search field's placeholder. Defaults to `'Search…'`. */
  searchPlaceholder?: string;
  /** Names the search field, and the dialog unless it has an `aria-label`. Defaults to `'Search'`. */
  searchLabel?: string;
  /** Names the list of actions. Defaults to `'Actions'`. */
  actionsLabel?: string;
  /** Shown when no action is found. Defaults to `'Nothing found'`. */
  nothingFound?: JSX.Element;
}

export type SpotlightProps = ElementProps<JSX.DialogHtmlAttributes<HTMLDialogElement>, SpotlightOwnProps>;

const section = (value: SpotlightSection) => (typeof value === 'function' ? untrack(value as () => JSX.Element) : value);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

/**
 * A search over the app's actions, in a modal: the search field, then the actions it finds. Render it once, inside
 * `<SlopkitUi>`; `useSpotlight()`, the `spotlight` facade and the shortcut (⌘K or Ctrl+K) open it.
 */
export function Spotlight(props: SpotlightProps) {
  const store = useSlopkitUi('Spotlight').spotlight;
  onCleanup(store.attachHost());

  const [ownQuery, setOwnQuery] = createSignal('', { name: 'Spotlight.query' });
  const query = () => props.query ?? ownQuery();
  const setQuery = (next: string) => {
    if (props.query === undefined) setOwnQuery(next);
    props.onQueryChange?.(next);
  };

  // The shortcut works anywhere on the page, also in a field.
  onSettled(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return;
      const shortcut = props.shortcut === undefined ? 'mod+K' : props.shortcut;
      if (shortcut === null) return;
      const shortcuts = typeof shortcut === 'string' ? [shortcut] : shortcut;
      if (!shortcuts.some((one) => matchesShortcut(event, one))) return;
      event.preventDefault();
      store.toggle();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });

  const others = omit(
    props,
    'class',
    'actions',
    'shortcut',
    'query',
    'onQueryChange',
    'clearQueryOnClose',
    'filter',
    'limit',
    'highlightQuery',
    'closeOnActionTrigger',
    'searchPlaceholder',
    'searchLabel',
    'actionsLabel',
    'nothingFound',
    'onExited',
  );

  return (
    <Modal
      size="lg"
      aria-label={props.searchLabel ?? 'Search'}
      {...others}
      class={joinClass(['slp-spotlight', style.root], props.class)}
      opened={store.opened()}
      onClose={() => store.close()}
      withCloseButton={false}
      onExited={() => {
        if (props.clearQueryOnClose ?? true) setQuery('');
        props.onExited?.();
      }}
    >
      {/* Rendered while it's open: the actions, and their JSX, are read only then. */}
      <SpotlightContent {...props} store={store} query={query()} setQuery={setQuery} />
    </Modal>
  );
}

interface ContentProps extends SpotlightProps {
  store: SpotlightStore;
  query: string;
  setQuery: (query: string) => void;
}

function SpotlightContent(props: ContentProps) {
  const listId = `slp-spotlight-${createUniqueId()}`;
  // Read once per change of `actions`: a getter would make new actions, and new elements, on every read.
  const actions = createMemo(() => flattenActions(props.actions), { name: 'Spotlight.actions' });
  const results = createMemo(
    () => {
      const found = (props.filter ?? filterActions)(props.query, actions());
      return props.limit === undefined ? found : found.slice(0, props.limit);
    },
    { name: 'Spotlight.results' },
  );
  const groups = createMemo(() => groupActions(results()), { name: 'Spotlight.groups' });

  // The action the user moved to. When it isn't found any more, the first enabled one is active.
  const [chosen, setChosen] = createSignal<string | undefined>(undefined, { name: 'Spotlight.chosen' });
  const active = createMemo(
    () => {
      const list = results();
      const id = chosen();
      if (id !== undefined && list.some((action) => action.id === id && !action.disabled)) return id;
      return list.find((action) => !action.disabled)?.id;
    },
    { name: 'Spotlight.active' },
  );
  // Keyed by action: moving re-runs only the action left and the one reached.
  let previous: string | undefined;
  const isActive = createProjection<Record<string, true>>(
    (draft) => {
      const next = active();
      if (previous !== undefined) delete draft[previous];
      if (next !== undefined) draft[next] = true;
      previous = next;
    },
    {},
    { name: 'Spotlight.isActive' },
  );

  // Element ids for the actions' ids, which can hold any character.
  const ids = new Map<string, string>();
  const elementId = (id: string) => {
    let value = ids.get(id);
    if (value === undefined) ids.set(id, (value = `${listId}-${ids.size}`));
    return value;
  };

  const choose = (id: string, scroll: boolean) => {
    setChosen(id);
    if (!scroll) return;
    flush();
    document.getElementById(elementId(id))?.scrollIntoView({ block: 'nearest' });
  };

  const trigger = (action: SpotlightAction) => {
    if (action.disabled) return;
    action.onTrigger?.();
    if (props.closeOnActionTrigger ?? true) props.store.close();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    const list = results();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const current = list.findIndex((action) => action.id === active());
      const index = findEnabledIndex(current, event.key === 'ArrowDown' ? 1 : -1, list.length, (at) => !!list[at].disabled, true);
      if (index !== -1) choose(list[index].id, true);
    } else if (event.key === 'Enter') {
      const action = list.find((candidate) => candidate.id === active());
      if (!action) return;
      event.preventDefault();
      trigger(action);
    }
  };

  const found = () => results().length > 0;
  const highlight = () => (props.highlightQuery ? props.query : '');

  return (
    <>
      <div data-slot="spotlight-search" class={style.search}>
        <Input
          variant="ghost"
          size="lg"
          leftSection={<SearchIcon />}
          data-autofocus
          type="text"
          role="combobox"
          aria-label={props.searchLabel ?? 'Search'}
          aria-expanded={found() ? 'true' : 'false'}
          aria-controls={found() ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={active() === undefined ? undefined : elementId(active()!)}
          autocomplete="off"
          spellcheck={false}
          placeholder={props.searchPlaceholder ?? 'Search…'}
          value={props.query}
          onInput={(event: InputEvent & { currentTarget: HTMLInputElement }) => {
            props.setQuery(event.currentTarget.value);
            // A new query starts from the first action found.
            setChosen(undefined);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <Show
        when={found()}
        fallback={
          <div data-slot="spotlight-empty" class={style.empty}>
            {props.nothingFound ?? 'Nothing found'}
          </div>
        }
      >
        <div
          id={listId}
          role="listbox"
          aria-label={props.actionsLabel ?? 'Actions'}
          data-slot="spotlight-actions"
          class={style.actions}
          // Pressing an action keeps focus in the search field.
          onMouseDown={(event: MouseEvent) => event.preventDefault()}
        >
          {/* Keyed by name, so a new query keeps the groups that are still there. */}
          <For each={groups()} keyed={(group) => group.name}>
            {(group) => {
              const name = untrack(() => group().name);
              const labelId = `${listId}-group-${createUniqueId()}`;
              const options = (
                <For each={group().actions}>
                  {(action) => (
                    <div
                      id={elementId(action.id)}
                      role="option"
                      aria-selected={isActive[action.id] === true ? 'true' : 'false'}
                      aria-disabled={action.disabled ? 'true' : undefined}
                      data-slot="spotlight-action"
                      data-active={isActive[action.id] === true ? '' : undefined}
                      data-disabled={action.disabled ? '' : undefined}
                      class={style.action}
                      onClick={() => trigger(action)}
                      onPointerMove={() => {
                        if (!action.disabled && !isActive[action.id]) choose(action.id, false);
                      }}
                    >
                      {action.leftSection != null && (
                        <span data-slot="spotlight-action-left-section" class={style.section}>
                          {section(action.leftSection)}
                        </span>
                      )}
                      <span data-slot="spotlight-action-body" class={style.body}>
                        <span data-slot="spotlight-action-label" class={style.label}>
                          {props.highlightQuery ? (
                            <Highlight highlight={highlight().split(/\s+/)}>{action.label}</Highlight>
                          ) : (
                            action.label
                          )}
                        </span>
                        {action.description && (
                          <span data-slot="spotlight-action-description" class={style.description}>
                            {action.description}
                          </span>
                        )}
                      </span>
                      {action.rightSection != null && (
                        <span data-slot="spotlight-action-right-section" class={style.section}>
                          {section(action.rightSection)}
                        </span>
                      )}
                    </div>
                  )}
                </For>
              );
              return name === undefined ? (
                options
              ) : (
                <div role="group" aria-labelledby={labelId} data-slot="spotlight-group">
                  <div id={labelId} data-slot="spotlight-group-label" class={style.groupLabel}>
                    {name}
                  </div>
                  {options}
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </>
  );
}
