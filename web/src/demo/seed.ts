// In-memory demo data (spec section 3, Release 1 "In-Memory Demo Mode"). Values are the
// canonical sample data drawn on the design canvas so every screen matches its artboard.

import type { IsoDate } from '../domain/dates';
import { isoDate } from '../domain/dates';
import type { DrawerCount } from '../domain/drawer';

// The canvas clock: Saturday, Oct 17, 2026, 6:42 PM, Philippine time.
export const DEMO_TODAY: IsoDate = isoDate('2026-10-17');
export const DEMO_TIME = '6:42 PM';

export type PaymentMode = 'cash' | 'gcash' | 'maya';

export interface Member {
  id: string;
  code: string;
  name: string;
  nickname: string | null;
  initials: string;
  plan: string;
  coverageEnd: IsoDate | null;
  graceDays: number;
  frozen: boolean;
  lastVisit: string;
  pt: { left: number; total: number } | null;
}

export interface SignIn {
  id: string;
  time: string;
  name: string;
  memberId: string | null;
  kind: 'member' | 'walkin';
  payment: { mode: PaymentMode; reference: string | null } | null;
}

export interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  detail: string;
}

const m = (
  id: string,
  code: string,
  name: string,
  nickname: string | null,
  end: string | null,
  lastVisit: string,
  pt: Member['pt'] = null,
  plan = 'Monthly',
): Member => ({
  id,
  code,
  name,
  nickname,
  initials: name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
  plan,
  coverageEnd: end === null ? null : isoDate(end),
  graceDays: 3,
  frozen: false,
  lastVisit,
  pt,
});

export const SEED_MEMBERS: Member[] = [
  m('mika', 'INF-00482', 'Mika Santos', 'Mika', '2026-11-14', 'Wed, 6:10 PM', { left: 7, total: 12 }),
  m('paolo', 'INF-00217', 'Paolo Reyes', null, '2026-10-01', 'Sep 29'),
  m('bea', 'INF-00377', 'Bea Navarro', null, '2026-10-15', 'Mon, 7:05 AM', { left: 4, total: 12 }),
  m('carlo', 'INF-00264', 'Carlo Dizon', null, '2026-10-21', 'Today, 6:31 PM', { left: 2, total: 8 }),
  m('rhea', 'INF-00198', 'Rhea Mendoza', null, '2026-11-30', 'Today, 6:40 PM', { left: 10, total: 12 }),
  m('den', 'INF-00305', 'Den Villanueva', null, '2026-10-14', 'Today, 6:19 PM', { left: 5, total: 8 }),
  m('hannah', 'INF-00411', 'Hannah Ocampo', null, '2026-10-18', 'Thu'),
  m('marlon', 'INF-00356', 'Marlon Tan', null, '2026-10-19', 'Fri'),
  m('liza', 'INF-00402', 'Liza Flores', null, '2026-10-20', 'Wed'),
  m('gab', 'INF-00447', 'Gab Soriano', null, '2026-10-22', 'Tue'),
  m('nina', 'INF-00460', 'Nina Ramos', null, '2026-10-23', 'Mon'),
  m('ramil', 'INF-00233', 'Ramil Cruz', null, '2026-09-25', 'Sep 24'),
  m('elena', 'INF-00175', 'Elena Marquez', null, '2026-09-02', 'Sep 1'),
  m('joy', 'INF-00122', 'Joy Bautista', null, '2026-06-20', 'Jun 18'),
];

// Today's sheet before the latest entries: 44 check-ins and 8 walk-ins happened earlier.
export const SEED_EARLIER = { checkIns: 44, walkIns: 8 };

export const SEED_SIGN_INS: SignIn[] = [
  { id: 's4', time: '6:40 PM', name: 'Rhea Mendoza', memberId: 'rhea', kind: 'member', payment: null },
  { id: 's3', time: '6:38 PM', name: 'Jessa Lim', memberId: null, kind: 'walkin', payment: { mode: 'gcash', reference: '4402' } },
  { id: 's2', time: '6:31 PM', name: 'Carlo Dizon', memberId: 'carlo', kind: 'member', payment: null },
  { id: 's1', time: '6:19 PM', name: 'Den Villanueva', memberId: 'den', kind: 'member', payment: null },
];

// Entries per hour from 6 AM; index 12 is 6 PM, the current hour.
export const SEED_HOURLY = [4, 6, 5, 3, 3, 2, 3, 4, 3, 3, 5, 7, 8];

export const SEED_DRAWER: DrawerCount = {
  bills: { 1000: 2, 500: 3, 200: 4, 100: 6, 50: 5, 20: 8 },
  coinsPesos: 135,
};
