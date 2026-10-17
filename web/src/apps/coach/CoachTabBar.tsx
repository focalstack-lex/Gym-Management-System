// Coach tab bar, canvas Coach-* artboards: Clients, Schedule, Log (orange key), Plans, Profile.

import { TabBar, icon20Key, icon24 } from '../../components/TabBar';

export type CoachTab = 'clients' | 'schedule' | 'log' | 'plans' | 'profile';

const TABS = [
  {
    key: 'clients',
    label: 'Clients',
    to: '/coach/clients',
    icon: icon24(
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </>,
    ),
  },
  {
    key: 'schedule',
    label: 'Schedule',
    to: '/coach/schedule',
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
    key: 'log',
    label: 'Log',
    to: '/coach/log',
    centerKey: true,
    icon: icon20Key(
      <>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <path d="m9 14 2 2 4-4"></path>
      </>,
    ),
  },
  {
    key: 'plans',
    label: 'Plans',
    to: '/coach/plan',
    icon: icon24(
      <>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <path d="M12 11h4"></path>
        <path d="M12 16h4"></path>
        <path d="M8 11h.01"></path>
        <path d="M8 16h.01"></path>
      </>,
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    to: '#',
    icon: icon24(
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </>,
    ),
  },
];

export function CoachTabBar({ active }: { active: CoachTab | null }) {
  return <TabBar label="Coach navigation" tabs={TABS} active={active} justifyStart={false} />;
}
