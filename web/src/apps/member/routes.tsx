import type { RouteObject } from 'react-router-dom';
import { Activate } from './Activate';
import { Login } from './Login';
import { Pass } from './Pass';
import { SetPassword } from './SetPassword';
import { Share } from './Share';
import { Today } from './Today';
import { Workout } from './Workout';

// Routes for the member screens. Each entry points at a ported canvas artboard (see design-map.ts).
export const memberRoutes: RouteObject[] = [
  { path: '/login', element: <Login /> },
  { path: '/activate', element: <Activate /> },
  { path: '/activate/password', element: <SetPassword /> },
  { path: '/m/today', element: <Today /> },
  { path: '/m/pass', element: <Pass /> },
  { path: '/m/workout', element: <Workout /> },
  { path: '/m/share', element: <Share /> },
];
