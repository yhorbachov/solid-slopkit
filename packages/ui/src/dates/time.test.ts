import { describe, expect, test } from 'vitest';
import { formatTime, getDayPeriodLabels, getHourCycle, parseTime, timeToSeconds, timeToString } from './time';

describe('time helpers', () => {
  test('parseTime reads HH:mm and HH:mm:ss, null otherwise', () => {
    expect(parseTime('09:30')).toEqual({ hours: 9, minutes: 30, seconds: 0 });
    expect(parseTime('9:05:07')).toEqual({ hours: 9, minutes: 5, seconds: 7 });
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('10:60')).toBeNull();
    expect(parseTime('')).toBeNull();
    expect(parseTime(undefined)).toBeNull();
  });

  test('timeToString and timeToSeconds', () => {
    expect(timeToString({ hours: 9, minutes: 5, seconds: 7 })).toBe('09:05');
    expect(timeToString({ hours: 9, minutes: 5, seconds: 7 }, true)).toBe('09:05:07');
    expect(timeToSeconds({ hours: 1, minutes: 1, seconds: 1 })).toBe(3661);
  });

  test("a locale's hour cycle and day periods", () => {
    expect(getHourCycle('en-US')).toBe('12h');
    expect(getHourCycle('de-DE')).toBe('24h');
    expect(getDayPeriodLabels('en-US')).toEqual(['AM', 'PM']);
    expect(getDayPeriodLabels('ko-KR')).toEqual(['오전', '오후']);
  });

  test('formatTime writes the time in 12 or 24 hours', () => {
    const time = { hours: 21, minutes: 5, seconds: 9 };
    expect(formatTime(time, 'en-US', '12h')).toBe('9:05 PM');
    expect(formatTime(time, 'en-US', '24h')).toBe('21:05');
    expect(formatTime(time, 'de-DE', '24h', true)).toBe('21:05:09');
  });
});
