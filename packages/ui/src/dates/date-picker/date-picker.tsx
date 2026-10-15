import { createProjection, createSignal, flush, omit, untrack } from 'solid-js';
import { Calendar, type CalendarCellState, type CalendarProps } from '../calendar';
import { addDays, addMonths, compareDays, createDay, endOfMonth, isSameDay, startOfDay, startOfMonth } from '../date';
import { callHandler } from '../../utils';
import { joinClass } from '../../style-props';

/** What a date picker chooses: one day, several, or a range from one day to another. */
export type DatePickerType = 'default' | 'multiple' | 'range';

/** The value of a date picker of a type: a day or `null`, an array of days, or a range's two ends. */
export type DatePickerValue<Type extends DatePickerType = 'default'> = Type extends 'range'
  ? [Date | null, Date | null]
  : Type extends 'multiple'
    ? Date[]
    : Date | null;

export interface DatePickerOwnProps<Type extends DatePickerType = 'default'> {
  /** What it chooses. Defaults to `default`, one day. Read once. */
  type?: Type;
  /** The chosen days, for a controlled date picker. */
  value?: DatePickerValue<Type>;
  /** The days chosen first, for an uncontrolled one. Read once. */
  defaultValue?: DatePickerValue<Type>;
  /** Called with the new value when the user chooses. */
  onChange?: (value: DatePickerValue<Type>) => void;
  /** Lets a click on the chosen day clear it (`default` type). */
  allowDeselect?: boolean;
  /** Lets a range start and end on the same day (`range` type). */
  allowSingleDateInRange?: boolean;
}

// The div's own `onChange`, `value`, `defaultValue` and `type` attributes would blur the value's types.
export type DatePickerProps<Type extends DatePickerType = 'default'> = Omit<
  CalendarProps,
  'minLevel' | 'onChange' | 'value' | 'defaultValue' | 'type'
> &
  DatePickerOwnProps<Type>;

// The `data-date` of a day cell: `2026-10-15`.
const pad = (number: number) => String(number).padStart(2, '0');
const dayKey = (date: Date) =>
  `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const emptyValue = (type: DatePickerType) =>
  (type === 'range' ? [null, null] : type === 'multiple' ? [] : null) as DatePickerValue<DatePickerType>;

/**
 * A calendar to choose days with: one, several (`type="multiple"`), or a range from one day to another
 * (`type="range"`), previewed as the pointer or the focus moves. Every Calendar prop works; `getDayProps` and
 * `onDayClick` still get every day.
 */
export function DatePicker<Type extends DatePickerType = 'default'>(props: DatePickerProps<Type>) {
  const others = omit(
    props,
    'class',
    'type',
    'value',
    'defaultValue',
    'onChange',
    'allowDeselect',
    'allowSingleDateInRange',
    'getDayProps',
    'onDayClick',
    'date',
    'defaultDate',
    'onDateChange',
    'onPointerOver',
    'onPointerLeave',
    'onFocusIn',
  );
  const type: DatePickerType = untrack(() => props.type ?? 'default');

  const [own, setOwn] = createSignal<DatePickerValue<DatePickerType>>(
    untrack(() => (props.defaultValue as DatePickerValue<DatePickerType> | undefined) ?? emptyValue(type)),
    { name: 'DatePicker.value' },
  );
  const value = (): DatePickerValue<DatePickerType> => (props.value as DatePickerValue<DatePickerType> | undefined) ?? own();

  const days = (): Date[] => {
    const current = value();
    if (type === 'range') return (current as [Date | null, Date | null]).filter((day): day is Date => !!day);
    if (type === 'multiple') return current as Date[];
    return current ? [current as Date] : [];
  };

  // The month shown, tracked so a range is marked only where it can be seen.
  const [ownShown, setOwnShown] = createSignal<Date>(
    untrack(() => startOfMonth(props.date ?? props.defaultDate ?? days()[0] ?? new Date())),
    { name: 'DatePicker.shown' },
  );
  const shown = () => startOfMonth(props.date ?? ownShown());

  // The day under the pointer or the focus while a range has its start but no end.
  const [hovered, setHovered] = createSignal<Date | undefined>(undefined, {
    name: 'DatePicker.hovered',
    equals: (a, b) => (a && b ? isSameDay(a, b) : a === b),
  });

  // How each marked day looks, keyed by day, so a choice or a moving preview re-runs only the days it changes.
  const marks = createProjection<Record<string, CalendarCellState>>(
    (draft) => {
      const next: Record<string, CalendarCellState> = {};
      if (type === 'range') {
        const [start, end] = value() as [Date | null, Date | null];
        const preview = start && !end ? hovered() : undefined;
        const last = end ?? (start && preview && !isSameDay(preview, start) ? preview : null);
        if (start && last) {
          const [from, to] = compareDays(start, last) <= 0 ? [start, last] : [last, start];
          // Only the days a calendar of up to a year of columns can show, with its outside days.
          const first = addDays(startOfMonth(shown()), -7);
          const final = addDays(endOfMonth(addMonths(shown(), 12)), 7);
          for (let day = compareDays(from, first) > 0 ? from : first; compareDays(day, to) <= 0; day = addDays(day, 1)) {
            if (compareDays(day, final) > 0) break;
            next[dayKey(day)] = { inRange: true };
          }
          Object.assign((next[dayKey(from)] ??= {}), { firstInRange: true });
          Object.assign((next[dayKey(to)] ??= {}), { lastInRange: true });
          next[dayKey(start)] = { ...next[dayKey(start)], selected: true };
          if (end) next[dayKey(end)] = { ...next[dayKey(end)], selected: true };
        } else if (start) next[dayKey(start)] = { selected: true };
      } else for (const day of days()) next[dayKey(day)] = { selected: true };

      for (const key of Object.keys(draft)) if (!(key in next)) delete draft[key];
      for (const [key, state] of Object.entries(next)) {
        const old = draft[key];
        if (
          !old ||
          old.selected !== state.selected ||
          old.inRange !== state.inRange ||
          old.firstInRange !== state.firstInRange ||
          old.lastInRange !== state.lastInRange
        )
          draft[key] = state;
      }
    },
    {},
    { name: 'DatePicker.marks' },
  );

  const commit = (next: DatePickerValue<DatePickerType>) => {
    if (props.value === undefined) setOwn(next);
    (props.onChange as ((value: DatePickerValue<DatePickerType>) => void) | undefined)?.(next);
  };

  const choose = (date: Date) => {
    const day = startOfDay(date);
    if (type === 'multiple') {
      const current = value() as Date[];
      commit(
        current.some((other) => isSameDay(other, day)) ? current.filter((other) => !isSameDay(other, day)) : [...current, day],
      );
    } else if (type === 'range') {
      const [start, end] = value() as [Date | null, Date | null];
      if (!start || end) commit([day, null]);
      else if (isSameDay(start, day)) commit(props.allowSingleDateInRange ? [day, day] : [null, null]);
      else commit(compareDays(day, start) < 0 ? [day, start] : [start, day]);
      setHovered(undefined);
    } else {
      const current = value() as Date | null;
      if (current && isSameDay(current, day)) {
        if (props.allowDeselect) commit(null);
      } else commit(day);
    }
    flush();
  };

  // The day a pointer or focus event happened on, from its cell's `data-date`.
  const dayOf = (event: Event): Date | undefined => {
    const cell = (event.target as Element | null)?.closest?.<HTMLElement>('[data-slot="calendar-day"]');
    const match = cell?.dataset.date && /^(\d{4})-(\d{2})-(\d{2})$/.exec(cell.dataset.date);
    return match ? createDay(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : undefined;
  };
  const preview = (event: Event) => {
    if (type !== 'range') return;
    const [start, end] = value() as [Date | null, Date | null];
    const day = dayOf(event);
    if (start && !end && day) setHovered(day);
  };

  return (
    <Calendar
      class={joinClass(['slp-date-picker'], props.class)}
      date={props.date}
      defaultDate={untrack(() => props.defaultDate ?? days()[0])}
      onDateChange={(date) => {
        setOwnShown(date);
        props.onDateChange?.(date);
      }}
      getDayProps={(date) => ({ ...props.getDayProps?.(date), ...marks[dayKey(date)] })}
      onDayClick={(date, event) => {
        props.onDayClick?.(date, event);
        choose(date);
      }}
      onPointerOver={(event: PointerEvent) => {
        callHandler(props.onPointerOver, event);
        preview(event);
      }}
      onPointerLeave={(event: PointerEvent) => {
        callHandler(props.onPointerLeave, event);
        setHovered(undefined);
      }}
      onFocusIn={(event: FocusEvent) => {
        callHandler(props.onFocusIn, event);
        preview(event);
      }}
      data-type={type}
      {...others}
    />
  );
}
