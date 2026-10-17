// Visible copy rendered from computed data instead of literals, per artboard, merged from each app.

import { coachParityAllow } from './apps/coach/parity-allow';
import { deskParityAllow } from './apps/desk/parity-allow';
import { memberParityAllow } from './apps/member/parity-allow';
import { ownerParityAllow } from './apps/owner/parity-allow';
import { staffParityAllow } from './apps/staff/parity-allow';

export const PARITY_ALLOW: Record<string, string[]> = {
  ...memberParityAllow,
  ...deskParityAllow,
  ...staffParityAllow,
  ...coachParityAllow,
  ...ownerParityAllow,
};
