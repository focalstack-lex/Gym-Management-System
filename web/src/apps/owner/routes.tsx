import type { RouteObject } from 'react-router-dom';
import { Approvals } from './Approvals';
import { Audit } from './Audit';
import { Dashboard } from './Dashboard';
import { Plans } from './Plans';
import { Staff } from './Staff';

// Routes for the owner screens. Each entry points at a ported canvas artboard (see design-map.ts).
export const ownerRoutes: RouteObject[] = [
  { path: '/owner', element: <Dashboard /> },
  { path: '/owner/plans', element: <Plans /> },
  { path: '/owner/approvals', element: <Approvals /> },
  { path: '/owner/staff', element: <Staff /> },
  { path: '/owner/audit', element: <Audit /> },
];
