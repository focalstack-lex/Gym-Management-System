// Canvas artboard Member-History. The Week / Month / All control switches the selected range.

import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { MemberTabBar } from './MemberTabBar';

const RANGES = ['Week', 'Month', 'All'] as const;

const RECORDS = [
  { name: 'Bench press', weight: '75 kg', reps: ' x 6', trend: [22, 24, 24, 26, 27, 28] },
  { name: 'Incline dumbbell press', weight: '26 kg', reps: ' x 10', trend: [22, 24, 24, 26, 26, 28] },
  { name: 'Lat pulldown', weight: '55 kg', reps: ' x 10', trend: [23, 23, 25, 25, 27, 28] },
];

const SESSIONS = [
  { day: 'Wed, Oct 14', title: 'Back + Biceps', meta: '54 min, 14 sets', volume: '5,120 kg' },
  { day: 'Mon, Oct 12', title: 'Legs', meta: '61 min, 16 sets', volume: '9,240 kg' },
  { day: 'Sat, Oct 10', title: 'Shoulders', meta: '48 min, 12 sets', volume: '3,980 kg' },
  { day: 'Fri, Oct 9', title: 'Chest + Triceps', meta: '57 min, 15 sets', volume: '6,310 kg' },
];

export default function History() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('Month');

  return (
    <PhoneScreen padding="52px 16px 0" bottomInset={120} bars={<MemberTabBar active="workouts" />}>
      <header style={css('display: flex; align-items: center; gap: 12px')}>
        <Link to="/m/workout" aria-label="Back to Workouts" style={css('width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </Link>
        <h1 style={css('margin: 0; font-size: 22px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em')}>History</h1>
      </header>

      <div role="radiogroup" aria-label="History range" style={css('margin-top: 14px; display: flex; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)')}>
        {RANGES.map((r) => {
          const on = r === range;
          return (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setRange(r)}
              style={on
                ? css('flex: 1; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer')
                : css('flex: 1; height: 44px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer')}
            >
              {r}
            </button>
          );
        })}
      </div>

      <h2 style={css('margin: 16px 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Personal records</h2>
      <ul style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px')}>
        {RECORDS.map((rec, i) => (
          <li key={rec.name} style={i === 0 ? css('display: flex; align-items: center; gap: 12px; min-height: 56px') : css('display: flex; align-items: center; gap: 12px; min-height: 56px; border-top: 1px solid rgba(255,255,255,0.06)')}>
            <span style={css('display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0')}>
              <span style={css('font-size: 15px; font-weight: 600')}>{rec.name}</span>
              <span style={css('font-size: 12px; color: #8E8E93; font-variant-numeric: tabular-nums')}>Best set</span>
            </span>
            <span style={css('font-size: 20px; font-weight: 800; font-stretch: 110%; font-variant-numeric: tabular-nums; white-space: nowrap')}>
              {rec.weight}
              <span style={css('font-size: 12px; font-weight: 600; color: #8E8E93')}>{rec.reps}</span>
            </span>
            <span role="img" aria-label="Recent trend, rising" style={css('display: flex; align-items: flex-end; gap: 3px; height: 28px; flex-shrink: 0')}>
              {rec.trend.map((h, k) => (
                <span key={k} style={css(`width: 3px; height: ${h}px; background: ${k === rec.trend.length - 1 ? '#FFFFFF' : '#71717A'}`)}></span>
              ))}
            </span>
          </li>
        ))}
      </ul>

      <h2 style={css('margin: 16px 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Today</h2>
      <ul style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px')}>
        <li>
          <Link to="/m/workout" style={css('display: flex; align-items: center; gap: 12px; min-height: 58px; color: #FFFFFF; text-decoration: none')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span style={css('display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0')}>
              <span style={css('font-size: 15px; font-weight: 700')}>Chest + Triceps</span>
              <span style={css('font-size: 12px; color: #8E8E93; font-variant-numeric: tabular-nums')}>In progress since 6:42 PM, 4 sets so far</span>
            </span>
            <span style={css('font-size: 12px; color: #A1A1AA; white-space: nowrap; font-variant-numeric: tabular-nums; text-align: right')}>In progress</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Link>
        </li>
      </ul>

      {SESSIONS.map((s) => (
        <Fragment key={s.day}>
          <h2 style={css('margin: 16px 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>{s.day}</h2>
          <ul style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px')}>
            <li style={css('display: flex; align-items: center; gap: 12px; min-height: 58px')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span style={css('display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0')}>
                <span style={css('font-size: 15px; font-weight: 700')}>{s.title}</span>
                <span style={css('font-size: 12px; color: #8E8E93; font-variant-numeric: tabular-nums')}>{s.meta}</span>
              </span>
              <span style={css('font-size: 12px; color: #A1A1AA; white-space: nowrap; font-variant-numeric: tabular-nums; text-align: right')}>{s.volume}</span>
            </li>
          </ul>
        </Fragment>
      ))}
    </PhoneScreen>
  );
}
