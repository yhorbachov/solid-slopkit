import { createSignal, createUniqueId, flush, omit, onCleanup, onSettled, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import style from './date-picker-input.module.css';
import type { CalendarOwnProps } from '../calendar';
import { DatePicker, type DatePickerOwnProps, type DatePickerType, type DatePickerValue } from '../date-picker';
import { formatDate } from '../format';
import { DAY_UNIT, emptyValue } from '../picker-value';
import { useLocale } from '../../components/provider';
import { controlProps, FieldWrapper, type FieldWrapperProps } from '../../components/inputs/field';
import { Input, type InputOwnProps } from '../../components/inputs/input';
import { useInputWrapper } from '../../components/inputs/input-wrapper';
import { CloseButton } from '../../components/button/close-button';
import { createDismissal, createFloating, createPresence, type FloatingPlacement } from '../../components/primitives';
import { transitionAttributes, type TransitionName } from '../../components/utilities/transition/transition-attributes';
import { callHandler, type ElementProps } from '../../utils';
import { joinClass } from '../../style-props';

type AnyValue = DatePickerValue<DatePickerType>;

export interface DatePickerInputOwnProps<Type extends DatePickerType = 'default'>
  extends
    FieldWrapperProps,
    Omit<CalendarOwnProps, 'size' | 'minLevel'>,
    DatePickerOwnProps<Type>,
    Pick<InputOwnProps, 'variant' | 'leftSection' | 'rightSection' | 'disabled' | 'readOnly'> {
  /** Shown while nothing is chosen. */
  placeholder?: string;
  /** How a day is written in the field, as `Intl.DateTimeFormat` options. Defaults to `{ dateStyle: 'medium' }`. */
  valueFormat?: Intl.DateTimeFormatOptions;
  /** Between a range's two days in the field. Defaults to ` – `. */
  labelSeparator?: string;
  /** Closes the dropdown once a day is chosen, or a range's end. Defaults to `true`; several days never close it. */
  closeOnChange?: boolean;
  /** Adds a button that clears the value. */
  clearable?: boolean;
  /** The clear button's accessible name. Defaults to `Clear`. */
  clearLabel?: string;
  /** Submits the value with a form, through a hidden input: `2026-10-15`, comma-separated for several or a range. */
  name?: string;
  /** Where the dropdown goes against the field. Defaults to `bottom-start`. */
  position?: FloatingPlacement;
  /** Gap between the field and the dropdown, in px. Defaults to 4. */
  offset?: number;
  /** The dropdown's animation. Defaults to `fade`. */
  transition?: TransitionName;
  /** Duration of the animation, in ms. Defaults to 150. */
  transitionDuration?: number;
}

export type DatePickerInputProps<Type extends DatePickerType = 'default'> = ElementProps<
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'value' | 'defaultValue' | 'onChange'>,
  DatePickerInputOwnProps<Type>
>;

// The props that go to the DatePicker in the dropdown.
const PICKER_KEYS = [
  'date',
  'defaultDate',
  'onDateChange',
  'level',
  'defaultLevel',
  'onLevelChange',
  'maxLevel',
  'numberOfColumns',
  'minDate',
  'maxDate',
  'excludeDate',
  'getDayProps',
  'getMonthProps',
  'getYearProps',
  'onDayClick',
  'onMonthClick',
  'onYearClick',
  'renderDay',
  'firstDayOfWeek',
  'weekendDays',
  'fixedWeeks',
  'hideOutsideDates',
  'hideWeekdays',
  'weekdayFormat',
  'locale',
  'color',
  'previousLabel',
  'nextLabel',
  'allowDeselect',
  'allowSingleDateInRange',
] as const;

const OWN_KEYS = [
  'type',
  'value',
  'defaultValue',
  'onChange',
  'placeholder',
  'valueFormat',
  'labelSeparator',
  'closeOnChange',
  'clearable',
  'clearLabel',
  'name',
  'position',
  'offset',
  'transition',
  'transitionDuration',
  'variant',
  'leftSection',
  'rightSection',
  'disabled',
  'readOnly',
  'onClick',
  'onFocusOut',
  'aria-describedby',
] as const;

function DatePickerInputField(props: DatePickerInputProps<DatePickerType>) {
  const wrapper = useInputWrapper();
  const providerLocale = useLocale();
  const others = omit(controlProps(props) as DatePickerInputProps<DatePickerType>, ...PICKER_KEYS, ...OWN_KEYS);
  // Getters, so the DatePicker reads each prop where it uses it.
  const pickerProps = Object.defineProperties(
    {},
    Object.fromEntries(PICKER_KEYS.map((key) => [key, { enumerable: true, get: () => (props as Record<string, unknown>)[key] }])),
  ) as Partial<CalendarOwnProps>;

  const type: DatePickerType = untrack(() => props.type ?? 'default');
  const [own, setOwn] = createSignal<AnyValue>(
    untrack(() => (props.defaultValue as AnyValue | undefined) ?? emptyValue(type)),
    {
      name: 'DatePickerInput.value',
    },
  );
  const value = (): AnyValue => (props.value as AnyValue | undefined) ?? own();
  const days = (): Date[] => {
    const current = value();
    if (type === 'range') return (current as [Date | null, Date | null]).filter((day): day is Date => !!day);
    if (type === 'multiple') return current as Date[];
    return current ? [current as Date] : [];
  };

  const setValue = (next: AnyValue) => {
    if (props.value === undefined) setOwn(next);
    (props.onChange as ((value: AnyValue) => void) | undefined)?.(next);
  };

  const locked = () => !!props.disabled || !!props.readOnly;
  const [opened, setOpened] = createSignal(false, { name: 'DatePickerInput.opened' });
  let control: HTMLButtonElement | undefined;
  let box: HTMLElement | undefined;
  let dropdown: HTMLDivElement | undefined;
  const dropdownId = `slp-date-picker-input-${createUniqueId()}`;
  const valueId = `${dropdownId}-value`;

  const close = (returnFocus = true) => {
    if (returnFocus && dropdown?.contains(document.activeElement)) control?.focus();
    setOpened(false);
    flush();
  };

  const presence = createPresence({ present: opened, element: () => dropdown });
  const floating = createFloating({
    reference: () => box,
    floating: () => dropdown,
    open: presence.mounted,
    placement: () => props.position ?? 'bottom-start',
    offset: () => props.offset ?? 4,
  });
  createDismissal('DatePickerInput', {
    open: opened,
    elements: () => [box, dropdown],
    onDismiss: () => close(),
  });
  const animation = transitionAttributes(presence, {
    transition: () => props.transition ?? 'fade',
    duration: () => props.transitionDuration ?? 150,
    exitDuration: () => undefined,
    timingFunction: () => 'ease',
  });

  onSettled(() => {
    // The field box, not the button in it, is what the dropdown sits under.
    box = control?.parentElement ?? undefined;
  });

  // Focus that leaves both the field and the dropdown closes it.
  const onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && (box?.contains(next) || dropdown?.contains(next))) return;
    setOpened(false);
  };

  const onPick = (next: AnyValue) => {
    setValue(next);
    if (!(props.closeOnChange ?? true) || type === 'multiple') return;
    if (type === 'range' && !(next as [Date | null, Date | null])[1]) return;
    // After the click: the calendar focuses the day it chose once the click's handlers are done.
    queueMicrotask(() => close());
  };

  const locale = () => props.locale ?? providerLocale();
  const text = () => {
    const format = (day: Date) => formatDate(day, locale(), props.valueFormat ?? { dateStyle: 'medium' });
    const current = value();
    if (type === 'range') {
      const [start, end] = current as [Date | null, Date | null];
      if (!start) return '';
      return `${format(start)}${props.labelSeparator ?? ' – '}${end ? format(end) : ''}`;
    }
    return days().map(format).join(', ');
  };

  const showClear = () => !!props.clearable && days().length > 0 && !locked();
  const clear = () => {
    setValue(emptyValue(type));
    control?.focus();
  };

  function Dropdown() {
    onSettled(() => {
      dropdown?.showPopover();
      floating.update();
      // The calendar takes the focus, on its chosen day, today or its first day.
      dropdown?.querySelector<HTMLElement>('[data-slot="calendar-grid"] [tabindex="0"]')?.focus();
    });
    onCleanup(() => (dropdown = undefined));

    return (
      <div
        ref={(element: HTMLDivElement) => (dropdown = element)}
        id={dropdownId}
        popover="manual"
        role="dialog"
        aria-labelledby={wrapper?.labelId()}
        aria-label={wrapper?.labelId() ? undefined : props['aria-label']}
        data-slot="date-picker-input-dropdown"
        data-placement={floating.placement()}
        data-transition={animation['data-transition']}
        data-status={animation['data-status']}
        class={joinClass(['slp-date-picker-input-dropdown', style.dropdown, animation.class], undefined)}
        style={animation.style}
        onFocusOut={onFocusOut}
      >
        <DatePicker {...pickerProps} type={type} value={value()} onChange={onPick} size={wrapper?.size()} />
      </div>
    );
  }

  return (
    <>
      <Input
        {...(others as Record<string, unknown>)}
        ref={(element: HTMLElement) => (control = element as HTMLButtonElement)}
        as="button"
        type="button"
        // A button can't be required: `required` only shows the asterisk and sets `aria-required`.
        required={false}
        aria-required={wrapper?.required() ? 'true' : undefined}
        aria-readonly={props.readOnly ? 'true' : undefined}
        variant={props.variant}
        leftSection={props.leftSection}
        rightSection={
          <Show when={showClear()} fallback={props.rightSection}>
            <CloseButton size="xs" label={props.clearLabel ?? 'Clear'} onClick={clear} data-slot="date-picker-input-clear" />
          </Show>
        }
        disabled={props.disabled}
        aria-haspopup="dialog"
        aria-expanded={opened() ? 'true' : 'false'}
        aria-controls={presence.mounted() ? dropdownId : undefined}
        aria-describedby={[props['aria-describedby'], text() ? valueId : ''].filter(Boolean).join(' ') || undefined}
        data-empty={text() ? undefined : ''}
        onClick={(event: MouseEvent) => {
          callHandler(props.onClick, event);
          if (event.defaultPrevented || locked()) return;
          if (opened()) close();
          else setOpened(true);
        }}
        onFocusOut={(event: FocusEvent) => {
          callHandler(props.onFocusOut, event);
          onFocusOut(event);
        }}
      >
        <span id={valueId} data-slot="date-picker-input-value" data-placeholder={text() ? undefined : ''} class={style.value}>
          {text() || props.placeholder}
        </span>
      </Input>
      <Show when={presence.mounted()}>
        <Dropdown />
      </Show>
      <Show when={props.name}>
        <input type="hidden" name={props.name} value={days().map(DAY_UNIT.key).join(',')} />
      </Show>
    </>
  );
}

/**
 * A labelled field for a day, several days or a range, chosen in a DatePicker that opens in a dropdown under it. The
 * field is a button that shows the value, written by the locale. Every DatePicker prop works. Needs a `<SlopkitUi>`
 * above it.
 */
export function DatePickerInput<Type extends DatePickerType = 'default'>(props: DatePickerInputProps<Type>) {
  return (
    <FieldWrapper field={props} rootClass={`slp-date-picker-input ${style.field}`}>
      <DatePickerInputField {...(props as unknown as DatePickerInputProps<DatePickerType>)} />
    </FieldWrapper>
  );
}
