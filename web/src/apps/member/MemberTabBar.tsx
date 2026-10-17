// Member tab bar, canvas Member-* artboards: Today, Workouts (dumbbell), Pass (orange key), Attendance, Profile.

import { TabBar, icon20Key, icon24 } from '../../components/TabBar';

export type MemberTab = 'today' | 'workouts' | 'pass' | 'attendance' | 'profile';

const TABS = [
  {
    key: 'today',
    label: 'Today',
    to: '/m/today',
    icon: icon24(
      <>
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </>,
    ),
  },
  {
    key: 'workouts',
    label: 'Workouts',
    to: '/m/workout',
    icon: icon24(
      <>
        <path d="M14.4 14.4 9.6 9.6"></path>
        <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"></path>
        <path d="m21.5 21.5-1.4-1.4"></path>
        <path d="M3.9 3.9 2.5 2.5"></path>
        <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"></path>
      </>,
    ),
  },
  {
    key: 'pass',
    label: 'Pass',
    to: '/m/pass',
    centerKey: true,
    icon: icon20Key(
      <>
        <rect width="5" height="5" x="3" y="3" rx="1"></rect>
        <rect width="5" height="5" x="16" y="3" rx="1"></rect>
        <rect width="5" height="5" x="3" y="16" rx="1"></rect>
        <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
        <path d="M21 21v.01"></path>
        <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
        <path d="M3 12h.01"></path>
        <path d="M12 3h.01"></path>
        <path d="M12 16v.01"></path>
        <path d="M16 12h1"></path>
        <path d="M21 12v.01"></path>
        <path d="M12 21v-1"></path>
      </>,
    ),
  },
  {
    key: 'attendance',
    label: 'Attendance',
    to: '/m/attendance',
    icon: icon24(
      <>
        <path d="M8 2v4"></path>
        <path d="M16 2v4"></path>
        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
        <path d="M3 10h18"></path>
      </>,
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    to: '/m/profile',
    icon: icon24(
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </>,
    ),
  },
];

export function MemberTabBar({ active }: { active: MemberTab | null }) {
  return <TabBar label="Member navigation" tabs={TABS} active={active} justifyStart />;
}
