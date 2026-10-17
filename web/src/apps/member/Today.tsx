// Port of design/canvas/Member-Home.dc.html (Today). Membership figures come from the demo
// member via statusOf() and daysLeft(); the session, streak and trained blocks are the
// canvas sample content. The accent tweak is reachable as ?accent=%23FF5500.

import { Link, useSearchParams } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { useDemo } from '../../demo/store';
import { daysLeft, statusOf } from '../../demo/state';
import { MemberTabBar } from './MemberTabBar';
import { STATUS_ICON, STATUS_LABEL, shortDate, signedInMember } from './_status';

const ACCENTS = ['#FF6A00', '#FF5500', '#FF8A1F'];

// Last 4 weeks, one row per week (Mon to Sun): 1 visit, 0 rest, -1 later this week.
const MICRO_PLAN = [
  [0, 1, 1, 0, 1, 0, 1],
  [0, 0, 0, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 0],
  [1, 0, 1, 0, 0, 1, -1],
];

export function Today() {
  const { state } = useDemo();
  const [params] = useSearchParams();
  const requested = params.get('accent');
  const accent = requested && ACCENTS.includes(requested.toUpperCase()) ? requested.toUpperCase() : '#FF6A00';

  const member = signedInMember(state);
  const status = statusOf(state, member);
  const remaining = daysLeft(state, member);
  const until = member.coverageEnd ? shortDate(member.coverageEnd) : '';

  const microWeeks = MICRO_PLAN.map((days, wi) => ({
    gap: wi === MICRO_PLAN.length - 1 ? '0px' : '4px',
    days: days.map((v, di) => ({
      gap: di === 6 ? '0px' : '4px',
      bg: v === 1 ? accent : v === 0 ? '#3F3F46' : 'rgba(255,255,255,0.06)',
    })),
  }));

  return (
    <PhoneScreen padding="52px 20px 0" bars={<MemberTabBar active="today" />}>
      <header style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
        <div style={css("display: flex; flex-direction: column; gap: 4px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Saturday, Oct 17</span>
          <h1 style={css("margin: 0; font-size: 26px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em")}>Good evening, {member.nickname ?? member.name}</h1>
        </div>
        <Link to="/m/notices" aria-label="Notices, 1 new" style={css("width: 44px; height: 44px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.06); border-radius: 50%; background: #17171A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; box-sizing: border-box; text-decoration: none; position: relative")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>
          <span style={css("position: absolute; top: 11px; right: 12px; width: 6px; height: 6px; border-radius: 50%; background: #FF6A00")}></span>
        </Link>
      </header>

      <Link to="/m/workout" aria-label="Today's session: Chest and Triceps. Continue workout" style={css("margin-top: 18px; text-decoration: none; color: #FFFFFF; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px 16px 16px 18px; display: flex; align-items: center; gap: 14px")}>
        <div style={css("display: flex; flex-direction: column; gap: 4px; flex-grow: 1; min-width: 0")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Today's session</span>
          <span style={css("font-size: 20px; font-weight: 800; font-stretch: 108%")}>Chest + Triceps</span>
          <span style={css("font-size: 12px; color: #8E8E93")}>Checked in 6:42 PM, 3 exercises</span>
        </div>
        <span style={css(`width: 48px; height: 48px; flex-shrink: 0; box-sizing: border-box; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: ${accent}; display: flex; align-items: center; justify-content: center`)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </span>
      </Link>

      <section aria-label="Attendance streak" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 18px")}>
        <div style={css("display: flex; align-items: flex-start; justify-content: space-between; gap: 12px")}>
          <div style={css("display: flex; flex-direction: column; gap: 8px")}>
            <span style={css(`display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: ${accent}`)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>Streak
            </span>
            <span style={css("font-size: 48px; line-height: 0.95; font-weight: 800; font-stretch: 120%; letter-spacing: -0.02em; font-variant-numeric: tabular-nums")}>6<span style={css("font-size: 15px; font-weight: 600; letter-spacing: 0; color: #8E8E93")}> weeks</span></span>
          </div>
          <div style={css("display: flex; flex-direction: column; align-items: flex-end; gap: 8px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Last 4 weeks</span>
            <div role="img" aria-label="Last 4 weeks of visits, 16 visits, every full week met the goal" style={css("font-size: 0; line-height: 0")}>
              {microWeeks.map((w, wi) => (
                <span key={wi} style={css(`display: block; white-space: nowrap; margin-bottom: ${w.gap}`)}>
                  {w.days.map((d, di) => (
                    <span key={di} style={css(`display: inline-block; width: 5px; height: 5px; margin-right: ${d.gap}; border-radius: 50%; background: ${d.bg}`)}></span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={css("display: flex; flex-direction: column; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}>
            <span style={css("font-size: 13px; color: #8E8E93")}><span style={css("font-size: 17px; font-weight: 800; color: #FFFFFF; font-variant-numeric: tabular-nums")}>3 of 4</span> visits this week</span>
            <span style={css("font-size: 12px; color: #8E8E93")}>1 more by Sunday</span>
          </div>
          <ol aria-label="This week" style={css("list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); text-align: center")}>
            <li style={css("display: flex; flex-direction: column; align-items: center; gap: 8px")}><span style={css("font-size: 11px; font-weight: 600; color: #8E8E93")}>M</span><span aria-label="Monday, visited" style={css(`width: 10px; height: 10px; border-radius: 50%; background: ${accent}`)}></span></li>
            <li style={css("display: flex; flex-direction: column; align-items: center; gap: 8px")}><span style={css("font-size: 11px; font-weight: 600; color: #8E8E93")}>T</span><span aria-label="Tuesday, rest" style={css("width: 10px; height: 10px; border-radius: 50%; background: #3F3F46")}></span></li>
            <li style={css("display: flex; flex-direction: column; align-items: center; gap: 8px")}><span style={css("font-size: 11px; font-weight: 600; color: #8E8E93")}>W</span><span aria-label="Wednesday, visited" style={css(`width: 10px; height: 10px; border-radius: 50%; background: ${accent}`)}></span></li>
            <li style={css("display: flex; flex-direction: column; align-items: center; gap: 8px")}><span style={css("font-size: 11px; font-weight: 600; color: #8E8E93")}>T</span><span aria-label="Thursday, rest" style={css("width: 10px; height: 10px; border-radius: 50%; background: #3F3F46")}></span></li>
            <li style={css("display: flex; flex-direction: column; align-items: center; gap: 8px")}><span style={css("font-size: 11px; font-weight: 600; color: #8E8E93")}>F</span><span aria-label="Friday, rest" style={css("width: 10px; height: 10px; border-radius: 50%; background: #3F3F46")}></span></li>
            <li aria-current="date" style={css("display: flex; flex-direction: column; align-items: center; gap: 8px")}><span style={css("font-size: 11px; font-weight: 800; color: #FFFFFF")}>S</span><span aria-label="Saturday, today, visited" style={css(`width: 10px; height: 10px; border-radius: 50%; background: ${accent}; outline: 1px solid rgba(255,255,255,0.6); outline-offset: 3px`)}></span></li>
            <li style={css("display: flex; flex-direction: column; align-items: center; gap: 8px")}><span style={css("font-size: 11px; font-weight: 600; color: #8E8E93")}>S</span><span aria-label="Sunday, upcoming" style={css("width: 10px; height: 10px; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46")}></span></li>
          </ol>
        </div>
      </section>

      <div style={css("margin-top: 12px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px")}>
        <Link to="/m/pass" style={css("text-decoration: none; color: #FFFFFF; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px")}>
          <div style={css("display: flex; align-items: center; justify-content: space-between")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Membership</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
          </div>
          <span style={css("font-size: 32px; line-height: 1; font-weight: 800; font-stretch: 115%; font-variant-numeric: tabular-nums")}>{remaining}<span style={css("font-size: 13px; font-weight: 600; color: #8E8E93")}> days</span></span>
          <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={STATUS_ICON[status]} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span style={css("color: #FFFFFF; font-weight: 600")}>{STATUS_LABEL[status]}</span> to {until}</span>
        </Link>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Trained</span>
          <span style={css("font-size: 32px; line-height: 1; font-weight: 800; font-stretch: 115%; font-variant-numeric: tabular-nums")}>2<span style={css("font-size: 13px; font-weight: 600; color: #8E8E93")}>h </span>46<span style={css("font-size: 13px; font-weight: 600; color: #8E8E93")}>m</span></span>
          <div role="img" aria-label="Minutes trained by day: Monday 70, Wednesday 54, Saturday 42 so far, other days rest" style={css("display: flex; align-items: flex-end; justify-content: space-between; height: 22px; padding: 0 2px")}>
            <span style={css(`width: 3px; height: 100%; border-radius: 2px; background: ${accent}`)}></span>
            <span style={css("width: 3px; height: 100%; border-radius: 2px; background: #2C2C2E")}></span>
            <span style={css("width: 3px; height: 100%; border-radius: 2px; background: #2C2C2E; display: flex; align-items: flex-end")}><span style={css(`width: 3px; height: 77%; border-radius: 2px; background: ${accent}`)}></span></span>
            <span style={css("width: 3px; height: 100%; border-radius: 2px; background: #2C2C2E")}></span>
            <span style={css("width: 3px; height: 100%; border-radius: 2px; background: #2C2C2E")}></span>
            <span style={css("width: 3px; height: 100%; border-radius: 2px; background: #2C2C2E; display: flex; align-items: flex-end")}><span style={css(`width: 3px; height: 60%; border-radius: 2px; background: ${accent}`)}></span></span>
            <span style={css("width: 3px; height: 100%; border-radius: 2px; background: #2C2C2E")}></span>
          </div>
        </div>
      </div>

      <Link to="/m/history" style={css("margin-top: 12px; text-decoration: none; color: #FFFFFF; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 14px 16px; display: flex; align-items: center; gap: 14px")}>
        <span style={css("width: 40px; height: 40px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #8E8E93; display: flex; align-items: center; justify-content: center")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
        </span>
        <span style={css("display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0")}>
          <span style={css("font-size: 15px; font-weight: 700")}>Back + Biceps</span>
          <span style={css("font-size: 12px; color: #8E8E93")}>Wednesday, 54 min, 14 sets</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
      </Link>
    </PhoneScreen>
  );
}
