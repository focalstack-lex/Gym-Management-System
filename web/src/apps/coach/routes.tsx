import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Clients from './Clients';
import Log from './Log';
import Plan from './Plan';
import Schedule from './Schedule';

// Routes for the coach screens. Each entry points at a ported canvas artboard (see design-map.ts).
export const coachRoutes: RouteObject[] = [
  { path: '/coach', element: <Navigate to="/coach/clients" replace /> },
  { path: '/coach/clients', element: <Clients /> },
  { path: '/coach/schedule', element: <Schedule /> },
  { path: '/coach/log', element: <Log /> },
  { path: '/coach/plan', element: <Plan /> },
];
