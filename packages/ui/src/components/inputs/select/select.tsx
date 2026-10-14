import { createMemo, createSignal, For, omit, onSettled, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import style from './select.module.css';
import { Combobox, type ComboboxProps } from '../combobox/combobox';
import { createCombobox } from '../combobox/create-combobox';
import { controlProps, FieldWrapper, type FieldWrapperProps } from '../field';
import { Input, type InputOwnProps } from '../input';
import { useInputWrapper } from '../input-wrapper';
import { CloseButton } from '../../button/close-button';
import { createTypeahead } from '../../primitives';
import { callHandler, type ElementProps } from '../../../utils';

/** An option: its value, and the label shown for it (the value when there's none). */
export interface SelectItem {
  value: string;
  label?: string;
  disabled?: boolean;
}

/** Options under a heading. */
export interface SelectGroup {
  group: string;
  items: readonly (string | SelectItem)[];
}

/** The options: strings, items, and groups of them, in the order they're shown. */
export type SelectData = readonly (string | SelectItem | SelectGroup)[];

export interface SelectOwnProps
  extends FieldWrapperProps, Pick<InputOwnProps, 'variant' | 'leftSection' | 'rightSection' | 'disabled'> {
  /** The options. */
  data: SelectData;
  /** The selected value, for a controlled select; `null` for none. */
  value?: string | null;
  /** The value it starts with, for an uncontrolled one. Read once. */
  defaultValue?: string | null;
  /** Called with the value and its item when the selection changes; `null` when it's cleared. */
  onChange?: (value: string | null, item: SelectItem | null) => void;
  /** Shown while nothing is selected. */
  placeholder?: string;
  /** Lets typing in the field filter the options. Read once. */
  searchable?: boolean;
  /** Shows a button that clears the selection while there is one. */
  clearable?: boolean;
  /** The clear button's accessible name. Defaults to `Clear`. */
  clearLabel?: string;
  /** Lets choosing the selected option again clear it. Defaults to `false`. */
  allowDeselect?: boolean;
  /** Shown in the dropdown when no option matches the search. Defaults to `Nothing found`. */
  nothingFoundMessage?: string;
  /** Submits the value with a form, through a hidden input. */
  name?: string;
  /** Shows the value without letting it change. */
  readOnly?: boolean;
  /** Where the dropdown goes and how it animates. */
  comboboxProps?: Pick<ComboboxProps, 'position' | 'offset' | 'matchTargetWidth' | 'transition' | 'transitionDuration'>;
}

export type SelectProps = ElementProps<JSX.HTMLAttributes<HTMLElement>, SelectOwnProps>;

interface NormalizedGroup {
  group?: string;
  items: Required<SelectItem>[];
}

const toItem = (entry: string | SelectItem): Required<SelectItem> =>
  typeof entry === 'string'
    ? { value: entry, label: entry, disabled: false }
    : { value: entry.value, label: entry.label ?? entry.value, disabled: !!entry.disabled };

/** The data as groups, with the loose options before the first group gathered into a group without a heading. */
function normalize(data: SelectData): NormalizedGroup[] {
  const groups: NormalizedGroup[] = [];
  for (const entry of data) {
    if (typeof entry !== 'string' && 'group' in entry) {
      groups.push({ group: entry.group, items: entry.items.map(toItem) });
    } else {
      const last = groups.at(-1);
      if (last && last.group === undefined) last.items.push(toItem(entry));
      else groups.push({ items: [toItem(entry)] });
    }
  }
  return groups;
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      data-slot="select-option-check"
      class={style.check}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SelectField(props: SelectProps) {
  const wrapper = useInputWrapper();
  const others = omit(
    controlProps(props) as SelectProps,
    'data',
    'value',
    'defaultValue',
    'onChange',
    'placeholder',
    'searchable',
    'clearable',
    'clearLabel',
    'allowDeselect',
    'nothingFoundMessage',
    'name',
    'readOnly',
    'disabled',
    'comboboxProps',
    'variant',
    'leftSection',
    'rightSection',
    'onKeyDown',
    'onMouseDown',
    'onClick',
    'onInput',
  );

  // Chosen once, like `as`: a button, or a text field to search in.
  const searchable = untrack(() => !!props.searchable);

  const groups = createMemo(() => normalize(props.data), { name: 'Select.groups' });
  const items = createMemo(() => groups().flatMap((group) => group.items), { name: 'Select.items' });

  const [own, setOwn] = createSignal<string | null>(
    untrack(() => props.defaultValue ?? null),
    { name: 'Select.value' },
  );
  const value = () => (props.value !== undefined ? props.value : own());
  const selected = createMemo(() => items().find((item) => item.value === value()) ?? null, { name: 'Select.selected' });

  // While the user types, the options are filtered by what they typed; otherwise the field shows the selection.
  const [query, setQuery] = createSignal('', { name: 'Select.query' });
  const [searching, setSearching] = createSignal(false, { name: 'Select.searching' });
  const shown = createMemo(
    () => {
      if (!searching()) return groups();
      const search = query().trim().toLocaleLowerCase();
      return groups()
        .map((group) => ({ ...group, items: group.items.filter((item) => item.label.toLocaleLowerCase().includes(search)) }))
        .filter((group) => group.items.length > 0);
    },
    { name: 'Select.shown' },
  );

  const typeahead = createTypeahead({
    count: () => items().length,
    current: () => {
      const id = combobox.activeId();
      const active = id === undefined ? null : document.getElementById(id);
      return active ? items().findIndex((item) => item.value === active.dataset.value) : -1;
    },
    getLabel: (index) => items()[index]?.label ?? '',
    isDisabled: (index) => !!items()[index]?.disabled,
    onMatch: (index) => {
      combobox.open();
      combobox.activate(items()[index].value);
    },
  });

  const combobox = createCombobox({
    onChange: (opened) => {
      if (opened) return;
      setSearching(false);
      typeahead.reset();
    },
  });

  const locked = () => !!props.disabled || !!props.readOnly;

  const setValue = (next: string | null) => {
    if (props.value === undefined) setOwn(next);
    props.onChange?.(next, next === null ? null : (items().find((item) => item.value === next) ?? null));
  };

  const pick = (next: string) => {
    setSearching(false);
    setValue(props.allowDeselect && next === value() ? null : next);
  };

  const openFromPointer = () => {
    combobox.open();
    combobox.activateSelected();
  };

  let control: HTMLElement | undefined;
  let setReference: ((element: HTMLElement) => void) | undefined;

  // The dropdown is positioned against, and as wide as, the whole field box rather than the control in it, which
  // the sections make narrower. The box contains the control, so presses on it still count as inside.
  onSettled(() => {
    if (control?.parentElement) setReference?.(control.parentElement);
  });

  const clear = () => {
    setValue(null);
    setQuery('');
    control?.focus();
  };

  const showClear = () => !!props.clearable && value() !== null && !locked();

  return (
    <>
      <Combobox
        store={combobox}
        onOptionSubmit={pick}
        position={props.comboboxProps?.position}
        offset={props.comboboxProps?.offset}
        matchTargetWidth={props.comboboxProps?.matchTargetWidth}
        transition={props.comboboxProps?.transition}
        transitionDuration={props.comboboxProps?.transitionDuration}
      >
        <Combobox.Target>
          {(target) => {
            const onKeyDown = (event: KeyboardEvent) => {
              callHandler(props.onKeyDown, event);
              if (event.defaultPrevented || locked()) return;
              if (!searchable) {
                // Enter and Space open it, and Space chooses the active option, like a click.
                if (event.key === ' ' || (event.key === 'Enter' && !combobox.opened())) {
                  event.preventDefault();
                  if (!combobox.opened()) {
                    combobox.open();
                    if (!combobox.activateSelected()) combobox.activateFirst();
                  } else if (!combobox.submitActive()) combobox.close();
                  return;
                }
                typeahead.onKeyDown(event);
                if (event.defaultPrevented) return;
              }
              target.onKeyDown(event);
            };

            // Spread after `target` in the JSX, not into it: an object spread would read its getters once.
            const shared = {
              ref: (element: HTMLElement) => {
                control = element;
                setReference = target.ref;
                target.ref(element);
              },
              get variant() {
                return props.variant;
              },
              get leftSection() {
                return props.leftSection;
              },
              get rightSection() {
                return (
                  <Show when={showClear()} fallback={props.rightSection ?? <ChevronIcon />}>
                    <CloseButton size="xs" label={props.clearLabel ?? 'Clear'} onClick={clear} data-slot="select-clear" />
                  </Show>
                );
              },
              get disabled() {
                return props.disabled;
              },
              get 'aria-readonly'() {
                return props.readOnly ? ('true' as const) : undefined;
              },
              get 'aria-required'() {
                return wrapper?.required() ? ('true' as const) : undefined;
              },
              onKeyDown,
              class: style.box,
            };

            return searchable ? (
              <Input
                {...(others as Record<string, unknown>)}
                {...target}
                {...shared}
                type="text"
                autocomplete="off"
                aria-autocomplete="list"
                readOnly={props.readOnly}
                placeholder={props.placeholder}
                value={searching() ? query() : (selected()?.label ?? '')}
                onClick={(event: MouseEvent) => {
                  callHandler(props.onClick, event);
                  if (!event.defaultPrevented && !locked()) openFromPointer();
                }}
                onInput={(event: InputEvent) => {
                  callHandler(props.onInput, event);
                  if (locked()) return;
                  setQuery((event.currentTarget as HTMLInputElement).value);
                  setSearching(true);
                  combobox.open();
                  combobox.activateFirst();
                }}
              />
            ) : (
              <Input
                {...(others as Record<string, unknown>)}
                {...target}
                {...shared}
                as="button"
                type="button"
                required={false}
                // A pointer opens it on press; Enter and Space from the keydown above. A click on the label only
                // focuses it.
                onMouseDown={(event: MouseEvent) => {
                  callHandler(props.onMouseDown, event);
                  if (event.defaultPrevented || event.button !== 0 || locked()) return;
                  if (combobox.opened()) combobox.close();
                  else openFromPointer();
                }}
                onClick={(event: MouseEvent) => {
                  callHandler(props.onClick, event);
                  control?.focus();
                }}
              >
                <span data-slot="select-value" data-placeholder={selected() ? undefined : ''} class={style.value}>
                  {selected()?.label ?? props.placeholder ?? ''}
                </span>
              </Input>
            );
          }}
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options
            aria-labelledby={wrapper?.labelId()}
            aria-label={wrapper?.labelId() ? undefined : props['aria-label']}
          >
            <For each={shown()}>
              {(group) => {
                const options = () => (
                  <For each={group.items}>
                    {(item) => (
                      <Combobox.Option
                        value={item.value}
                        selected={item.value === value()}
                        disabled={item.disabled}
                        class={style.option}
                      >
                        <CheckIcon />
                        <span data-slot="select-option-label">{item.label}</span>
                      </Combobox.Option>
                    )}
                  </For>
                );
                return group.group === undefined ? options() : <Combobox.Group label={group.group}>{options()}</Combobox.Group>;
              }}
            </For>
          </Combobox.Options>
          <Show when={shown().length === 0}>
            <Combobox.Empty>{props.nothingFoundMessage ?? 'Nothing found'}</Combobox.Empty>
          </Show>
        </Combobox.Dropdown>
      </Combobox>
      <Show when={props.name}>
        <input type="hidden" name={props.name} value={value() ?? ''} />
      </Show>
    </>
  );
}

/**
 * A labelled field that picks one value from a list in a dropdown: the selection, from `data`, in a field box, and
 * the options in a listbox. Not searchable, the field is a button; `searchable` makes it a text field that filters
 * the options. The arrow keys, Enter, Escape and typing work as in a native select. Needs a `<SlopkitUi>` above it.
 */
export function Select(props: SelectProps) {
  return (
    <FieldWrapper field={props} rootClass="slp-select">
      <SelectField {...props} />
    </FieldWrapper>
  );
}
