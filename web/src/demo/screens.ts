// Route table for the demo launcher. Paths are the product routes.

export const SCREENS: { app: string; items: { label: string; path: string }[] }[] = [
  {
    app: 'Member app',
    items: [
      { label: 'Sign in', path: '/login' },
      { label: 'Activate account', path: '/activate' },
      { label: 'Set password', path: '/activate/password' },
      { label: 'Today', path: '/m/today' },
      { label: 'Wallet pass', path: '/m/pass' },
      { label: 'Workout log', path: '/m/workout' },
      { label: 'Share workout', path: '/m/share' },
      { label: 'Attendance', path: '/m/attendance' },
      { label: 'Workout history', path: '/m/history' },
      { label: 'Notices', path: '/m/notices' },
      { label: 'Receipt', path: '/m/receipt' },
      { label: 'How busy', path: '/m/busy' },
      { label: 'Profile', path: '/m/profile' },
    ],
  },
  {
    app: 'Front desk',
    items: [
      { label: 'Staff PIN sign in', path: '/staff/pin' },
      { label: 'Check-in (phone below 1024px, station above)', path: '/desk/checkin' },
      { label: 'Walk-in', path: '/desk/walkin' },
      { label: 'Scan', path: '/desk/scan' },
      { label: 'Expiry board', path: '/desk/expiry' },
      { label: 'Shift handover (phone below 1024px, station above)', path: '/desk/shift' },
      { label: 'Enroll member', path: '/desk/enroll' },
      { label: 'Activation slip', path: '/desk/enroll/activation' },
      { label: 'Freeze request', path: '/desk/freeze' },
      { label: 'Walk-in conversion', path: '/desk/convert' },
    ],
  },
  {
    app: 'Coach app',
    items: [
      { label: 'Clients', path: '/coach/clients' },
      { label: 'Schedule', path: '/coach/schedule' },
      { label: 'Log PT session', path: '/coach/log' },
      { label: 'Plan builder', path: '/coach/plan' },
    ],
  },
  {
    app: 'Owner (admin)',
    items: [
      { label: 'Dashboard', path: '/owner' },
      { label: 'Plans and prices', path: '/owner/plans' },
      { label: 'Approvals', path: '/owner/approvals' },
      { label: 'Staff and devices', path: '/owner/staff' },
      { label: 'Audit log', path: '/owner/audit' },
    ],
  },
];
