import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom';
import { DemoProvider } from './demo/store';
import { coachRoutes } from './apps/coach/routes';
import { deskRoutes } from './apps/desk/routes';
import { deskMoreRoutes } from './apps/desk/routes-more';
import { memberRoutes } from './apps/member/routes';
import { memberMoreRoutes } from './apps/member/routes-more';
import { ownerRoutes } from './apps/owner/routes';
import { staffRoutes } from './apps/staff/routes';
import { DemoIndex } from './demo/DemoIndex';

function AppRoutes() {
  return useRoutes([
    { path: '/', element: <Navigate to="/demo" replace /> },
    { path: '/demo', element: <DemoIndex /> },
    ...memberRoutes,
    ...memberMoreRoutes,
    ...deskRoutes,
    ...deskMoreRoutes,
    ...staffRoutes,
    ...coachRoutes,
    ...ownerRoutes,
    { path: '*', element: <Navigate to="/demo" replace /> },
  ]);
}

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DemoProvider>
  );
}
