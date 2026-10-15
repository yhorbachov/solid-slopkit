// Formatting dates with `Intl.DateTimeFormat` in a locale, usually the provider's (ADR 0003, ADR 0009).

import { useLocale } from '../components/provider';
import { addDays, createDay, type DayOfWeek } from './date';

// A formatter is costly to build and a calendar formats dozens of dates, so they are kept per locale and options.
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale} ${JSON.stringify(options)}`;
  let cached = formatters.get(key);
  if (!cached) {
    cached = new Intl.DateTimeFormat(locale, options);
    formatters.set(key, cached);
  }
  return cached;
}

/** The date as text in the locale, with `Intl.DateTimeFormat` options. Formats in the runtime's time zone. */
export function formatDate(date: Date, locale: string, options: Intl.DateTimeFormatOptions = {}): string {
  return formatter(locale, options).format(date);
}

/** A function that formats dates in the locale of the nearest `<SlopkitUi>`. Reactive: it reads the locale. */
export type FormatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => string;

/**
 * `formatDate` bound to the locale of the nearest `<SlopkitUi>`. Call the result where the text is rendered, so a
 * change of the locale formats again. Throws outside `<SlopkitUi>`.
 */
export function useFormatDate(): FormatDate {
  const locale = useLocale();
  return (date, options) => formatDate(date, locale(), options);
}

/** The names of the seven weekdays in the locale, starting on `firstDayOfWeek`. */
export function getWeekdayNames(
  locale: string,
  firstDayOfWeek: DayOfWeek,
  format: 'narrow' | 'short' | 'long' = 'short',
): string[] {
  // January 4, 1970 was a Sunday.
  const sunday = createDay(1970, 0, 4);
  return Array.from({ length: 7 }, (_, index) =>
    formatDate(addDays(sunday, firstDayOfWeek + index), locale, { weekday: format }),
  );
}

/** The names of the twelve months in the locale, January first, in the form a month shows on its own. */
export function getMonthNames(locale: string, format: 'narrow' | 'short' | 'long' = 'long'): string[] {
  return Array.from({ length: 12 }, (_, month) => formatDate(createDay(2000, month, 1), locale, { month: format }));
}
