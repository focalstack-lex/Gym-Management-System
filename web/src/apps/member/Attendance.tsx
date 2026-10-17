// Canvas artboard Member-Attendance. The October 2026 grid is computed from the demo clock;
// the previous-month control shows September, and the next control returns to October.

import { useState } from 'react';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { useDemo } from '../../demo/store';
import { isoDate, parts } from '../../domain/dates';
import { monthGrid, monthName } from './_calendar';
import { MemberTabBar } from './MemberTabBar';

const VISITED = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 14, 17];
const VISITED_SEP = [1, 2, 3, 5, 7, 8, 9, 10, 12, 14, 15, 17, 19, 21, 22, 24, 26, 28, 29, 30];
const SEPTEMBER_END = isoDate('2026-09-30');

const STREAK = [
  { label: 'This week', n: 3 },
  { label: 'Oct 5 to 11', n: 5 },
  { label: 'Sep 28 to Oct 4', n: 4 },
  { label: 'Sep 21 to 27', n: 4 },
  { label: 'Sep 14 to 20', n: 4 },
  { label: 'Sep 7 to 13', n: 4 },
  { label: 'Aug 31 to Sep 6', n: 4 },
];

const GOAL = 4;

const chevron = (d: string) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
    <path d={d}></path>
  </svg>
);

export default function Attendance() {
  const { state } = useDemo();
  const [offset, setOffset] = useState(0);
  const september = offset === -1;
  const viewToday = september ? SEPTEMBER_END : state.today;
  const viewVisited = september ? VISITED_SEP : VISITED;
  const { month } = parts(viewToday);
  const cells = monthGrid(viewToday, viewVisited, !september);
  const mon = monthName(month);
  const monthLabel = september ? 'September 2026' : 'October 2026';
  const visitsLabel = september ? 'visits in Sep' : 'visits in Oct';

  return (
    <PhoneScreen padding="52px 16px 0" bottomInset={120} bars={<MemberTabBar active="attendance" />}>
      <header style={css('display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px')}>
        <h1 style={css('margin: 0; font-size: 26px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em')}>Attendance</h1>
        <span style={css('font-size: 12px; color: #8E8E93')}>Goal 4 visits a week</span>
      </header>

      <section aria-label={`${monthLabel} calendar`} style={css('margin-top: 14px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 6px 12px 12px')}>
        <div style={css('display: flex; align-items: center; justify-content: space-between; gap: 8px')}>
          <button type="button" aria-label={september ? 'Previous month, August 2026' : 'Previous month, September 2026'} disabled={september} onClick={() => setOffset(-1)} style={css('width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer')}>{chevron('m15 18-6-6 6-6')}</button>
          <h2 style={css('margin: 0; font-size: 17px; font-weight: 800; font-stretch: 108%')}>{monthLabel}</h2>
          <button type="button" aria-label={september ? 'Next month, October 2026' : 'Next month, November 2026, not available yet'} disabled={!september} onClick={() => setOffset(0)} style={september ? css('width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer') : css('width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: #3F3F46; display: flex; align-items: center; justify-content: center')}>{chevron('m9 18 6-6-6-6')}</button>
        </div>
        <div style={css('display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); padding: 0 0 4px')}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <span key={d} style={css('text-align: center; font-size: 11px; font-weight: 600; color: #8E8E93')}>{d}</span>
          ))}
        </div>
        <div key={monthLabel} role="group" aria-label={`Days of ${monthLabel}`} className={september ? 'calendar-enter-left' : 'calendar-enter-right'} style={css('display: grid; grid-template-columns: repeat(7, minmax(0, 1fr))')}>
          {cells.map((c, i) => {
            if (c.day === null) return <span key={`b${i}`}></span>;
            const wrap = css('display: flex; align-items: center; justify-content: center; height: 40px');
            const label = `${mon} ${c.day}`;
            if (c.kind === 'today') {
              return (
                <span key={c.day} style={wrap}>
                  <span role="img" aria-label={`${label}, today, visited`} style={css('width: 36px; height: 36px; box-sizing: border-box; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-variant-numeric: tabular-nums; border: 1.5px solid #FFFFFF')}>
                    <span style={css('width: 28px; height: 28px; border-radius: 50%; background: #FF6A00; color: #000000; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800')}>{c.day}</span>
                  </span>
                </span>
              );
            }
            if (c.kind === 'visited') {
              return (
                <span key={c.day} style={wrap}>
                  <span aria-label={`${label}, visited`} style={css('width: 36px; height: 36px; box-sizing: border-box; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-variant-numeric: tabular-nums; background: #FF6A00; color: #000000; font-weight: 800')}>{c.day}</span>
                </span>
              );
            }
            if (c.kind === 'rest') {
              return (
                <span key={c.day} style={wrap}>
                  <span aria-label={`${label}, rest day`} style={css('width: 36px; height: 36px; box-sizing: border-box; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-variant-numeric: tabular-nums; background: #3F3F46; color: #FFFFFF; font-weight: 600')}>{c.day}</span>
                </span>
              );
            }
            return (
              <span key={c.day} style={wrap}>
                <span aria-label={`${label}, upcoming`} style={css('width: 36px; height: 36px; box-sizing: border-box; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-variant-numeric: tabular-nums; border: 1px solid rgba(255,255,255,0.06); color: #8E8E93')}>{c.day}</span>
              </span>
            );
          })}
        </div>
        <div style={css('display: flex; flex-wrap: wrap; gap: 6px 16px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06)')}>
          <span style={css('display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93')}><span style={css('width: 10px; height: 10px; border-radius: 50%; background: #FF6A00')}></span>Visit in streak</span>
          <span style={css('display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93')}><span style={css('width: 10px; height: 10px; border-radius: 50%; background: #A1A1AA')}></span>Visit before streak</span>
          <span style={css('display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93')}><span style={css('width: 10px; height: 10px; border-radius: 50%; background: #3F3F46')}></span>Rest day</span>
        </div>
      </section>

      <section aria-label="Attendance stats" style={css('margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr))')}>
        <div style={css('display: flex; flex-direction: column; gap: 4px')}>
          <span style={css('font-size: 22px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums; color: #FFFFFF')}>{viewVisited.length}</span>
          <span style={css('font-size: 11px; color: #8E8E93')}>{visitsLabel}</span>
        </div>
        <div style={css('display: flex; flex-direction: column; gap: 4px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.06)')}>
          <span style={css('font-size: 22px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums; color: #FFFFFF')}>{GOAL}<span style={css('font-size: 11px; font-weight: 600; color: #8E8E93')}> / wk</span></span>
          <span style={css('font-size: 11px; color: #8E8E93')}>weekly goal</span>
        </div>
        <div style={css('display: flex; flex-direction: column; gap: 4px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.06)')}>
          <span style={css('font-size: 22px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums; color: #FF6A00')}>6<span style={css('font-size: 11px; font-weight: 600; color: #8E8E93')}> wk</span></span>
          <span style={css('font-size: 11px; color: #8E8E93')}>current streak</span>
        </div>
        <div style={css('display: flex; flex-direction: column; gap: 4px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.06)')}>
          <span style={css('font-size: 22px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums; color: #FFFFFF')}>9<span style={css('font-size: 11px; font-weight: 600; color: #8E8E93')}> wk</span></span>
          <span style={css('font-size: 11px; color: #8E8E93')}>best streak</span>
        </div>
      </section>

      <h2 style={css('margin: 18px 4px 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Streak history</h2>
      <ul className="stagger" style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px')}>
        {STREAK.map((row, i) => (
          <li key={row.label} style={i === 0 ? css('display: flex; align-items: center; gap: 12px; min-height: 48px') : css('display: flex; align-items: center; gap: 12px; min-height: 48px; border-top: 1px solid rgba(255,255,255,0.06)')}>
            <span style={css('width: 92px; flex-shrink: 0; font-size: 13px; color: #A1A1AA')}>{row.label}</span>
            <span role="img" aria-label={`${row.n} of ${GOAL} visits`} style={css('flex-grow: 1; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px')}>
              {Array.from({ length: GOAL }, (_, k) => (
                <span key={k} style={k < row.n ? css('height: 3px; border-radius: 2px; background: #FF6A00') : css('height: 3px; border-radius: 2px; background: #2C2C2E')}></span>
              ))}
            </span>
            <span style={css('width: 62px; flex-shrink: 0; text-align: right; font-size: 12px; color: #8E8E93; font-variant-numeric: tabular-nums')}><span style={css('color: #FFFFFF; font-weight: 700')}>{row.n}</span> of 4</span>
          </li>
        ))}
      </ul>
    </PhoneScreen>
  );
}
