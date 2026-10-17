import { describe, expect, it } from 'vitest';
import { isoDate } from '../domain/dates';
import { initialState, nextMemberCode, reconciliation, reducer, searchMembers, sheetCounts, statusOf } from './state';

const member = (s: ReturnType<typeof initialState>, id: string) => s.members.find((m) => m.id === id)!;

describe('demo state', () => {
  it('seeds the canvas statuses on Sat Oct 17', () => {
    const s = initialState();
    expect(statusOf(s, member(s, 'mika'))).toBe('active');
    expect(statusOf(s, member(s, 'carlo'))).toBe('expiring_soon');
    expect(statusOf(s, member(s, 'bea'))).toBe('grace');
    expect(statusOf(s, member(s, 'den'))).toBe('grace');
    expect(statusOf(s, member(s, 'paolo'))).toBe('expired');
    expect(statusOf(s, member(s, 'elena'))).toBe('inactive');
    expect(statusOf(s, member(s, 'joy'))).toBe('dormant');
    expect(sheetCounts(s)).toEqual({ checkIns: 47, walkIns: 9 });
  });

  it('checks in an allowed member and refuses a soft-blocked one', () => {
    let s = reducer(initialState(), { type: 'checkIn', memberId: 'mika' });
    expect(sheetCounts(s).checkIns).toBe(48);
    expect(s.signIns[0].name).toBe('Mika Santos');
    s = reducer(s, { type: 'checkIn', memberId: 'paolo' });
    expect(sheetCounts(s).checkIns).toBe(48);
  });

  it('allows entry with a logged reason, requiring a note for Other', () => {
    const s0 = initialState();
    expect(reducer(s0, { type: 'allowEntry', memberId: 'paolo', reason: 'Other', note: ' ' })).toBe(s0);
    const s = reducer(s0, { type: 'allowEntry', memberId: 'paolo', reason: 'Will pay before leaving', note: null });
    expect(s.audit[0]).toMatchObject({ action: 'Entry allowed with reason', target: 'Paolo Reyes', detail: 'Will pay before leaving' });
  });

  it('renews with the spec 4.2 chained and fixed rules', () => {
    let s = reducer(initialState(), { type: 'renew', memberId: 'bea', months: 1, mode: 'cash' });
    expect(member(s, 'bea').coverageEnd).toBe('2026-11-15');
    s = reducer(s, { type: 'renew', memberId: 'paolo', months: 1, mode: 'gcash' });
    expect(member(s, 'paolo').coverageEnd).toBe('2026-11-16');
    expect(statusOf(s, member(s, 'paolo'))).toBe('active');
  });

  it('validates walk-ins: name required, digits-only reference for e-wallets', () => {
    const s0 = initialState();
    expect(reducer(s0, { type: 'recordWalkIn', name: '', mode: 'cash', reference: null })).toBe(s0);
    expect(reducer(s0, { type: 'recordWalkIn', name: 'Kim', mode: 'gcash', reference: 'abc' })).toBe(s0);
    const s = reducer(s0, { type: 'recordWalkIn', name: 'Kim Robles', mode: 'gcash', reference: '7023118440299' });
    expect(sheetCounts(s).walkIns).toBe(10);
    expect(s.signIns[0].payment).toEqual({ mode: 'gcash', reference: '0299' });
  });

  it('queues writes in the outbox while offline and clears it on reconnect', () => {
    let s = reducer(initialState(), { type: 'setOnline', online: false });
    s = reducer(s, { type: 'checkIn', memberId: 'mika' });
    s = reducer(s, { type: 'recordWalkIn', name: 'Kim Robles', mode: 'cash', reference: null });
    expect(s.outbox).toBe(2);
    expect(reducer(s, { type: 'setOnline', online: true }).outbox).toBe(0);
  });

  it('keeps the drawer total hidden until both counts are locked, and locks are immutable', () => {
    let s = reducer(initialState(), { type: 'lockCount', role: 'outgoing' });
    expect(reconciliation(s)).toBeNull();
    const locked = s.drawer.outgoing;
    s = reducer(s, { type: 'setDraftCount', count: { bills: { 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0 }, coinsPesos: 0 } });
    s = reducer(s, { type: 'lockCount', role: 'outgoing' });
    expect(s.drawer.outgoing).toBe(locked);
    s = reducer(s, { type: 'lockCount', role: 'incoming' });
    expect(reconciliation(s)).toEqual({ outgoing: 544500, incoming: 0 });
  });

  it('searches by name, nickname or member code', () => {
    const s = initialState();
    expect(searchMembers(s, 'mika').map((m) => m.id)).toEqual(['mika']);
    expect(searchMembers(s, 'INF-00217').map((m) => m.id)).toEqual(['paolo']);
    expect(searchMembers(s, '  ')).toEqual([]);
  });

  it('enrolls a member with a generated code and next-day coverage', () => {
    const s0 = initialState();
    const s = reducer(s0, { type: 'enroll', name: 'Jessa Lim', nickname: 'Jessa', plan: 'Monthly', months: 1, mode: 'cash' });
    expect(s.members).toHaveLength(s0.members.length + 1);
    const added = s.members[s.members.length - 1];
    expect(added).toMatchObject({ name: 'Jessa Lim', nickname: 'Jessa', code: 'INF-00483', coverageEnd: '2026-11-17', frozen: false });
    expect(s.audit[0]).toMatchObject({ action: 'Member enrolled', target: 'Jessa Lim' });
    expect(nextMemberCode(s)).toBe('INF-00484');
  });

  it('refuses enrollment while offline because it takes payment', () => {
    const s = reducer(initialState(), { type: 'setOnline', online: false });
    expect(reducer(s, { type: 'enroll', name: 'Jessa Lim', nickname: null, plan: 'Monthly', months: 1, mode: 'cash' })).toBe(s);
  });

  it('freezes a membership, extends coverage, and refuses a second freeze', () => {
    const s0 = initialState();
    const s = reducer(s0, { type: 'freeze', memberId: 'mika', start: isoDate('2026-10-17'), days: 14, reason: 'Travel', note: null });
    expect(member(s, 'mika').coverageEnd).toBe('2026-11-28');
    expect(member(s, 'mika').frozen).toBe(true);
    expect(statusOf(s, member(s, 'mika'))).toBe('frozen');
    expect(s.audit[0]).toMatchObject({ action: 'Freeze request submitted', target: 'Mika Santos' });
    expect(reducer(s, { type: 'freeze', memberId: 'mika', start: isoDate('2026-10-17'), days: 7, reason: 'Travel', note: null })).toBe(s);
  });

  it('converts a walk-in into a member and keeps the walk-in record', () => {
    const s = reducer(initialState(), { type: 'convertWalkIn', signInId: 's3', plan: 'Monthly', months: 1, mode: 'gcash' });
    expect(s.members.some((m) => m.name === 'Jessa Lim')).toBe(true);
    expect(s.signIns.some((x) => x.id === 's3')).toBe(true);
    expect(sheetCounts(s).walkIns).toBe(9);
    expect(s.audit[0]).toMatchObject({ action: 'Walk-in converted', target: 'Jessa Lim' });
  });

  it('logs a PT session down to zero and then refuses', () => {
    let s = reducer(initialState(), { type: 'logPtSession', memberId: 'mika', duration: '60 min', notes: 'Good form' });
    expect(member(s, 'mika').pt?.left).toBe(6);
    expect(s.audit[0]).toMatchObject({ action: 'PT session logged', target: 'Mika Santos' });
    while ((member(s, 'mika').pt?.left ?? 0) > 0) {
      s = reducer(s, { type: 'logPtSession', memberId: 'mika', duration: '60 min', notes: null });
    }
    expect(member(s, 'mika').pt?.left).toBe(0);
    expect(reducer(s, { type: 'logPtSession', memberId: 'mika', duration: '60 min', notes: null })).toBe(s);
  });

  it('undoes a check-in and writes the audit entry', () => {
    let s = reducer(initialState(), { type: 'checkIn', memberId: 'mika' });
    const id = s.signIns[0].id;
    s = reducer(s, { type: 'undoCheckIn', signInId: id });
    expect(s.signIns.some((x) => x.id === id)).toBe(false);
    expect(s.audit[0]).toMatchObject({ action: 'Check-in undone', target: 'Mika Santos' });
  });

  it('logs arbitrary audit entries and schedules price versions', () => {
    let s = reducer(initialState(), { type: 'logAudit', action: 'Staff device revoked', target: 'Front desk tablet', detail: 'Owner action' });
    expect(s.audit[0]).toMatchObject({ action: 'Staff device revoked', target: 'Front desk tablet' });
    s = reducer(s, { type: 'schedulePrice', price: '1,500', effective: isoDate('2026-11-01'), note: 'Annual review' });
    expect(s.priceVersions[0]).toMatchObject({ price: '1,500', effective: '2026-11-01', note: 'Annual review' });
    expect(s.audit[0].action).toBe('Price version scheduled');
  });

  it('resets state back to pristine initialState', () => {
    let s = reducer(initialState(), { type: 'checkIn', memberId: 'mika' });
    expect(sheetCounts(s).checkIns).toBe(48);
    s = reducer(s, { type: 'reset' });
    expect(sheetCounts(s).checkIns).toBe(47);
  });
});
