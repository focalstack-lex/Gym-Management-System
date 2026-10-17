// Every canvas artboard (design/canvas/*.dc.html) and the source files that implement it.
// design-parity.test.ts requires every inline style string and every SVG path in the
// artboard to appear verbatim in these files. Paths are relative to web/src.

export const DESIGN_MAP: Record<string, string[]> = {
  // Member app
  'Member-Login.dc.html': ['apps/member/Login.tsx'],
  'Member-Activate.dc.html': ['apps/member/Activate.tsx'],
  'Member-Set-Password.dc.html': ['apps/member/SetPassword.tsx'],
  'Member-Home.dc.html': ['apps/member/Today.tsx', 'apps/member/MemberTabBar.tsx'],
  'Member-Pass.dc.html': ['apps/member/Pass.tsx', 'apps/member/MemberTabBar.tsx'],
  'Member-Workout.dc.html': ['apps/member/Workout.tsx'],
  'Member-Share.dc.html': ['apps/member/Share.tsx'],
  'Member-Share-Minimal.dc.html': ['apps/member/Share.tsx'],
  'Member-Share-Streak.dc.html': ['apps/member/Share.tsx'],
  'Member-Share-Lifts.dc.html': ['apps/member/Share.tsx'],
  'Member-Share-PR.dc.html': ['apps/member/Share.tsx'],
  'Member-Share-Month.dc.html': ['apps/member/Share.tsx'],
  'Member-Share-Clean.dc.html': ['apps/member/Share.tsx'],
  'Member-Attendance.dc.html': ['apps/member/Attendance.tsx', 'apps/member/MemberTabBar.tsx'],
  'Member-History.dc.html': ['apps/member/History.tsx', 'apps/member/MemberTabBar.tsx'],
  'Member-Notices.dc.html': ['apps/member/Notices.tsx', 'apps/member/MemberTabBar.tsx'],
  'Member-Receipt.dc.html': ['apps/member/Receipt.tsx'],
  'Member-Busy.dc.html': ['apps/member/Busy.tsx', 'apps/member/MemberTabBar.tsx'],
  'Member-Profile.dc.html': ['apps/member/Profile.tsx', 'apps/member/MemberTabBar.tsx'],

  // Front desk (phone and desk station) and staff sign-in
  'Desk-Mobile-Checkin.dc.html': ['apps/desk/Checkin.tsx', 'apps/desk/DeskTabBar.tsx', 'apps/desk/DeskHeader.tsx'],
  'Desk-Checkin.dc.html': ['apps/desk/CheckinDesktop.tsx'],
  'Desk-Mobile-Walkin.dc.html': ['apps/desk/Walkin.tsx', 'apps/desk/DeskTabBar.tsx'],
  'Desk-Mobile-Scan.dc.html': ['apps/desk/Scan.tsx', 'apps/desk/DeskTabBar.tsx'],
  'Desk-Mobile-Expiry.dc.html': ['apps/desk/Expiry.tsx', 'apps/desk/DeskTabBar.tsx', 'apps/desk/DeskHeader.tsx'],
  'Desk-Mobile-Shift.dc.html': ['apps/desk/Shift.tsx'],
  'Desk-Shift.dc.html': ['apps/desk/ShiftDesktop.tsx'],
  'Desk-Mobile-Enroll.dc.html': ['apps/desk/Enroll.tsx'],
  'Desk-Mobile-Activation.dc.html': ['apps/desk/Activation.tsx'],
  'Desk-Mobile-Freeze.dc.html': ['apps/desk/Freeze.tsx'],
  'Desk-Mobile-Convert.dc.html': ['apps/desk/Convert.tsx'],
  'Staff-PIN.dc.html': ['apps/staff/StaffPin.tsx'],

  // Coach app
  'Coach-Clients.dc.html': ['apps/coach/Clients.tsx', 'apps/coach/CoachTabBar.tsx'],
  'Coach-Schedule.dc.html': ['apps/coach/Schedule.tsx', 'apps/coach/CoachTabBar.tsx'],
  'Coach-Log.dc.html': ['apps/coach/Log.tsx'],
  'Coach-Plan.dc.html': ['apps/coach/Plan.tsx'],

  // Owner (admin)
  'Owner-Dashboard.dc.html': ['apps/owner/Dashboard.tsx', 'apps/owner/OwnerShell.tsx'],
  'Owner-Plans.dc.html': ['apps/owner/Plans.tsx', 'apps/owner/OwnerShell.tsx'],
  'Owner-Approvals.dc.html': ['apps/owner/Approvals.tsx', 'apps/owner/OwnerShell.tsx'],
  'Owner-Staff.dc.html': ['apps/owner/Staff.tsx', 'apps/owner/OwnerShell.tsx'],
  'Owner-Audit.dc.html': ['apps/owner/Audit.tsx', 'apps/owner/OwnerShell.tsx'],
};

// Main.dc.html is the design-system reference board, not an app screen.
export const NOT_SCREENS = ['Main.dc.html'];
