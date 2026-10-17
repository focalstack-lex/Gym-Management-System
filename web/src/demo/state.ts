// Pure demo state and reducer. Every rule comes from web/src/domain (spec section 4);
// the UI never computes coverage or status on its own.

import { addDays, diffDays } from '../domain/dates';
import type { IsoDate } from '../domain/dates';
import { extendForFreeze, periodEnd, renewalStart } from '../domain/coverage';
import type { DrawerCount } from '../domain/drawer';
import { drawerTotal } from '../domain/drawer';
import type { MembershipStatus } from '../domain/status';
import { doorDecision, membershipStatus } from '../domain/status';
import type { AuditEntry, Member, PaymentMode, SignIn } from './seed';
import { DEMO_TIME, DEMO_TODAY, SEED_DRAWER, SEED_EARLIER, SEED_MEMBERS, SEED_SIGN_INS } from './seed';

export type AllowReason = 'Will pay before leaving' | 'Owner approved' | 'E-wallet payment pending' | 'Other';

export interface PriceVersion {
  id: string;
  price: string;
  effective: IsoDate;
  note: string | null;
}

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
  priceVersions: PriceVersion[];
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
  priceVersions: [],
});

export type DemoAction =
  | { type: 'checkIn'; memberId: string }
  | { type: 'allowEntry'; memberId: string; reason: AllowReason; note: string | null }
  | { type: 'renew'; memberId: string; months: number; mode: PaymentMode }
  | { type: 'recordWalkIn'; name: string; mode: PaymentMode; reference: string | null }
  | { type: 'enroll'; name: string; nickname: string | null; plan: string; months: number; mode: PaymentMode }
  | { type: 'freeze'; memberId: string; start: IsoDate; days: number; reason: string; note: string | null }
  | { type: 'convertWalkIn'; signInId: string; plan: string; months: number; mode: PaymentMode }
  | { type: 'logPtSession'; memberId: string; duration: string; notes: string | null }
  | { type: 'undoCheckIn'; signInId: string }
  | { type: 'logAudit'; action: string; target: string; detail: string }
  | { type: 'schedulePrice'; price: string; effective: IsoDate; note: string | null }
  | { type: 'setOnline'; online: boolean }
  | { type: 'setDraftCount'; count: DrawerCount }
  | { type: 'lockCount'; role: 'outgoing' | 'incoming' }
  | { type: 'reset' };

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
    case 'enroll': {
      const name = action.name.trim();
      if (!name) return state;
      // Enrollment takes payment, so it is prohibited offline (spec section 5).
      if (!state.online) return state;
      if (!Number.isInteger(action.months) || action.months < 1) return state;
      const start = addDays(state.today, 1);
      const end = periodEnd(start, action.months);
      const code = nextMemberCode(state);
      const member: Member = {
        id: nextId('m'),
        code,
        name,
        nickname: action.nickname?.trim() || null,
        initials: initials(name),
        plan: action.plan,
        coverageEnd: end,
        graceDays: 3,
        frozen: false,
        lastVisit: 'Not yet',
        pt: null,
      };
      return {
        ...state,
        members: [...state.members, member],
        audit: audit(state, 'Member enrolled', name, `${action.plan}, ${start} to ${end}, ${action.mode}, ${code}`),
      };
    }
    case 'freeze': {
      const member = state.members.find((m) => m.id === action.memberId);
      if (!member || member.coverageEnd === null || member.frozen) return state;
      if (!state.online) return state;
      if (!Number.isInteger(action.days) || action.days < 1 || !action.reason.trim()) return state;
      const end = extendForFreeze(member.coverageEnd, action.days);
      const detail = `${action.start}, ${action.days} days, ${action.reason}${action.note?.trim() ? `: ${action.note.trim()}` : ''}`;
      return {
        ...state,
        members: state.members.map((m) => (m.id === member.id ? { ...m, coverageEnd: end, frozen: true } : m)),
        audit: audit(state, 'Freeze request submitted', member.name, detail),
      };
    }
    case 'convertWalkIn': {
      if (!state.online) return state;
      const walkIn = state.signIns.find((s) => s.id === action.signInId && s.kind === 'walkin');
      if (!walkIn) return state;
      if (!Number.isInteger(action.months) || action.months < 1) return state;
      const start = addDays(state.today, 1);
      const end = periodEnd(start, action.months);
      const code = nextMemberCode(state);
      const member: Member = {
        id: nextId('m'),
        code,
        name: walkIn.name,
        nickname: null,
        initials: initials(walkIn.name),
        plan: action.plan,
        coverageEnd: end,
        graceDays: 3,
        frozen: false,
        lastVisit: 'Not yet',
        pt: null,
      };
      return {
        ...state,
        members: [...state.members, member],
        audit: audit(state, 'Walk-in converted', walkIn.name, `${action.plan}, ${start} to ${end}, credit applied, ${action.mode}, ${code}`),
      };
    }
    case 'logPtSession': {
      const member = state.members.find((m) => m.id === action.memberId);
      if (!member?.pt || member.pt.left <= 0) return state;
      if (!action.duration.trim()) return state;
      const left = member.pt.left - 1;
      const notes = action.notes?.trim();
      return {
        ...state,
        members: state.members.map((m) => (m.id === member.id && m.pt ? { ...m, pt: { ...m.pt, left } } : m)),
        audit: audit(state, 'PT session logged', member.name, `${action.duration}, ${left} of ${member.pt.total} left${notes ? `, ${notes}` : ''}`),
        outbox: queued(state),
      };
    }
    case 'undoCheckIn': {
      const entry = state.signIns.find((s) => s.id === action.signInId && s.kind === 'member');
      if (!entry) return state;
      return {
        ...state,
        signIns: state.signIns.filter((s) => s.id !== entry.id),
        audit: audit(state, 'Check-in undone', entry.name, entry.time),
        outbox: queued(state),
      };
    }
    case 'logAudit':
      return { ...state, audit: audit(state, action.action, action.target, action.detail) };
    case 'schedulePrice': {
      if (!state.online) return state;
      if (!action.price.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(action.effective)) return state;
      const version: PriceVersion = {
        id: nextId('p'),
        price: action.price.trim(),
        effective: action.effective,
        note: action.note?.trim() || null,
      };
      return {
        ...state,
        priceVersions: [version, ...state.priceVersions],
        audit: audit(state, 'Price version scheduled', 'Monthly', `${version.price} effective ${version.effective}${version.note ? `, ${version.note}` : ''}`),
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
    case 'reset':
      return initialState();
  }
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

// The next member code after the highest one already in the store (INF-00483 and up).
export function nextMemberCode(state: DemoState): string {
  const highest = state.members.reduce((max, m) => {
    const digits = Number(m.code.replace(/\D/g, ''));
    return Number.isFinite(digits) ? Math.max(max, digits) : max;
  }, 0);
  return `INF-${String(highest + 1).padStart(5, '0')}`;
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
