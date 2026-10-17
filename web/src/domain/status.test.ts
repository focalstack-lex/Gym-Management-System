import { describe, expect, it } from 'vitest';
import { addDays, isoDate } from './dates';
import type { MembershipStatus } from './status';
import { doorDecision, membershipStatus } from './status';

const today = isoDate('2026-10-17');
const status = (endOffsetDays: number | null, frozen = false) =>
  membershipStatus({
    today,
    coverageEnd: endOffsetDays === null ? null : addDays(today, endOffsetDays),
    graceDays: 3,
    frozen,
  });

describe('membershipStatus', () => {
  it('reports no plan and frozen before any date logic', () => {
    expect(status(null)).toBe('no_plan');
    expect(status(28, true)).toBe('frozen');
    expect(status(-200, true)).toBe('frozen');
  });

  it('splits active and expiring soon at 8 days remaining', () => {
    expect(status(28)).toBe('active');
    expect(status(8)).toBe('active');
    expect(status(7)).toBe('expiring_soon');
    expect(status(0)).toBe('expiring_soon');
  });

  it('keeps the grace window at 1 to 3 days past the end', () => {
    expect(status(-1)).toBe('grace');
    expect(status(-3)).toBe('grace');
    expect(status(-4)).toBe('expired');
  });

  it('measures expired, inactive and dormant from the end of grace', () => {
    expect(status(-(3 + 29))).toBe('expired');
    expect(status(-(3 + 30))).toBe('inactive');
    expect(status(-(3 + 89))).toBe('inactive');
    expect(status(-(3 + 90))).toBe('dormant');
  });

  it('matches the canvas members on Oct 17', () => {
    const at = (end: string) => membershipStatus({ today, coverageEnd: isoDate(end), graceDays: 3, frozen: false });
    expect(at('2026-11-14')).toBe('active');   // Mika, 28 days left
    expect(at('2026-10-15')).toBe('grace');    // Bea, grace until Oct 18
    expect(at('2026-10-01')).toBe('expired');  // Paolo, 16 days past end
  });
});

describe('doorDecision', () => {
  it('allows entry for active, expiring soon and grace', () => {
    const allowed: MembershipStatus[] = ['active', 'expiring_soon', 'grace'];
    for (const s of allowed) expect(doorDecision(s)).toBe('allow');
  });

  it('soft-blocks every other status', () => {
    const blocked: MembershipStatus[] = ['expired', 'inactive', 'dormant', 'no_plan', 'frozen'];
    for (const s of blocked) expect(doorDecision(s)).toBe('soft_block');
  });
});
