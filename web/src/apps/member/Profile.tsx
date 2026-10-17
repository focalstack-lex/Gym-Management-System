// Canvas artboard Member-Profile. The membership card links to the pass.

import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { MemberTabBar } from './MemberTabBar';

const MONO = "'JetBrains Mono', monospace";
const SANS = 'inherit';

// Personal data limited to the spec's member record (RA 10173): no birth year, no government IDs.
const DETAILS = [
  { label: 'Mobile', value: '+63 917 *** 4821', font: MONO },
  { label: 'Birthday', value: 'June 12', font: SANS },
  { label: 'Emergency contact', value: 'Ana Santos', font: SANS },
  { label: 'Email', value: 'Add (optional)', font: SANS },
];

const ACTIVITY = [
  { label: 'Payments', value: 'Last paid Oct 15, cash, Monthly', icon: 'M2 6h20v12H2zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4' },
  { label: 'PT sessions', value: '7 of 12 left with Coach Ramon', icon: 'M8 2v4M16 2v4M3 4h18v18H3zM3 10h18' },
  { label: 'Privacy and data', value: 'Photo consent, download, erasure', icon: 'M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10' },
];

const divider = (i: number) => (i === 0 ? '0' : '1px solid rgba(255,255,255,0.06)');

const chevron = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
    <path d="m9 18 6-6-6-6"></path>
  </svg>
);

export default function Profile() {
  const navigate = useNavigate();

  return (
    <PhoneScreen padding="52px 20px 0" bottomInset={120} bars={<MemberTabBar active="profile" />}>
      <header style={css('display: flex; align-items: center; justify-content: space-between; gap: 12px')}>
        <h1 style={css('margin: 0; font-size: 26px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em')}>Profile</h1>
        <button type="button" style={css('height: 44px; padding: 0 16px; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer')}>Edit</button>
      </header>

      <section aria-label="Member identity" style={css('margin-top: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 16px')}>
        <div style={css('display: flex; align-items: center; gap: 14px')}>
          <div style={css('width: 64px; height: 64px; flex-shrink: 0; box-sizing: border-box; border-radius: 18px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; font-stretch: 115%; color: #8E8E93')}>MS</div>
          <div style={css('display: flex; flex-direction: column; gap: 4px; min-width: 0')}>
            <span style={css('font-size: 22px; line-height: 1.05; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em')}>Mika Santos</span>
            <span style={css('font-size: 13px; color: #8E8E93')}>Goes by Mika, member since Mar 2025</span>
            <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A1A1AA")}>INF-00482</span>
          </div>
        </div>
        <div style={css('display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06)')}>
          <div style={css('display: flex; flex-direction: column; gap: 4px')}>
            <span style={css('font-size: 24px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums')}>112</span>
            <span style={css('font-size: 11px; color: #8E8E93')}>total visits</span>
          </div>
          <div style={css('display: flex; flex-direction: column; gap: 4px; padding-left: 14px; border-left: 1px solid rgba(255,255,255,0.06)')}>
            <span style={css('font-size: 24px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums; color: #FF6A00')}>6<span style={css('font-size: 12px; font-weight: 600; color: #8E8E93')}> wk</span></span>
            <span style={css('font-size: 11px; color: #8E8E93')}>current streak</span>
          </div>
          <div style={css('display: flex; flex-direction: column; gap: 4px; padding-left: 14px; border-left: 1px solid rgba(255,255,255,0.06)')}>
            <span style={css('font-size: 24px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums')}>9<span style={css('font-size: 12px; font-weight: 600; color: #8E8E93')}> wk</span></span>
            <span style={css('font-size: 11px; color: #8E8E93')}>best streak</span>
          </div>
        </div>
      </section>

      <Link to="/m/pass" aria-label="Membership: Monthly, active to Nov 14, 28 of 31 days left" style={css('margin-top: 12px; text-decoration: none; color: #FFFFFF; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px')}>
        <div style={css('display: flex; align-items: center; justify-content: space-between; gap: 12px')}>
          <span style={css('display: flex; flex-direction: column; gap: 3px')}>
            <span style={css('font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Membership</span>
            <span style={css('font-size: 17px; font-weight: 700')}>Monthly plan</span>
          </span>
          <span style={css('display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #8E8E93; white-space: nowrap')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span style={css('color: #FFFFFF; font-weight: 700')}>Active</span> to Nov 14
          </span>
        </div>
        <div role="img" aria-label="28 of 31 days left" style={css('height: 2px; background: #3F3F46')}>
          <div style={css('width: 90.3%; height: 100%; background: #FFFFFF')}></div>
        </div>
        <span style={css('font-size: 12px; color: #8E8E93')}>Renewals and freezes are handled at the front desk.</span>
      </Link>

      <h2 style={css('margin: 20px 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Personal details</h2>
      <ul style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px')}>
        {DETAILS.map((r, i) => (
          <li key={r.label} style={css(`border-top: ${divider(i)}`)}>
            <a href="#" onClick={(e) => e.preventDefault()} style={css('display: flex; align-items: center; gap: 12px; min-height: 48px; color: #FFFFFF; text-decoration: none')}>
              <span style={css('flex-grow: 1; font-size: 15px; font-weight: 600')}>{r.label}</span>
              <span style={css(`font-family: ${r.font}; font-size: 13px; color: #8E8E93; white-space: nowrap`)}>{r.value}</span>
              {chevron}
            </a>
          </li>
        ))}
      </ul>

      <h2 style={css('margin: 20px 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Activity and privacy</h2>
      <ul style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px')}>
        {ACTIVITY.map((r, i) => (
          <Fragment key={r.label}>
            <li style={css(`border-top: ${divider(i)}`)}>
              <a href="#" onClick={(e) => e.preventDefault()} style={css('display: flex; align-items: center; gap: 12px; min-height: 56px; color: #FFFFFF; text-decoration: none')}>
                <span style={css('width: 32px; height: 32px; flex-shrink: 0; box-sizing: border-box; border-radius: 10px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #8E8E93; display: flex; align-items: center; justify-content: center')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={r.icon}></path>
                  </svg>
                </span>
                <span style={css('display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0')}>
                  <span style={css('font-size: 15px; font-weight: 600')}>{r.label}</span>
                  <span style={css('font-size: 12px; color: #8E8E93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis')}>{r.value}</span>
                </span>
                {chevron}
              </a>
            </li>
          </Fragment>
        ))}
      </ul>

      <button type="button" onClick={() => navigate('/login')} style={css('margin-top: 12px; width: 100%; height: 48px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #17171A; color: #FF6961; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer')}>Sign out</button>
    </PhoneScreen>
  );
}
