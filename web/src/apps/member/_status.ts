// Member-facing status wording and the signed-in demo member, shared by the pass and today screens.
// The status itself always comes from statusOf() in demo/state.ts.

import type { Member } from '../../demo/seed';
import type { DemoState } from '../../demo/state';
import type { MembershipStatus } from '../../domain/status';
import type { IsoDate } from '../../domain/dates';
import { parts } from '../../domain/dates';

// The signed-in member on the canvas is Mika Santos.
export const SIGNED_IN_MEMBER_ID = 'mika';

export function signedInMember(state: DemoState): Member {
  const member = state.members.find((m) => m.id === SIGNED_IN_MEMBER_ID);
  if (!member) throw new Error('Demo member ' + SIGNED_IN_MEMBER_ID + ' is missing from the seed');
  return member;
}

export const STATUS_LABEL: Record<MembershipStatus, string> = {
  active: 'Active',
  expiring_soon: 'Expiring soon',
  grace: 'Grace',
  expired: 'Expired',
  frozen: 'Frozen',
  inactive: 'Inactive',
  dormant: 'Dormant',
  no_plan: 'No plan',
};

// Icon color per status tier, spec section 6 Membership Status Component.
export const STATUS_ICON: Record<MembershipStatus, string> = {
  active: '#30D158',
  expiring_soon: '#FF6A00',
  grace: '#FF6A00',
  expired: '#FF453A',
  frozen: '#64D2FF',
  inactive: '#8E8E93',
  dormant: '#48484A',
  no_plan: '#48484A',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "Nov 14"
export function shortDate(date: IsoDate): string {
  const { month, day } = parts(date);
  return MONTHS[month - 1] + ' ' + day;
}
