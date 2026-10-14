import { createMemo, createSignal, createUniqueId, flush, For, omit, onCleanup, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { DialogBase, type DialogBaseOwnProps } from '../dialog-base';
import { comboboxInternals, createCombobox, type ComboboxStore } from '../../inputs/combobox/create-combobox';
import type { ElementProps } from '../../../utils';
import style from './spotlight.module.css';

export interface SpotlightAction {
  /** Unique within this Spotlight. */
  id: string;
  label: string;
  description?: string;
  /** Additional search terms. */
  keywords?: readonly string[];
  /** Actions with the same group are shown together, in first-seen group order. */
  group?: string;
  disabled?: boolean;
  /** Decorative content only; actions cannot contain interactive elements. */
  leftSection?: JSX.Element | (() => JSX.Element);
  rightSection?: JSX.Element | (() => JSX.Element);
  onTrigger?: () => void;
}

export interface SpotlightOwnProps extends DialogBaseOwnProps {
  actions: readonly SpotlightAction[];
  /** Controlled search text. */
  query?: string;
  /** Initial search text; read once. Uncontrolled text persists across openings. */
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Called after the action's onTrigger. */
  onActionTrigger?: (action: SpotlightAction) => void;
  closeOnActionTrigger?: boolean;
  /** Search input's accessible name. Defaults to 'Search actions'. */
  searchLabel?: string;
  /** Defaults to 'Search actions…'. */
  searchPlaceholder?: string;
  /** Listbox's accessible name. Defaults to 'Actions'. */
  actionsLabel?: string;
  /** Defaults to 'No actions found'. */
  nothingFound?: string;
  /** Maximum visible actions across all groups. */
  limit?: number;
  /** Overrides case-insensitive matching of label, description and keywords. */
  filter?: (query: string, action: SpotlightAction) => boolean;
}

export type SpotlightProps = Omit<ElementProps<JSX.DialogHtmlAttributes<HTMLDialogElement>, SpotlightOwnProps>, 'children'>;

/** A searchable action list in a modal dialog. Focus stays in the search input while the arrows move through actions. */
export function Spotlight(props: SpotlightProps) {
  const others = omit(
    props,
    'actions',
    'query',
    'defaultQuery',
    'onQueryChange',
    'onActionTrigger',
    'closeOnActionTrigger',
    'searchLabel',
    'searchPlaceholder',
    'actionsLabel',
    'nothingFound',
    'limit',
    'filter',
  );
  const [own, setOwn] = createSignal(
    untrack(() => props.defaultQuery ?? ''),
    { name: 'Spotlight.query' },
  );
  const query = () => props.query ?? own();
  const groups = createMemo(
    () => {
      const result = new Map<string | undefined, SpotlightAction[]>();
      for (const action of props.actions) {
        const items = result.get(action.group) ?? [];
        if (!result.has(action.group)) result.set(action.group, items);
        items.push(action);
      }
      return [...result].map(([label, actions]) => ({ label, actions }));
    },
    { name: 'Spotlight.groups' },
  );
  const shown = createMemo(
    () => {
      const text = query().trim().toLowerCase();
      const matches = groups()
        .flatMap((group) => group.actions)
        .filter((action) =>
          props.filter
            ? props.filter(query(), action)
            : [action.label, action.description ?? '', ...(action.keywords ?? [])].some((value) =>
                value.toLowerCase().includes(text),
              ),
        );
      const limit = props.limit === undefined ? matches.length : Math.max(0, Math.floor(props.limit));
      return new Set(matches.slice(0, limit));
    },
    { name: 'Spotlight.shown' },
  );
  const store = createCombobox({ loop: () => true });
  const internals = comboboxInternals(store);
  const trigger = (action: SpotlightAction) => {
    if (!props.opened || action.disabled) return;
    action.onTrigger?.();
    props.onActionTrigger?.(action);
    if (props.closeOnActionTrigger ?? true) props.onClose();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || !props.opened) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (event.key === 'ArrowDown') store.activateNext();
      else store.activatePrevious();
    } else if (event.key === 'Enter' && store.activeId()) {
      event.preventDefault();
      store.submitActive();
    }
    // Home/End and editing shortcuts keep their native text-field behavior. Tab stays inside the dialog.
  };

  return (
    <DialogBase
      {...others}
      onExited={() => {
        store.clearActive();
        props.onExited?.();
      }}
      aria-label={props['aria-label'] ?? (untrack(() => 'title' in props) ? undefined : 'Spotlight')}
      config={{ component: 'Spotlight', name: 'spotlight', classes: style, defaultTransition: () => 'pop', attributes: {} }}
    >
      <input
        data-slot="spotlight-search"
        class={style.search}
        data-autofocus
        type="text"
        autocomplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={props.opened ? 'true' : 'false'}
        aria-controls={internals.listboxId}
        aria-activedescendant={props.opened ? store.activeId() : undefined}
        aria-label={props.searchLabel ?? 'Search actions'}
        placeholder={props.searchPlaceholder ?? 'Search actions…'}
        value={query()}
        onKeyDown={onKeyDown}
        onInput={(event: InputEvent) => {
          const next = (event.currentTarget as HTMLInputElement).value;
          store.clearActive();
          if (props.query === undefined) setOwn(next);
          props.onQueryChange?.(next);
          flush();
        }}
      />
      <SpotlightList store={store} label={props.actionsLabel ?? 'Actions'}>
        <For each={groups()}>
          {(group) => {
            const actions = createMemo(() => group.actions.filter((action) => shown().has(action)), {
              name: 'Spotlight.groupActions',
            });
            const labelId = `slp-spotlight-group-${createUniqueId()}`;
            return (
              <Show when={actions().length > 0}>
                <div
                  role={group.label === undefined ? 'presentation' : 'group'}
                  aria-labelledby={group.label === undefined ? undefined : labelId}
                  data-slot="spotlight-group"
                >
                  <Show when={group.label !== undefined}>
                    <div id={labelId} data-slot="spotlight-group-label" class={style.groupLabel}>
                      {group.label}
                    </div>
                  </Show>
                  <For each={actions()}>{(action) => <SpotlightOption action={action} store={store} trigger={trigger} />}</For>
                </div>
              </Show>
            );
          }}
        </For>
      </SpotlightList>
      <Show when={shown().size === 0}>
        <div role="status" data-slot="spotlight-empty" class={style.empty}>
          {props.nothingFound ?? 'No actions found'}
        </div>
      </Show>
    </DialogBase>
  );
}

function SpotlightList(props: { store: ComboboxStore; label: string; children: JSX.Element }) {
  const internals = comboboxInternals(untrack(() => props.store));
  onCleanup(() => internals.setListbox(undefined));
  return (
    <div
      ref={internals.setListbox}
      id={internals.listboxId}
      role="listbox"
      tabindex={-1}
      aria-label={props.label}
      data-slot="spotlight-actions"
      class={style.actions}
    >
      {props.children}
    </div>
  );
}

function SpotlightOption(props: { action: SpotlightAction; store: ComboboxStore; trigger: (action: SpotlightAction) => void }) {
  const internals = comboboxInternals(untrack(() => props.store));
  const id = `slp-spotlight-action-${createUniqueId()}`;
  let element: HTMLDivElement | undefined;
  onCleanup(() => {
    if (element) internals.forget(element);
  });
  return (
    <div
      ref={(el: HTMLDivElement) => (element = el)}
      id={id}
      role="option"
      aria-selected="false"
      aria-disabled={props.action.disabled ? 'true' : undefined}
      data-disabled={props.action.disabled ? '' : undefined}
      data-value={props.action.id}
      data-slot="spotlight-action"
      class={style.action}
      onMouseDown={(event: MouseEvent) => event.preventDefault()}
      onPointerMove={() => {
        if (!props.action.disabled) internals.activate(element, false);
      }}
      onClick={() => props.trigger(props.action)}
    >
      <Show when={'leftSection' in props.action}>
        <span data-slot="spotlight-action-left-section" aria-hidden="true">
          {renderSection(() => props.action.leftSection)}
        </span>
      </Show>
      <span data-slot="spotlight-action-body" class={style.actionBody}>
        <span data-slot="spotlight-action-label">{props.action.label}</span>
        <Show when={props.action.description !== undefined}>
          <span data-slot="spotlight-action-description" class={style.description}>
            {props.action.description}
          </span>
        </Show>
      </span>
      <Show when={'rightSection' in props.action}>
        <span data-slot="spotlight-action-right-section" aria-hidden="true">
          {renderSection(() => props.action.rightSection)}
        </span>
      </Show>
    </div>
  );
}

// Render decorations only once the action is mounted, including on first opening after hydration.
function renderSection(read: () => JSX.Element | (() => JSX.Element)) {
  return untrack(() => {
    const section = read();
    return typeof section === 'function' ? section() : section;
  });
}
