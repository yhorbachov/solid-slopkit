import { createMemo, createSignal, flush, For, omit, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import style from './pagination.module.css';
import { paginationRange } from './pagination-range';
import { type ElementProps } from '../../../utils';
import { joinClass } from '../../../style-props';
import type { SlopColor, SlopSize } from '../../../core';

export interface PaginationOwnProps {
  /** How many pages there are. */
  total: number;
  /** The current page, from 1, for a controlled pagination. */
  value?: number;
  /** The page it starts on, for an uncontrolled one. Read once. Defaults to 1. */
  defaultValue?: number;
  /** Called with the page when one is chosen. */
  onChange?: (page: number) => void;
  /** Pages shown on each side of the current one. Defaults to 1. */
  siblings?: number;
  /** Pages always shown at the start and the end. Defaults to 1. */
  boundaries?: number;
  /** Shows the previous and next buttons. Defaults to `true`. */
  withControls?: boolean;
  /** Shows the first and last page buttons. */
  withEdges?: boolean;
  /** Makes the pages links to these addresses, rather than buttons. */
  getPageHref?: (page: number) => string;
  /** Hides it while there's only one page, or none. */
  hideWithOnePage?: boolean;
  disabled?: boolean;
  /** The current page's color role. Defaults to `primary`. */
  color?: SlopColor;
  /** Defaults to `md`. */
  size?: SlopSize;
  /** The previous button's name. Defaults to `Previous page`. */
  previousLabel?: string;
  /** The next button's name. Defaults to `Next page`. */
  nextLabel?: string;
  /** The first page button's name. Defaults to `First page`. */
  firstLabel?: string;
  /** The last page button's name. Defaults to `Last page`. */
  lastLabel?: string;
  /** A page's name. Defaults to `Page 3`. */
  pageLabel?: (page: number) => string;
}

export type PaginationProps = ElementProps<JSX.HTMLAttributes<HTMLElement>, PaginationOwnProps>;

// Functions, so each button gets its own elements.
const icons = {
  previous: () => <path d="m15 18-6-6 6-6" />,
  next: () => <path d="m9 18 6-6-6-6" />,
  first: () => (
    <>
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </>
  ),
  last: () => (
    <>
      <path d="m6 17 5-5-5-5" />
      <path d="m13 17 5-5-5-5" />
    </>
  ),
};

type Control = keyof typeof icons;

function ControlIcon(props: { control: Control }) {
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
      {icons[props.control]()}
    </svg>
  );
}

/**
 * Pages of content, and a row of buttons (or links) to move between them: the first and last pages, the pages around
 * the current one, a gap where pages are left out, and previous and next. A `nav` named `Pagination`.
 */
export function Pagination(props: PaginationProps) {
  const others = omit(
    props,
    'class',
    'total',
    'value',
    'defaultValue',
    'onChange',
    'siblings',
    'boundaries',
    'withControls',
    'withEdges',
    'getPageHref',
    'hideWithOnePage',
    'disabled',
    'color',
    'size',
    'previousLabel',
    'nextLabel',
    'firstLabel',
    'lastLabel',
    'pageLabel',
  );

  const total = () => Math.max(0, Math.floor(props.total));
  const [own, setOwn] = createSignal(
    untrack(() => props.defaultValue ?? 1),
    { name: 'Pagination.value' },
  );
  // Always a page that exists, once there is one.
  const page = () => Math.min(Math.max(1, props.value ?? own()), Math.max(1, total()));
  const items = createMemo(
    () => paginationRange(total(), page(), Math.max(0, props.siblings ?? 1), Math.max(0, props.boundaries ?? 1)),
    { name: 'Pagination.items' },
  );

  const go = (next: number) => {
    if (props.disabled || next < 1 || next > total() || next === page()) return;
    if (props.value === undefined) setOwn(next);
    props.onChange?.(next);
    flush();
  };

  const pageLabel = (number: number) => props.pageLabel?.(number) ?? `Page ${number}`;

  // A page or a control: a link with `getPageHref`, a button otherwise. One that goes nowhere is disabled.
  function Item(itemProps: {
    target: () => number;
    label: () => string;
    current?: () => boolean;
    control?: Control;
    children?: JSX.Element;
  }) {
    // Disabled, out of range, or a control that would stay on this page (first on the first, last on the last).
    const inert = () =>
      !!props.disabled ||
      itemProps.target() < 1 ||
      itemProps.target() > total() ||
      (!!itemProps.control && itemProps.target() === page());
    const shared = {
      get 'aria-label'() {
        return itemProps.label();
      },
      get 'data-current'() {
        return itemProps.current?.() ? '' : undefined;
      },
      get 'data-disabled'() {
        return inert() ? '' : undefined;
      },
      get 'data-slot'() {
        return itemProps.control ? `pagination-${itemProps.control}` : 'pagination-page';
      },
      class: style.item,
      onClick: (event: MouseEvent) => {
        if (inert()) {
          event.preventDefault();
          return;
        }
        go(itemProps.target());
      },
    };
    const content = () => (itemProps.control ? <ControlIcon control={itemProps.control} /> : itemProps.children);

    return (
      <li class={style.entry}>
        <Show
          when={props.getPageHref}
          fallback={
            <button type="button" disabled={inert()} aria-current={itemProps.current?.() ? 'page' : undefined} {...shared}>
              {content()}
            </button>
          }
        >
          {(getHref) => (
            // A link that goes nowhere has no href, so it keeps the link role explicitly and says it's disabled.
            // Every link says whether it's current, so a router that marks links to the current page adds nothing
            // (ADR 0015).
            <a
              href={inert() ? undefined : getHref()(itemProps.target())}
              role={inert() ? 'link' : undefined}
              aria-disabled={inert() ? 'true' : undefined}
              aria-current={itemProps.current?.() ? 'page' : 'false'}
              {...shared}
            >
              {content()}
            </a>
          )}
        </Show>
      </li>
    );
  }

  return (
    <Show when={!props.hideWithOnePage || total() > 1}>
      <nav
        aria-label="Pagination"
        data-size={props.size ?? 'md'}
        data-color={props.color ?? 'primary'}
        data-disabled={props.disabled ? '' : undefined}
        class={joinClass(['slp-pagination', style.pagination], props.class)}
        {...others}
      >
        <ul data-slot="pagination-list" class={style.list}>
          <Show when={props.withEdges}>
            <Item control="first" target={() => 1} label={() => props.firstLabel ?? 'First page'} />
          </Show>
          <Show when={props.withControls ?? true}>
            <Item control="previous" target={() => page() - 1} label={() => props.previousLabel ?? 'Previous page'} />
          </Show>
          <For each={items()}>
            {(item) =>
              typeof item === 'number' ? (
                <Item target={() => item} label={() => pageLabel(item)} current={() => item === page()}>
                  {item}
                </Item>
              ) : (
                <li data-slot="pagination-dots" aria-hidden="true" class={joinClass([style.entry, style.dots], undefined)}>
                  …
                </li>
              )
            }
          </For>
          <Show when={props.withControls ?? true}>
            <Item control="next" target={() => page() + 1} label={() => props.nextLabel ?? 'Next page'} />
          </Show>
          <Show when={props.withEdges}>
            <Item control="last" target={total} label={() => props.lastLabel ?? 'Last page'} />
          </Show>
        </ul>
      </nav>
    </Show>
  );
}
