// Calendar dates as YYYY-MM-DD strings. All arithmetic runs in UTC so a
// date never shifts with the device timezone; "today" is taken in Manila.

export type IsoDate = string & { readonly __brand: 'IsoDate' };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isoDate(value: string): IsoDate {
  const match = ISO_DATE.exec(value);
  if (!match) throw new RangeError(`Not a YYYY-MM-DD date: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new RangeError(`Not a real calendar date: ${value}`);
  }
  return value as IsoDate;
}

export function parts(date: IsoDate): { year: number; month: number; day: number } {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

export function fromParts(year: number, month: number, day: number): IsoDate {
  const yyyy = String(year).padStart(4, '0');
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return isoDate(`${yyyy}-${mm}-${dd}`);
}

function toUtcMs(date: IsoDate): number {
  const p = parts(date);
  return Date.UTC(p.year, p.month - 1, p.day);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  if (!Number.isInteger(days)) throw new RangeError(`days must be an integer: ${days}`);
  const shifted = new Date(toUtcMs(date) + days * DAY_MS);
  return fromParts(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate());
}

export function diffDays(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

const MANILA_DAY = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function manilaToday(now: Date): IsoDate {
  const p = Object.fromEntries(MANILA_DAY.formatToParts(now).map((x) => [x.type, x.value]));
  return isoDate(`${p.year}-${p.month}-${p.day}`);
}
