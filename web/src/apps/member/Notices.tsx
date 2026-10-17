// Canvas artboard Member-Notices. Mark all read clears the unread state.

import type { ReactNode } from 'react';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { MemberTabBar } from './MemberTabBar';

interface Notice {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  to: string | null;
  icon: ReactNode;
}

const icon16 = (children: ReactNode) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
    {children}
  </svg>
);

const SECTIONS: { heading: string; items: Notice[] }[] = [
  {
    heading: 'Today',
    items: [
      {
        id: 'typhoon',
        title: 'Closed Oct 21, Typhoon signal',
        body: 'All memberships extended by 1 day automatically',
        time: '4:30 PM',
        unread: true,
        to: null,
        icon: icon16(
          <>
            <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
            <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
            <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
          </>,
        ),
      },
    ],
  },
  {
    heading: 'This week',
    items: [
      {
        id: 'pt',
        title: 'PT session logged',
        body: 'Coach Ramon, Back + Biceps, 7 of 12 left',
        time: 'Wed 8:05 PM',
        unread: false,
        to: null,
        icon: icon16(
          <>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
            <path d="m9 14 2 2 4-4"></path>
          </>,
        ),
      },
      {
        id: 'receipt',
        title: 'Receipt available',
        body: 'Monthly membership, AR-2026-1015-0482',
        time: 'Tue 4:12 PM',
        unread: true,
        to: '/m/receipt',
        icon: icon16(
          <>
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
            <path d="M12 17.5v-11"></path>
          </>,
        ),
      },
      {
        id: 'holiday',
        title: 'Holiday hours',
        body: 'Nov 1 open 8 AM to 4 PM, Nov 2 closed',
        time: 'Mon 9:00 AM',
        unread: false,
        to: null,
        icon: icon16(
          <>
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <path d="M3 10h18"></path>
          </>,
        ),
      },
    ],
  },
  {
    heading: 'Earlier',
    items: [
      {
        id: 'ends',
        title: 'Membership ends Oct 14',
        body: 'Renew at the front desk to keep your streak',
        time: 'Oct 11',
        unread: false,
        to: null,
        icon: icon16(
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </>,
        ),
      },
    ],
  },
];

export default function Notices() {
  const [read, setRead] = useState<Set<string>>(new Set());
  const markAllRead = () => setRead(new Set(SECTIONS.flatMap((s) => s.items.map((n) => n.id))));

  return (
    <PhoneScreen padding="52px 16px 0" bottomInset={120} bars={<MemberTabBar active="today" />}>
      <header style={css('display: flex; align-items: center; gap: 12px')}>
        <Link to="/m/today" aria-label="Back to Today" style={css('width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </Link>
        <h1 style={css('margin: 0; flex-grow: 1; font-size: 22px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em')}>Notices</h1>
        <button type="button" onClick={markAllRead} style={css('height: 44px; padding: 0 8px; border: 0; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer')}>Mark all read</button>
      </header>

      {SECTIONS.map((section) => (
        <Fragment key={section.heading}>
          <h2 style={css('margin: 18px 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>{section.heading}</h2>
          <ul style={css('list-style: none; margin: 0; padding: 0 16px 0 14px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden')}>
            {section.items.map((n) => {
              const unread = n.unread && !read.has(n.id);
              const label = `${n.title}, ${unread ? 'Unread' : 'Read'}, ${n.time}`;
              const row = css('display: flex; align-items: center; gap: 12px; min-height: 64px; padding: 8px 0; color: #FFFFFF; text-decoration: none');
              const content = (
                <>
                  <span style={css('width: 6px; flex-shrink: 0')}>
                    <span style={unread ? css('width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF; display: block') : css('width: 6px; height: 6px; display: block')}></span>
                  </span>
                  <span style={unread
                    ? css('width: 32px; height: 32px; flex-shrink: 0; box-sizing: border-box; border-radius: 10px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center')
                    : css('width: 32px; height: 32px; flex-shrink: 0; box-sizing: border-box; border-radius: 10px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #71717A; display: flex; align-items: center; justify-content: center')}>{n.icon}</span>
                  <span style={css('display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0')}>
                    <span style={unread
                      ? css('font-size: 15px; font-weight: 700; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis')
                      : css('font-size: 15px; font-weight: 600; color: #A1A1AA; white-space: nowrap; overflow: hidden; text-overflow: ellipsis')}>{n.title}</span>
                    <span style={css('font-size: 12px; color: #8E8E93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis')}>{n.body}</span>
                  </span>
                  <span style={css("flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8E93")}>{n.time}</span>
                </>
              );
              return (
                <li key={n.id} style={css('border-top: 1px solid rgba(255,255,255,0.06)')}>
                  {n.to ? (
                    <Link to={n.to} aria-label={label} style={row}>{content}</Link>
                  ) : (
                    <a href="#" aria-label={label} onClick={(e) => e.preventDefault()} style={row}>{content}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </Fragment>
      ))}
    </PhoneScreen>
  );
}
