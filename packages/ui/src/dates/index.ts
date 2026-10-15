// The `@solid-slopkit/ui/dates` entry: date utilities on native `Date` and `Intl` (ADR 0003), and the date
// components as they land.
export {
  addDays,
  addMonths,
  addYears,
  clampDay,
  compareDays,
  createDay,
  daysInMonth,
  endOfMonth,
  getMonthGrid,
  isDayInRange,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  type DayOfWeek,
  type MonthGridOptions,
} from './date';
export { getWeekInfo, type WeekInfo } from './week-info';
export { formatDate, getMonthNames, getWeekdayNames, useFormatDate, type FormatDate } from './format';
