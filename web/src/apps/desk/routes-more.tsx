import type { RouteObject } from 'react-router-dom';
import Activation from './Activation';
import Convert from './Convert';
import Enroll from './Enroll';
import Freeze from './Freeze';

// Routes for the second batch of desk screens (see design-map.ts).
export const deskMoreRoutes: RouteObject[] = [
  { path: '/desk/enroll', element: <Enroll /> },
  { path: '/desk/enroll/activation', element: <Activation /> },
  { path: '/desk/freeze', element: <Freeze /> },
  { path: '/desk/convert', element: <Convert /> },
];
