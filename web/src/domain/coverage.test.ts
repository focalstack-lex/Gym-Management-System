import { describe, expect, it } from 'vitest';
import { isoDate } from './dates';
import { DEFAULT_GRACE_DAYS, extendForFreeze, periodEnd, renewalStart } from './coverage';

const d = isoDate;

describe('periodEnd', () => {
  it('ends the day before the same date next month', () => {
    expect(periodEnd(d('2026-10-15'), 1)).toBe('2026-11-14');
    expect(periodEnd(d('2026-10-16'), 1)).toBe('2026-11-15');
    expect(periodEnd(d('2026-10-17'), 1)).toBe('2026-11-16');
    expect(periodEnd(d('2026-03-01'), 1)).toBe('2026-03-31');
    expect(periodEnd(d('2026-01-28'), 1)).toBe('2026-02-27');
  });

  it('ends on the last day when the same date does not exist in the target month', () => {
    expect(periodEnd(d('2026-01-31'), 1)).toBe('2026-02-28');
    expect(periodEnd(d('2026-01-29'), 1)).toBe('2026-02-28');
    expect(periodEnd(d('2028-01-31'), 1)).toBe('2028-02-29');
    expect(periodEnd(d('2026-08-31'), 6)).toBe('2027-02-28');
  });

  it('crosses the year boundary for multi-month packages', () => {
    expect(periodEnd(d('2026-12-15'), 1)).toBe('2027-01-14');
    expect(periodEnd(d('2026-10-15'), 3)).toBe('2027-01-14');
    expect(periodEnd(d('2026-10-15'), 12)).toBe('2027-10-14');
  });

  it('rejects non-positive or fractional month counts', () => {
    expect(() => periodEnd(d('2026-10-15'), 0)).toThrow(RangeError);
    expect(() => periodEnd(d('2026-10-15'), 1.5)).toThrow(RangeError);
  });
});

describe('renewalStart', () => {
  it('uses the renewal date for a first plan', () => {
    expect(renewalStart(null, d('2026-10-17'), DEFAULT_GRACE_DAYS)).toBe('2026-10-17');
  });

  it('chains from the old end while active', () => {
    expect(renewalStart(d('2026-11-14'), d('2026-10-17'), 3)).toBe('2026-11-15');
  });

  it('chains from the old end inside the grace window, last grace day included', () => {
    expect(renewalStart(d('2026-10-15'), d('2026-10-17'), 3)).toBe('2026-10-16');
    expect(renewalStart(d('2026-10-15'), d('2026-10-18'), 3)).toBe('2026-10-16');
  });

  it('starts on the renewal date after grace', () => {
    expect(renewalStart(d('2026-10-15'), d('2026-10-19'), 3)).toBe('2026-10-19');
    expect(renewalStart(d('2026-10-01'), d('2026-10-17'), 3)).toBe('2026-10-17');
  });

  it('matches the canvas examples end to end', () => {
    // Bea: ended Oct 15, renews in grace on Oct 17, keeps Oct 16 to Nov 15.
    expect(periodEnd(renewalStart(d('2026-10-15'), d('2026-10-17'), 3), 1)).toBe('2026-11-15');
    // Paolo: ended Oct 1, renews after grace on Oct 17, gets Oct 17 to Nov 16.
    expect(periodEnd(renewalStart(d('2026-10-01'), d('2026-10-17'), 3), 1)).toBe('2026-11-16');
  });
});

describe('extendForFreeze', () => {
  it('pushes the end date by the frozen days', () => {
    expect(extendForFreeze(d('2026-11-14'), 7)).toBe('2026-11-21');
    expect(extendForFreeze(d('2026-11-14'), 0)).toBe('2026-11-14');
  });

  it('rejects negative or fractional days', () => {
    expect(() => extendForFreeze(d('2026-11-14'), -1)).toThrow(RangeError);
    expect(() => extendForFreeze(d('2026-11-14'), 2.5)).toThrow(RangeError);
  });
});
