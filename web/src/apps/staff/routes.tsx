import type { RouteObject } from 'react-router-dom';
import StaffPin from './StaffPin';

// Routes for the staff screens. Each entry points at a ported canvas artboard (see design-map.ts).
export const staffRoutes: RouteObject[] = [{ path: '/staff/pin', element: <StaffPin /> }];
