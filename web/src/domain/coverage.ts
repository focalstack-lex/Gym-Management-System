// Membership coverage rules, spec section 4.1 and 4.2.

import type { IsoDate } from './dates';
import { addDays, daysInMonth, fromParts, parts } from './dates';

export const DEFAULT_GRACE_DAYS = 3;

export function periodEnd(start: IsoDate, months: number): IsoDate {
  if (!Number.isInteger(months) || months < 1) {
    throw new RangeError(`months must be a positive integer: ${months}`);
  }
  const s = parts(start);
  const monthIndex = s.month - 1 + months;
  const year = s.year + Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  const lastDay = daysInMonth(year, month);
  if (s.day > lastDay) return fromParts(year, month, lastDay);
  return addDays(fromParts(year, month, s.day), -1);
}

export function renewalStart(currentEnd: IsoDate | null, renewedOn: IsoDate, graceDays: number): IsoDate {
  if (currentEnd === null) return renewedOn;
  const graceEnd = addDays(currentEnd, graceDays);
  // ISO dates compare correctly as strings.
  return renewedOn <= graceEnd ? addDays(currentEnd, 1) : renewedOn;
}

export function extendForFreeze(end: IsoDate, frozenDays: number): IsoDate {
  if (!Number.isInteger(frozenDays) || frozenDays < 0) {
    throw new RangeError(`frozenDays must be a non-negative integer: ${frozenDays}`);
  }
  return addDays(end, frozenDays);
}
