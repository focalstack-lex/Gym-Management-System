import type { RouteObject } from 'react-router-dom';
import { Expiry } from './Expiry';
import { Scan } from './Scan';
import { Walkin } from './Walkin';
import { CheckinRoute, ShiftRoute } from './_Station';

// Routes for the desk screens. Each entry points at a ported canvas artboard (see design-map.ts).
export const deskRoutes: RouteObject[] = [
  { path: '/desk/checkin', element: <CheckinRoute /> },
  { path: '/desk/walkin', element: <Walkin /> },
  { path: '/desk/scan', element: <Scan /> },
  { path: '/desk/expiry', element: <Expiry /> },
  { path: '/desk/shift', element: <ShiftRoute /> },
];
