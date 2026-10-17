// Pure helpers for the front desk screens: date text, the 8-week visit grid and the
// member card numbers. Status itself always comes from statusOf() in demo/state.ts.

import { periodEnd, renewalStart } from '../../domain/coverage';
import type { IsoDate } from '../../domain/dates';
import { addDays, parts } from '../../domain/dates';
import type { MembershipStatus } from '../../domain/status';
import type { Member } from '../../demo/seed';
import type { DemoState } from '../../demo/state';
import { daysLeft, statusOf } from '../../demo/state';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtDay(date: IsoDate): string {
  const p = parts(date);
  return `${MONTHS[p.month - 1]} ${p.day}`;
}

export function fmtLong(date: IsoDate): string {
  return `${fmtDay(date)}, ${parts(date).year}`;
}

// 1 visit, 0 rest, 2 today (not yet checked in), -1 later this week
type Plan = number[][];

const PLANS: Record<string, Plan> = {
  mika: [[1,0,0,1,0,0,0],[0,0,0,0,0,0,0],[1,0,1,0,1,1,0],[1,1,0,1,0,1,0],[0,1,1,0,1,0,1],[0,0,0,1,1,1,1],[1,0,1,1,1,1,0],[1,0,1,0,0,2,-1]],
  bea: [[1,0,1,0,1,0,0],[0,1,0,1,0,0,0],[1,0,1,0,0,1,0],[0,1,0,0,1,0,0],[1,0,0,1,0,0,0],[0,1,0,0,1,0,0],[1,0,0,1,0,0,0],[1,0,0,0,0,2,-1]],
  paolo: [[1,0,1,0,0,0,0],[0,1,0,0,1,0,0],[1,0,0,0,0,1,0],[0,0,1,0,0,0,0],[1,0,0,0,0,0,0],[1,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,2,-1]],
};

// Demo members without a drawn grid get a repeatable pattern derived from their id.
function generatedPlan(id: string): Plan {
  let seed = 0;
  for (const ch of id) seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
  const next = () => {
    seed = (seed * 75 + 74) % 65537;
    return seed / 65537;
  };
  const plan: Plan = [];
  for (let w = 0; w < 8; w++) {
    const row: number[] = [];
    for (let d = 0; d < 7; d++) row.push(next() < 0.4 ? 1 : 0);
    plan.push(row);
  }
  plan[7][5] = 2;
  plan[7][6] = -1;
  return plan;
}

export interface GridWeek {
  gap: string;
  days: { bg: string; border: string }[];
}

export function buildGrid(memberId: string, gap: string, laterBorder: string, checkedIn: boolean): { weeks: GridWeek[]; visits: number } {
  const plan = PLANS[memberId] ?? generatedPlan(memberId);
  let visits = 0;
  const weeks = plan.map((days, wi) => ({
    gap: wi === plan.length - 1 ? '0px' : gap,
    days: days.map((raw) => {
      const v = raw === 2 && checkedIn ? 1 : raw;
      if (v === 1) {
        visits++;
        return { bg: '#E4E4E7', border: '0' };
      }
      if (v === 2) return { bg: 'transparent', border: '1px solid #FF6A00' };
      if (v === -1) return { bg: 'transparent', border: `1px solid ${laterBorder}` };
      return { bg: '#3F3F46', border: '0' };
    }),
  }));
  return { weeks, visits };
}

export type Kind = 'active' | 'grace' | 'blocked';

export const STATUS_LABEL: Record<MembershipStatus, string> = {
  frozen: 'Frozen',
  active: 'Active',
  expiring_soon: 'Expiring soon',
  grace: 'Grace Period',
  expired: 'Expired',
  inactive: 'Inactive',
  dormant: 'Dormant',
  no_plan: 'No plan',
};

export interface MemberView {
  status: MembershipStatus;
  kind: Kind;
  checkedIn: boolean;
  initials: string;
  name: string;
  memberId: string;
  statusLabel: string;
  statusColor: string;
  planLine: string;
  days: string;
  daysShort: string;
  ringColor: string;
  ringDash: string;
  ringLabel: string;
  weeks: GridWeek[];
  visits: string;
  gridLabel: string;
  lastVisit: string;
  lastVisitNote: string;
  endedDay: string;
  graceUntilDay: string;
  renewFrom: string;
  renewTo: string;
  graceDays: number;
}

export function memberView(state: DemoState, member: Member, ring: number, gap: string, laterBorder: string): MemberView {
  const status = statusOf(state, member);
  const kind: Kind = status === 'active' || status === 'expiring_soon' ? 'active' : status === 'grace' ? 'grace' : 'blocked';
  const checkedIn = state.signIns.some((s) => s.memberId === member.id);
  const left = daysLeft(state, member);
  const end = member.coverageEnd;
  const grid = buildGrid(member.id, gap, laterBorder, checkedIn);
  const [when, rest] = member.lastVisit.split(', ');
  const start = renewalStart(end, state.today, member.graceDays);
  let days = '0';
  let daysShort = 'days';
  let ringColor = '#FFFFFF';
  let dash = 0;
  let ringLabel = 'No coverage on file';
  if (left !== null && kind === 'active') {
    days = String(left);
    dash = Math.min(1, left / 31) * ring;
    ringLabel = `${left} of 31 days of coverage left`;
  } else if (left !== null && kind === 'grace') {
    const g = member.graceDays + left;
    days = String(g);
    daysShort = 'grace';
    ringColor = '#FF6A00';
    dash = (g / member.graceDays) * ring;
    ringLabel = `${g} of ${member.graceDays} grace days left`;
  } else if (left !== null) {
    days = String(-left);
    daysShort = 'past';
    ringLabel = `Coverage ended ${-left} days ago`;
  }
  const color = kind === 'active' ? (status === 'active' ? '#30D158' : '#FF6A00') : kind === 'grace' ? '#FF6A00' : '#FF6961';
  return {
    status,
    kind,
    checkedIn,
    initials: member.initials,
    name: member.name,
    memberId: member.code,
    statusLabel: STATUS_LABEL[status],
    statusColor: color,
    planLine: end === null ? `${member.plan} plan` : kind === 'active' ? `${member.plan} plan, valid through ${fmtLong(end)}` : `${member.plan} plan, ended ${fmtLong(end)}`,
    days,
    daysShort,
    ringColor,
    ringDash: `${dash.toFixed(1)} ${ring}`,
    ringLabel,
    weeks: grid.weeks,
    visits: String(grid.visits),
    gridLabel: `${grid.visits} visits in the last 8 weeks, ${checkedIn ? 'checked in today' : kind === 'blocked' ? `none since ${when}` : 'today pending'}`,
    lastVisit: when,
    lastVisitNote: rest ? `last visit, ${rest}` : 'last visit',
    endedDay: end === null ? '' : fmtDay(end),
    graceUntilDay: end === null ? '' : fmtDay(addDays(end, member.graceDays)),
    renewFrom: fmtDay(start),
    renewTo: fmtDay(periodEnd(start, 1)),
    graceDays: member.graceDays,
  };
}

