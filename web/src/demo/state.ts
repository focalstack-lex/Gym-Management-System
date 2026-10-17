// Pure demo state and reducer. Every rule comes from web/src/domain (spec section 4);
// the UI never computes coverage or status on its own.

import { addDays, diffDays } from '../domain/dates';
import type { IsoDate } from '../domain/dates';
import { periodEnd, renewalStart } from '../domain/coverage';
import type { DrawerCount } from '../domain/drawer';
import { drawerTotal } from '../domain/drawer';
import type { MembershipStatus } from '../domain/status';
import { doorDecision, membershipStatus } from '../domain/status';
import type { AuditEntry, Member, PaymentMode, SignIn } from './seed';
import { DEMO_TIME, DEMO_TODAY, SEED_DRAWER, SEED_EARLIER, SEED_MEMBERS, SEED_SIGN_INS } from './seed';

export type AllowReason = 'Will pay before leaving' | 'Owner approved' | 'E-wallet payment pending' | 'Other';

export interface DemoState {
  today: IsoDate;
  time: string;
  online: boolean;
  outbox: number;
  attendant: string;
  members: Member[];
  signIns: SignIn[];
  earlier: { checkIns: number; walkIns: number };
  audit: AuditEntry[];
  drawer: { outgoing: DrawerCount | null; incoming: DrawerCount | null; draft: DrawerCount };
}

export const initialState = (): DemoState => ({
  today: DEMO_TODAY,
  time: DEMO_TIME,
  online: true,
  outbox: 0,
  attendant: 'Ana R.',
  members: SEED_MEMBERS.map((m) => ({ ...m })),
  signIns: SEED_SIGN_INS.map((s) => ({ ...s })),
  earlier: { ...SEED_EARLIER },
  audit: [],
  drawer: { outgoing: null, incoming: null, draft: SEED_DRAWER },
});

export type DemoAction =
  | { type: 'checkIn'; memberId: string }
  | { type: 'allowEntry'; memberId: string; reason: AllowReason; note: string | null }
  | { type: 'renew'; memberId: string; months: number; mode: PaymentMode }
  | { type: 'recordWalkIn'; name: string; mode: PaymentMode; reference: string | null }
  | { type: 'setOnline'; online: boolean }
  | { type: 'setDraftCount'; count: DrawerCount }
  | { type: 'lockCount'; role: 'outgoing' | 'incoming' };

let seq = 100;
const nextId = (prefix: string) => `${prefix}${++seq}`;

function audit(state: DemoState, action: string, target: string, detail: string): AuditEntry[] {
  return [{ id: nextId('a'), time: state.time, actor: state.attendant, action, target, detail }, ...state.audit];
}

// Offline writes queue in the outbox (spec section 5) instead of failing.
const queued = (state: DemoState) => (state.online ? state.outbox : state.outbox + 1);

export function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'checkIn': {
      const member = state.members.find((m) => m.id === action.memberId);
      if (!member) return state;
      if (doorDecision(statusOf(state, member)) !== 'allow') return state;
      const entry: SignIn = { id: nextId('s'), time: state.time, name: member.name, memberId: member.id, kind: 'member', payment: null };
      return {
        ...state,
        signIns: [entry, ...state.signIns],
        members: state.members.map((m) => (m.id === member.id ? { ...m, lastVisit: `Today, ${state.time}` } : m)),
        audit: audit(state, 'Check-in', member.name, member.code),
        outbox: queued(state),
      };
    }
    case 'allowEntry': {
      const member = state.members.find((m) => m.id === action.memberId);
      if (!member) return state;
      if (action.reason === 'Other' && !action.note?.trim()) return state;
      const entry: SignIn = { id: nextId('s'), time: state.time, name: member.name, memberId: member.id, kind: 'member', payment: null };
      const detail = action.note?.trim() ? `${action.reason}: ${action.note.trim()}` : action.reason;
      return {
        ...state,
        signIns: [entry, ...state.signIns],
        audit: audit(state, 'Entry allowed with reason', member.name, detail),
        outbox: queued(state),
      };
    }
    case 'renew': {
      const member = state.members.find((m) => m.id === action.memberId);
      if (!member) return state;
      const start = renewalStart(member.coverageEnd, state.today, member.graceDays);
      const end = periodEnd(start, action.months);
      return {
        ...state,
        members: state.members.map((m) => (m.id === member.id ? { ...m, coverageEnd: end } : m)),
        audit: audit(state, 'Renewal', member.name, `${start} to ${end}, ${action.mode}`),
        outbox: queued(state),
      };
    }
    case 'recordWalkIn': {
      if (!action.name.trim()) return state;
      if (action.mode !== 'cash' && !/^\d+$/.test(action.reference ?? '')) return state;
      const entry: SignIn = {
        id: nextId('s'),
        time: state.time,
        name: action.name.trim(),
        memberId: null,
        kind: 'walkin',
        payment: { mode: action.mode, reference: action.mode === 'cash' ? null : (action.reference ?? '').slice(-4) },
      };
      return {
        ...state,
        signIns: [entry, ...state.signIns],
        audit: audit(state, 'Walk-in recorded', entry.name, action.mode),
        outbox: queued(state),
      };
    }
    case 'setOnline':
      // Reconnecting syncs the outbox (demo: immediately).
      return { ...state, online: action.online, outbox: action.online ? 0 : state.outbox };
    case 'setDraftCount':
      return { ...state, drawer: { ...state.drawer, draft: action.count } };
    case 'lockCount': {
      if (state.drawer[action.role]) return state; // locked counts are immutable
      return {
        ...state,
        drawer: { ...state.drawer, [action.role]: state.drawer.draft },
        audit: audit(state, 'Drawer count locked', action.role, `${drawerTotal(state.drawer.draft)} centavos`),
      };
    }
  }
}

export function statusOf(state: DemoState, member: Member): MembershipStatus {
  return membershipStatus({ today: state.today, coverageEnd: member.coverageEnd, graceDays: member.graceDays, frozen: member.frozen });
}

export function daysLeft(state: DemoState, member: Member): number | null {
  return member.coverageEnd === null ? null : diffDays(state.today, member.coverageEnd);
}

export function graceUntil(member: Member): IsoDate | null {
  return member.coverageEnd === null ? null : addDays(member.coverageEnd, member.graceDays);
}

export function searchMembers(state: DemoState, query: string): Member[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return state.members.filter(
    (m) => m.name.toLowerCase().includes(q) || (m.nickname ?? '').toLowerCase().includes(q) || m.code.toLowerCase().includes(q),
  );
}

export function sheetCounts(state: DemoState): { checkIns: number; walkIns: number } {
  const listed = state.signIns.reduce(
    (acc, s) => (s.kind === 'walkin' ? { ...acc, walkIns: acc.walkIns + 1 } : { ...acc, checkIns: acc.checkIns + 1 }),
    { checkIns: 0, walkIns: 0 },
  );
  return { checkIns: state.earlier.checkIns + listed.checkIns, walkIns: state.earlier.walkIns + listed.walkIns };
}

// The expected drawer total is only revealed after both attendants lock (spec 8.1.4).
export function reconciliation(state: DemoState): { outgoing: number; incoming: number } | null {
  const { outgoing, incoming } = state.drawer;
  if (!outgoing || !incoming) return null;
  return { outgoing: drawerTotal(outgoing), incoming: drawerTotal(incoming) };
}
