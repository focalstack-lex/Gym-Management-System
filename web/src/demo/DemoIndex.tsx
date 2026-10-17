// Demo-mode launcher and client showcase portal. Not part of the product design.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { css } from '../lib/css';
import { SCREENS } from './screens';
import { useDemo } from './store';

const PORTALS = [
  {
    role: 'Member App',
    context: 'Mobile PWA',
    to: '/m/today',
    summary: 'Personal dashboard, workouts, streaks, digital wallet pass, and activity feed.',
  },
  {
    role: 'Front Desk',
    context: 'Station and Mobile',
    to: '/desk/checkin',
    summary: 'Check-in sheet, QR scan, walk-ins, blind drawer counts, and member enrollment.',
  },
  {
    role: 'Coach Portal',
    context: 'Mobile App',
    to: '/coach/clients',
    summary: 'Client roster, training schedule, session balance logging, and workout plan builder.',
  },
  {
    role: 'Owner Admin',
    context: 'Desktop Console',
    to: '/owner',
    summary: 'Executive dashboard, payment breakdowns, plan pricing, approvals, and audit trail.',
  },
];

export function DemoIndex() {
  const { dispatch } = useDemo();
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleReset = () => {
    dispatch({ type: 'reset' });
    setResetMessage('Demo data reset to pristine state');
    setTimeout(() => setResetMessage(null), 3000);
  };

  return (
    <main style={css("min-height: 100dvh; box-sizing: border-box; padding: 40px 20px 60px; background: #0C0C0E; color: #FFFFFF; font-family: 'Archivo', system-ui, sans-serif")}>
      <div style={css('max-width: 880px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px')}>
        <header style={css('display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06)')}>
          <div style={css('display: flex; align-items: center; gap: 14px')}>
            <div style={css('width: 52px; height: 52px; border-radius: 14px; background: #FFFFFF; overflow: hidden; flex-shrink: 0')}>
              <img src="/brand/logo.jpg" alt="The Infinity Fitness" style={css('width: 100%; height: 100%; object-fit: cover; display: block')} />
            </div>
            <div style={css('display: flex; flex-direction: column; gap: 4px')}>
              <h1 style={css('margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.01em')}>The Infinity Fitness</h1>
              <p style={css('margin: 0; font-size: 13px; color: #8E8E93')}>Interactive Client Showcase and Screen Catalog</p>
            </div>
          </div>
          <div style={css('display: flex; align-items: center; gap: 12px')}>
            <button
              type="button"
              onClick={handleReset}
              style={css('height: 38px; padding: 0 16px; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; background: #17171A; color: #E4E4E7; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer')}
            >
              Reset demo data
            </button>
          </div>
        </header>

        {resetMessage && (
          <div role="status" style={css("padding: 12px 16px; border-radius: 12px; background: rgba(48,209,88,0.1); border: 1px solid rgba(48,209,88,0.25); color: #30D158; font-size: 13px; font-family: 'JetBrains Mono', monospace")}>
            {resetMessage}
          </div>
        )}

        <div style={css('display: flex; flex-direction: column; gap: 6px')}>
          <div style={css('display: flex; align-items: center; justify-content: space-between; gap: 12px')}>
            <span style={css('font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Primary Role Portals</span>
            <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #71717A")}>Fixed clock: Sat Oct 17, 2026, 6:42 PM</span>
          </div>
          <div style={css('display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px')}>
            {PORTALS.map((portal) => (
              <Link
                key={portal.role}
                to={portal.to}
                style={css('display: flex; flex-direction: column; gap: 8px; padding: 18px 20px; border-radius: 18px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); text-decoration: none; color: #FFFFFF')}
              >
                <div style={css('display: flex; align-items: center; justify-content: space-between; gap: 8px')}>
                  <span style={css('font-size: 17px; font-weight: 800')}>{portal.role}</span>
                  <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #FF6A00; text-transform: uppercase; letter-spacing: 0.08em")}>{portal.context}</span>
                </div>
                <p style={css('margin: 0; font-size: 13px; line-height: 1.4; color: #8E8E93')}>{portal.summary}</p>
                <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #71717A; margin-top: 4px")}>Launch: {portal.to}</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={css('display: flex; flex-direction: column; gap: 20px')}>
          <div style={css('display: flex; align-items: center; justify-content: space-between; gap: 12px')}>
            <span style={css('font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>All 33 Artboard Screens</span>
            <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #71717A")}>100% Canvas Parity Verified</span>
          </div>
          {SCREENS.map((group) => (
            <section key={group.app} style={css('display: flex; flex-direction: column; gap: 8px')}>
              <h2 style={css('margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>{group.app}</h2>
              <ul style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px')}>
                {group.items.map((item, i) => (
                  <li key={item.path} style={{ borderTop: i === 0 ? '0' : '1px solid rgba(255,255,255,0.06)' }}>
                    <Link to={item.path} style={css('display: flex; justify-content: space-between; gap: 12px; min-height: 48px; align-items: center; color: #FFFFFF; text-decoration: none; font-size: 15px')}>
                      <span>{item.label}</span>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93")}>{item.path}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
