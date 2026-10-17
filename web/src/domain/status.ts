// Membership status hierarchy, spec section 4.3, and the soft door block, spec 4.4.

import type { IsoDate } from './dates';
import { diffDays } from './dates';

export type MembershipStatus =
  | 'frozen'
  | 'active'
  | 'expiring_soon'
  | 'grace'
  | 'expired'
  | 'inactive'
  | 'dormant'
  | 'no_plan';

export interface StatusInput {
  today: IsoDate;
  coverageEnd: IsoDate | null;
  graceDays: number;
  frozen: boolean;
}

export function membershipStatus(input: StatusInput): MembershipStatus {
  if (input.frozen) return 'frozen';
  if (input.coverageEnd === null) return 'no_plan';

  const remaining = diffDays(input.today, input.coverageEnd);
  if (remaining >= 8) return 'active';
  if (remaining >= 0) return 'expiring_soon';

  const pastEnd = -remaining;
  if (pastEnd <= input.graceDays) return 'grace';

  const pastGrace = pastEnd - input.graceDays;
  if (pastGrace < 30) return 'expired';
  if (pastGrace < 90) return 'inactive';
  return 'dormant';
}

export type DoorDecision = 'allow' | 'soft_block';

// A soft block never locks anyone out: the desk can renew on the spot or
// allow entry with a logged reason (spec 4.4, 8.1.2).
export function doorDecision(status: MembershipStatus): DoorDecision {
  return status === 'active' || status === 'expiring_soon' || status === 'grace' ? 'allow' : 'soft_block';
}
