// Responsive route wrappers: the desk station layout from 1024px up, the phone layout below.

import { Checkin } from './Checkin';
import { CheckinDesktop } from './CheckinDesktop';
import { Shift } from './Shift';
import { ShiftDesktop } from './ShiftDesktop';
import { useStation } from './_hooks';

export function CheckinRoute() {
  return useStation() ? <CheckinDesktop /> : <Checkin />;
}

export function ShiftRoute() {
  return useStation() ? <ShiftDesktop /> : <Shift />;
}
