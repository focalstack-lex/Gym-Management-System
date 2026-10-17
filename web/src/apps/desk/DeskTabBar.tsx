// Desk tab bar, canvas Desk-Mobile-* artboards: Check-in, Walk-in, Scan (orange key), Expiry, Shift.

import { TabBar, icon20Key, icon24 } from '../../components/TabBar';

export type DeskTab = 'checkin' | 'walkin' | 'scan' | 'expiry' | 'shift';

const TABS = [
  {
    key: 'checkin',
    label: 'Check-in',
    to: '/desk/checkin',
    icon: icon24(
      <>
        <path d="m16 11 2 2 4-4"></path>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
      </>,
    ),
  },
  {
    key: 'walkin',
    label: 'Walk-in',
    to: '/desk/walkin',
    icon: icon24(
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <line x1="19" x2="19" y1="8" y2="14"></line>
        <line x1="22" x2="16" y1="11" y2="11"></line>
      </>,
    ),
  },
  {
    key: 'scan',
    label: 'Scan',
    to: '/desk/scan',
    centerKey: true,
    icon: icon20Key(
      <>
        <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
        <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
        <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
        <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
        <path d="M7 12h10"></path>
      </>,
    ),
  },
  {
    key: 'expiry',
    label: 'Expiry',
    to: '/desk/expiry',
    icon: icon24(
      <>
        <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path>
        <path d="M16 2v4"></path>
        <path d="M8 2v4"></path>
        <path d="M3 10h5"></path>
        <path d="M17.5 17.5 16 16.3V14"></path>
        <circle cx="16" cy="16" r="6"></circle>
      </>,
    ),
  },
  {
    key: 'shift',
    label: 'Shift',
    to: '/desk/shift',
    icon: icon24(
      <>
        <path d="m16 3 4 4-4 4"></path>
        <path d="M20 7H4"></path>
        <path d="m8 21-4-4 4-4"></path>
        <path d="M4 17h16"></path>
      </>,
    ),
  },
];

export function DeskTabBar({ active }: { active: DeskTab | null }) {
  return <TabBar label="Desk navigation" tabs={TABS} active={active} justifyStart={false} />;
}
