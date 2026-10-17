import { describe, expect, it } from 'vitest';
import { addDays, daysInMonth, diffDays, fromParts, isoDate, manilaToday, parts } from './dates';

describe('isoDate', () => {
  it('accepts real calendar dates', () => {
    expect(isoDate('2026-10-17')).toBe('2026-10-17');
    expect(isoDate('2028-02-29')).toBe('2028-02-29');
  });

  it('rejects bad formats and impossible dates', () => {
    expect(() => isoDate('2026-2-1')).toThrow(RangeError);
    expect(() => isoDate('2026-13-01')).toThrow(RangeError);
    expect(() => isoDate('2026-02-29')).toThrow(RangeError);
    expect(() => isoDate('2026-04-31')).toThrow(RangeError);
    expect(() => isoDate('2026-00-10')).toThrow(RangeError);
    expect(() => isoDate('2026-01-00')).toThrow(RangeError);
  });
});

describe('parts and fromParts', () => {
  it('round-trips', () => {
    expect(parts(isoDate('2026-01-05'))).toEqual({ year: 2026, month: 1, day: 5 });
    expect(fromParts(2026, 1, 5)).toBe('2026-01-05');
  });
});

describe('daysInMonth', () => {
  it('handles month lengths and leap years', () => {
    expect(daysInMonth(2026, 1)).toBe(31);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
  });
});

describe('addDays and diffDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays(isoDate('2026-12-31'), 1)).toBe('2027-01-01');
    expect(addDays(isoDate('2026-03-01'), -1)).toBe('2026-02-28');
    expect(addDays(isoDate('2026-10-15'), 3)).toBe('2026-10-18');
  });

  it('handles the leap day', () => {
    expect(addDays(isoDate('2028-02-28'), 1)).toBe('2028-02-29');
    expect(addDays(isoDate('2028-02-29'), 1)).toBe('2028-03-01');
  });

  it('rejects fractional days', () => {
    expect(() => addDays(isoDate('2026-10-15'), 1.5)).toThrow(RangeError);
  });

  it('counts calendar days between dates', () => {
    expect(diffDays(isoDate('2026-10-17'), isoDate('2026-11-14'))).toBe(28);
    expect(diffDays(isoDate('2026-10-17'), isoDate('2026-10-01'))).toBe(-16);
    expect(diffDays(isoDate('2026-10-17'), isoDate('2026-10-17'))).toBe(0);
  });
});

describe('manilaToday', () => {
  it('uses UTC+8 for the calendar day', () => {
    expect(manilaToday(new Date('2026-10-16T16:30:00Z'))).toBe('2026-10-17');
    expect(manilaToday(new Date('2026-10-17T15:59:59Z'))).toBe('2026-10-17');
    expect(manilaToday(new Date('2026-10-17T16:00:00Z'))).toBe('2026-10-18');
  });
});
