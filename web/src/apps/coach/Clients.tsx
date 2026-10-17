// Canvas artboard Coach-Clients: today at a glance, up next, and the PT client roster.
// In-gym state comes from the desk sign-in sheet; Mika is shown in the gym from 6:42 PM as drawn.

import { Link } from 'react-router-dom';
import { css } from '../../lib/css';
import { PhoneScreen } from '../../components/PhoneScreen';
import { DEMO_TIME } from '../../demo/seed';
import { useDemo } from '../../demo/store';
import { CoachTabBar } from './CoachTabBar';

const ROSTER = ['mika', 'rhea', 'carlo', 'den', 'bea'];

export default function Clients() {
  const { state } = useDemo();

  const clients = ROSTER.flatMap((id) => {
    const member = state.members.find((m) => m.id === id);
    if (!member || !member.pt) return [];
    const { left, total } = member.pt;
    const signedIn = state.signIns.find((s) => s.memberId === id);
    const inAt = signedIn ? signedIn.time : id === 'mika' ? DEMO_TIME : null;
    return [
      {
        id,
        initials: member.initials,
        name: member.name,
        left,
        total,
        pct: Math.round((left / total) * 100) + '%',
        bar: left <= 2 ? '#FF6A00' : '#FFFFFF',
        inGym: inAt !== null,
        away: inAt === null,
        seen: inAt !== null ? inAt : `Last in ${member.lastVisit.split(',')[0]}`,
      },
    ];
  });
  const inGymCount = clients.filter((c) => c.inGym).length;
  const sessions = 2 + state.audit.filter((a) => a.action === 'PT session logged').length;

  return (
    <PhoneScreen padding="52px 16px 0" bars={<CoachTabBar active="clients" />}>
      <header style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
        <div style={css("display: flex; flex-direction: column; gap: 4px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Saturday, Oct 17</span>
          <h1 style={css("margin: 0; font-size: 26px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em")}>Coach Ramon</h1>
        </div>
        <button type="button" aria-label="Notices" style={css("width: 44px; height: 44px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.06); border-radius: 50%; background: #17171A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>
        </button>
      </header>

      <section aria-label="Today at a glance" style={css("margin-top: 18px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px")}>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Sessions</span>
          <span style={css("font-size: 32px; line-height: 1; font-weight: 800; font-stretch: 115%; font-variant-numeric: tabular-nums")}>{sessions}<span style={css("font-size: 14px; font-weight: 600; color: #8E8E93")}> of 4</span></span>
          <div role="img" aria-label={`${sessions} of 4 sessions logged today`} style={css("display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px")}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={css(`height: 3px; border-radius: 2px; background: ${i < sessions ? '#FF6A00' : '#2C2C2E'}`)}></span>
            ))}
          </div>
        </div>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>In gym now</span>
          <span style={css("font-size: 32px; line-height: 1; font-weight: 800; font-stretch: 115%; font-variant-numeric: tabular-nums")}>{inGymCount}<span style={css("font-size: 14px; font-weight: 600; color: #8E8E93")}> clients</span></span>
          <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>From desk check-ins</span>
        </div>
      </section>

      <Link to="/coach/log" aria-label="Up next at 7:00 PM: Mika Santos, Chest and Triceps. Log session" style={css("margin-top: 12px; text-decoration: none; color: #FFFFFF; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 14px 14px 16px; display: flex; align-items: center; gap: 14px")}>
        <div style={css("display: flex; flex-direction: column; gap: 4px; flex-grow: 1; min-width: 0")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Up next, 7:00 PM</span>
          <span style={css("font-size: 19px; font-weight: 800; font-stretch: 108%")}>Mika Santos</span>
          <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>In gym since 6:42 PM, Chest + Triceps</span>
        </div>
        <span style={css("width: 48px; height: 48px; flex-shrink: 0; box-sizing: border-box; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FF6A00; display: flex; align-items: center; justify-content: center")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </span>
      </Link>

      <section aria-label="My clients" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 12px 16px 2px")}>
        <div style={css("display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 6px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>PT clients</span>
          <span style={css("font-size: 12px; color: #8E8E93")}>Sessions left</span>
        </div>
        <ul style={css("list-style: none; margin: 0; padding: 0")}>
          {clients.map((c) => (
            <li key={c.id} style={css("display: flex; align-items: center; gap: 12px; min-height: 58px; border-top: 1px solid rgba(255,255,255,0.06)")}>
              <span style={css("width: 36px; height: 36px; flex-shrink: 0; box-sizing: border-box; border-radius: 11px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #8E8E93")}>{c.initials}</span>
              <span style={css("display: flex; flex-direction: column; gap: 6px; flex-grow: 1; min-width: 0")}>
                <span style={css("font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>{c.name}</span>
                <span style={css("display: flex; align-items: center; gap: 8px")}>
                  <span style={css("width: 56px; height: 2px; flex-shrink: 0; background: #3F3F46")}><span style={css(`display: block; height: 100%; width: ${c.pct}; background: ${c.bar}`)}></span></span>
                  <span style={css("font-size: 12px; color: #8E8E93; white-space: nowrap; font-variant-numeric: tabular-nums")}><span style={css("color: #FFFFFF; font-weight: 700")}>{c.left}</span> of {c.total}</span>
                </span>
              </span>
              {c.inGym && (
                <span style={css("display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #A1A1AA")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="In gym"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>{c.seen}</span>
              )}
              {c.away && (
                <span style={css("white-space: nowrap; font-size: 11px; color: #8E8E93")}>{c.seen}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </PhoneScreen>
  );
}
