import type { RouteObject } from 'react-router-dom';
import Attendance from './Attendance';
import Busy from './Busy';
import History from './History';
import Notices from './Notices';
import Profile from './Profile';
import Receipt from './Receipt';

// Member screens ported from Member-Attendance, History, Notices, Receipt, Busy and Profile.
export const memberMoreRoutes: RouteObject[] = [
  { path: '/m/attendance', element: <Attendance /> },
  { path: '/m/history', element: <History /> },
  { path: '/m/notices', element: <Notices /> },
  { path: '/m/receipt', element: <Receipt /> },
  { path: '/m/busy', element: <Busy /> },
  { path: '/m/profile', element: <Profile /> },
];
