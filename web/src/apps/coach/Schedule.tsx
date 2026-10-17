// Canvas artboard Coach-Schedule: the week day strip and the selected day's PT sessions.
// The canvas draws Saturday's sessions only, so other days show their heading with no sessions.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { css } from '../../lib/css';
import { PhoneScreen } from '../../components/PhoneScreen';
import { CoachTabBar } from './CoachTabBar';

const DAYS = [
  { key: 'Mon', date: '12', label: 'Mon Oct 12', heading: 'Monday, Oct 12' },
  { key: 'Tue', date: '13', label: 'Tue Oct 13', heading: 'Tuesday, Oct 13' },
  { key: 'Wed', date: '14', label: 'Wed Oct 14', heading: 'Wednesday, Oct 14' },
  { key: 'Thu', date: '15', label: 'Thu Oct 15', heading: 'Thursday, Oct 15' },
  { key: 'Fri', date: '16', label: 'Fri Oct 16', heading: 'Friday, Oct 16' },
  { key: 'Sat', date: '17', label: 'Sat Oct 17', heading: 'Saturday, Oct 17' },
  { key: 'Sun', date: '18', label: 'Sun Oct 18', heading: 'Sunday, Oct 18' },
];

export default function Schedule() {
  const [selected, setSelected] = useState('Sat');
  const day = DAYS.find((d) => d.key === selected) ?? DAYS[5];
  const hasSessions = day.key === 'Sat';

  return (
    <PhoneScreen padding="52px 16px 0" bars={<CoachTabBar active="schedule" />}>
      <header style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
        <div style={css("display: flex; flex-direction: column; gap: 4px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>October 2026</span>
          <h1 style={css("margin: 0; font-size: 26px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em")}>Schedule</h1>
        </div>
        <span style={css("font-size: 12px; color: #8E8E93; text-align: right")}>Coach Ramon</span>
      </header>

      <div role="radiogroup" aria-label="Day of week" style={css("margin-top: 14px; display: flex; gap: 2px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
        {DAYS.map((d) => {
          const on = d.key === selected;
          return (
            <button
              key={d.key}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={d.label}
              onClick={() => setSelected(d.key)}
              style={on
                ? css("flex: 1; min-width: 0; height: 44px; padding: 0; border-radius: 11px; border: 1px solid rgba(255,255,255,0.06); background: #1F1F23; color: #FFFFFF; font-family: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; cursor: pointer")
                : css("flex: 1; min-width: 0; height: 44px; padding: 0; border-radius: 11px; border: 1px solid transparent; background: transparent; color: #8E8E93; font-family: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; cursor: pointer")}
            ><span style={css("font-size: 10px; font-weight: 600; line-height: 1.1")}>{d.key}</span><span style={css("font-size: 15px; font-weight: 800; line-height: 1.1; font-variant-numeric: tabular-nums")}>{d.date}</span></button>
          );
        })}
      </div>

      <section aria-label={`${day.heading} sessions`} style={css("margin-top: 14px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 12px 16px 2px")}>
        <div style={css("display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 8px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>{day.heading}</span>
          <span style={css("font-size: 12px; color: #8E8E93; font-variant-numeric: tabular-nums")}><span style={css("color: #FFFFFF; font-weight: 700")}>{hasSessions ? 2 : 0}</span> of {hasSessions ? 4 : 0} done</span>
        </div>
        {hasSessions && (
          <ul style={css("list-style: none; margin: 0; padding: 0")}>
            <li style={css(" padding: 12px 0; display: flex; align-items: flex-start; gap: 12px")}><span style={css("font-family: 'JetBrains Mono', monospace; width: 64px; flex-shrink: 0; padding-top: 2px; font-size: 12px; color: #A1A1AA")}>6:00 AM</span><span style={css("display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0")}><span style={css("font-size: 16px; font-weight: 700")}>Rhea Mendoza</span><span style={css("font-size: 12px; color: #8E8E93")}>Legs</span></span><span role="img" aria-label="Done" style={css("padding-top: 1px")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></span></li>
            <li style={css("border-top: 1px solid rgba(255,255,255,0.06); padding: 12px 0; display: flex; align-items: flex-start; gap: 12px")}><span style={css("font-family: 'JetBrains Mono', monospace; width: 64px; flex-shrink: 0; padding-top: 2px; font-size: 12px; color: #A1A1AA")}>7:30 AM</span><span style={css("display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0")}><span style={css("font-size: 16px; font-weight: 700")}>Den Villanueva</span><span style={css("font-size: 12px; color: #8E8E93")}>Back + Biceps</span></span><span role="img" aria-label="Done" style={css("padding-top: 1px")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></span></li>
            <li style={css("border-top: 1px solid rgba(255,255,255,0.06); padding: 12px 0 14px")}><div style={css("display: flex; align-items: flex-start; gap: 12px")}><span style={css("font-family: 'JetBrains Mono', monospace; width: 64px; flex-shrink: 0; padding-top: 2px; font-size: 12px; color: #FFFFFF")}>7:00 PM</span><span style={css("display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0")}><span style={css("font-size: 16px; font-weight: 700")}>Mika Santos</span><span style={css("font-size: 12px; color: #8E8E93")}>Chest + Triceps</span><span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #A1A1AA")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg> In gym since 6:42 PM</span></span><span role="img" aria-label="Up next" style={css("padding-top: 1px")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span></div><Link to="/coach/log" style={css("margin-top: 12px; width: 100%; height: 48px; box-sizing: border-box; border-radius: 14px; background: #FF6A00; color: #000000; font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none")}>Log session</Link></li>
            <li style={css("border-top: 1px solid rgba(255,255,255,0.06); padding: 12px 0; display: flex; align-items: flex-start; gap: 12px")}><span style={css("font-family: 'JetBrains Mono', monospace; width: 64px; flex-shrink: 0; padding-top: 2px; font-size: 12px; color: #A1A1AA")}>8:00 PM</span><span style={css("display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0")}><span style={css("font-size: 16px; font-weight: 700")}>Carlo Dizon</span><span style={css("font-size: 12px; color: #8E8E93")}>Shoulders + Core</span><span style={css("font-size: 12px; font-weight: 600; color: #FF6A00")}>Package: 2 of 8 left, low balance</span></span><span role="img" aria-label="Not checked in" style={css("padding-top: 1px")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10" strokeDasharray="3 3"></circle></svg></span></li>
          </ul>
        )}
      </section>
    </PhoneScreen>
  );
}
