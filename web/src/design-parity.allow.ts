// Visible copy rendered from computed data instead of literals, per artboard, merged from each app.

import { coachParityAllow } from './apps/coach/parity-allow';
import { deskParityAllow } from './apps/desk/parity-allow';
import { deskMoreParityAllow } from './apps/desk/parity-allow-more';
import { memberParityAllow } from './apps/member/parity-allow';
import { memberMoreParityAllow } from './apps/member/parity-allow-more';
import { ownerParityAllow } from './apps/owner/parity-allow';
import { staffParityAllow } from './apps/staff/parity-allow';

export const PARITY_ALLOW: Record<string, string[]> = {
  ...memberParityAllow,
  ...memberMoreParityAllow,
  ...deskParityAllow,
  ...deskMoreParityAllow,
  ...staffParityAllow,
  ...coachParityAllow,
  ...ownerParityAllow,
};
