// Month grid for the Attendance calendar: Monday-first, computed from the demo clock.

import { daysInMonth, parts } from '../../domain/dates';
import type { IsoDate } from '../../domain/dates';

export type DayKind = 'visited' | 'rest' | 'today' | 'upcoming';

export interface Cell {
  day: number | null;
  kind: DayKind | null;
}

export function monthName(month: number): string {
  return new Date(Date.UTC(2000, month - 1, 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
}

// `visited` lists the days of the month with a visit. Today is drawn separately, future days are upcoming.
export function monthGrid(today: IsoDate, visited: readonly number[], markToday = true): Cell[] {
  const { year, month, day: todayDay } = parts(today);
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const lead = (first + 6) % 7;
  const total = daysInMonth(year, month);
  const cells: Cell[] = [];
  for (let i = 0; i < lead; i++) cells.push({ day: null, kind: null });
  for (let d = 1; d <= total; d++) {
    const kind: DayKind = markToday && d === todayDay ? 'today' : d > todayDay ? 'upcoming' : visited.includes(d) ? 'visited' : 'rest';
    cells.push({ day: d, kind });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, kind: null });
  return cells;
}
