// Canvas artboard Member-Busy. Today's bars come from the demo hourly counts; the grey bars are the typical Saturday.

import { Link } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { SEED_HOURLY } from '../../demo/seed';
import { MemberTabBar } from './MemberTabBar';

// Typical Saturday entries per hour, 6 AM to 10 PM.
const TYPICAL = [5, 6, 4, 3, 3, 3, 3, 2, 2, 3, 5, 7, 7, 6, 4, 2, 1];
// Axis labels sit under every third hour.
const LABELS: Record<number, string> = { 0: '6A', 3: '9A', 6: '12P', 9: '3P', 12: '6P', 15: '9P' };
const UNIT = 12;

const HOURS = [
  { days: 'Monday to Saturday', time: '6:00 AM to 10:00 PM' },
  { days: 'Sunday', time: '8:00 AM to 6:00 PM' },
];

export default function Busy() {
  const now = SEED_HOURLY.length - 1;

  return (
    <PhoneScreen padding="52px 16px 0" bottomInset={120} bars={<MemberTabBar active="today" />}>
      <header style={css('display: flex; align-items: center; gap: 12px')}>
        <Link to="/m/today" aria-label="Back to Today" style={css('width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </Link>
        <div style={css('display: flex; flex-direction: column; gap: 2px')}>
          <h1 style={css('margin: 0; font-size: 22px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em')}>How busy is the gym</h1>
          <span style={css('font-size: 12px; color: #8E8E93')}>Saturday, Oct 17, 6:42 PM</span>
        </div>
      </header>

      <section aria-label="In the gym now" style={css('margin-top: 14px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; align-items: center; gap: 16px')}>
        <div style={css('display: flex; flex-direction: column; gap: 6px; flex-grow: 1')}>
          <span style={css('font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>In the gym now</span>
          <span style={css('font-size: 56px; line-height: 1; font-weight: 800; font-stretch: 120%; font-variant-numeric: tabular-nums')}>18</span>
          <span style={css('font-size: 12px; line-height: 1.4; color: #8E8E93')}>Counted from check-ins in the last 90 minutes.</span>
        </div>
        <span style={css('width: 48px; height: 48px; flex-shrink: 0; box-sizing: border-box; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #8E8E93; display: flex; align-items: center; justify-content: center')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </span>
      </section>

      <section aria-label="Check-ins by hour today" style={css('margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px 36px')}>
        <div style={css('display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 12px')}>
          <span style={css('font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Today by hour</span>
          <span style={css('font-size: 12px; color: #8E8E93')}>6 AM to 10 PM</span>
        </div>
        <div role="img" aria-label={`Check-ins per hour from 6 AM to 6 PM: ${SEED_HOURLY.join(', ')}. 6 PM is the busiest hour so far. Later hours have no data yet. Grey bars behind show the typical Saturday.`} style={css('display: grid; grid-template-columns: repeat(17, minmax(0, 1fr)); align-items: end; gap: 2px')}>
          {TYPICAL.map((typical, i) => {
            const count = i <= now ? SEED_HOURLY[i] : null;
            return (
              <span key={i} style={css('position: relative; height: 96px')}>
                <span style={css(`position: absolute; left: 1px; right: 1px; bottom: 0; height: ${typical * UNIT}px; background: #3F3F46; border-radius: 2px`)}></span>
                {count === null ? (
                  <span style={css('position: absolute; left: 50%; margin-left: -3px; width: 6px; bottom: 0; height: 2px; background: #3F3F46; border-radius: 1px')}></span>
                ) : (
                  <span style={css(`position: absolute; left: 50%; margin-left: -3px; width: 6px; bottom: 0; height: ${count * UNIT}px; background: ${i === now ? '#FFFFFF' : '#71717A'}; border-radius: 1px`)}></span>
                )}
                {LABELS[i] && (
                  <span style={css('position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #8E8E93; white-space: nowrap')}>{LABELS[i]}</span>
                )}
              </span>
            );
          })}
        </div>
        <div style={css('display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 30px')}>
          <span style={css('display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93')}><span style={css('width: 10px; height: 3px; background: #71717A')}></span>Earlier hours</span>
          <span style={css('display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93')}><span style={css('width: 10px; height: 3px; background: #FFFFFF')}></span>Now</span>
          <span style={css('display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93')}><span style={css('width: 10px; height: 10px; border-radius: 2px; background: #3F3F46')}></span>Usually on Saturdays</span>
        </div>
      </section>

      <section aria-label="Best times to come" style={css('margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: flex; align-items: center; gap: 12px')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <div style={css('display: flex; flex-direction: column; gap: 3px')}>
          <span style={css('font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Best time to come</span>
          <span style={css('font-size: 17px; font-weight: 800; font-stretch: 108%')}>1 PM to 3 PM</span>
          <span style={css('font-size: 12px; color: #8E8E93')}>Usually the quietest. Busiest around 5 PM to 7 PM.</span>
        </div>
      </section>

      <h2 style={css('margin: 18px 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Gym hours</h2>
      <ul style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px')}>
        {HOURS.map((h, i) => (
          <li key={h.days} style={i === 0 ? css('display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px') : css('display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; border-top: 1px solid rgba(255,255,255,0.06)')}>
            <span style={css('font-size: 14px; color: #A1A1AA')}>{h.days}</span>
            <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 13px")}>{h.time}</span>
          </li>
        ))}
      </ul>
    </PhoneScreen>
  );
}
