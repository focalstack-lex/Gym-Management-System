// Canvas artboard Coach-Log: log a PT session against a same-day desk check-in.
// ?checkin=none (or not-checked-in) shows the not-checked-in state with logging disabled.

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { css } from '../../lib/css';
import { PhoneScreen } from '../../components/PhoneScreen';
import { useDemo } from '../../demo/store';

const DURATIONS = ['30 min', '45 min', '60 min'];

export default function Log() {
  const { state, dispatch } = useDemo();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [duration, setDuration] = useState('60 min');
  const [notes, setNotes] = useState('');
  const checkin = params.get('checkin');
  const notIn = checkin === 'none' || checkin === 'not-checked-in';
  const mika = state.members.find((m) => m.id === 'mika');
  const left = mika?.pt?.left ?? 0;
  const after = Math.max(0, left - 1);
  const checkedIn = !notIn && left > 0;
  const signedIn = !notIn;

  const logSession = () => {
    if (!checkedIn || !DURATIONS.includes(duration)) return;
    dispatch({ type: 'logPtSession', memberId: 'mika', duration, notes: notes.trim() || null });
    navigate('/coach/clients');
  };

  return (
    <PhoneScreen
      padding="52px 16px 0"
      bottomInset={170}
      bars={
        <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 16px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 12px")}>
          <div style={css("display: flex; align-items: center; gap: 12px")}>
            <span style={css("flex-grow: 1; font-size: 13px; color: #8E8E93")}>After this session</span>
            <span style={css("width: 64px; height: 2px; background: #3F3F46")}><span style={css(`display: block; width: ${Math.round((after / 12) * 100)}%; height: 100%; background: #FFFFFF`)}></span></span>
            <span style={css("font-size: 13px; color: #8E8E93; font-variant-numeric: tabular-nums")}><span style={css("font-size: 16px; font-weight: 800; color: #FFFFFF")}>{after}</span> of 12 left</span>
          </div>
          {checkedIn && (
            <button type="button" onClick={logSession} style={css("width: 100%; height: 54px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="m9 14 2 2 4-4"></path></svg>Log session</button>
          )}
          {signedIn && !checkedIn && (
            <button type="button" disabled style={css("width: 100%; height: 54px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #1F1F23; color: #8E8E93; font-family: inherit; font-size: 15px; font-weight: 600")}>No sessions left</button>
          )}
          {notIn && (
            <button type="button" disabled style={css("width: 100%; height: 54px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #1F1F23; color: #8E8E93; font-family: inherit; font-size: 15px; font-weight: 600")}>Waiting for check-in</button>
          )}
        </div>
      }
    >
      <header style={css("display: flex; align-items: center; gap: 12px")}>
        <Link to="/coach/clients" aria-label="Back to clients" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
        <div style={css("display: flex; flex-direction: column; gap: 2px")}>
          <h1 style={css("margin: 0; font-size: 20px; font-weight: 800")}>Log PT session</h1>
          <span style={css("font-size: 12px; color: #8E8E93")}>Saturday, Oct 17</span>
        </div>
      </header>

      <section aria-label="Client" style={css("margin-top: 18px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px")}>
        <div style={css("display: flex; align-items: center; gap: 12px")}>
          <span style={css("width: 48px; height: 48px; flex-shrink: 0; box-sizing: border-box; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 800; color: #8E8E93")}>MS</span>
          <div style={css("display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0")}>
            <span style={css("font-size: 19px; font-weight: 800; font-stretch: 108%")}>Mika Santos</span>
            <span style={css("font-size: 12px; color: #8E8E93")}>PT 12-session package</span>
          </div>
          <span style={css("display: flex; flex-direction: column; align-items: flex-end; gap: 2px")}><span style={css("font-size: 26px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums")}>{left}</span><span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8E8E93")}>left</span></span>
        </div>
        {signedIn && (
          <div style={css("display: flex; align-items: center; gap: 10px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06)")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
            <span style={css("flex-grow: 1; font-size: 14px; font-weight: 600")}>Checked in today, 6:42 PM</span>
            <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8E93")}>desk</span>
          </div>
        )}
        {notIn && (
          <div role="alert" style={css("display: flex; align-items: flex-start; gap: 10px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06)")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0; margin-top: 1px")}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
            <span style={css("display: flex; flex-direction: column; gap: 3px")}><span style={css("font-size: 14px; font-weight: 700")}>No check-in today</span><span style={css("font-size: 12px; line-height: 1.45; color: #A1A1AA")}>A session can only be logged against a same-day desk check-in. Ask Mika to check in first.</span></span>
          </div>
        )}
      </section>

      <section aria-label="Session details" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px")}>
        <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Start</span>
          <button type="button" aria-label="Start time, 7:00 PM" style={css("height: 44px; padding: 0 14px; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; background: #0C0C0E; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 15px; cursor: pointer")}>7:00 PM</button>
        </div>
        <div style={css("display: flex; flex-direction: column; gap: 8px")}>
          <span id="dur" style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Duration</span>
          <div role="radiogroup" aria-labelledby="dur" style={css("display: flex; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
            {DURATIONS.map((d) => {
              const on = d === duration;
              return (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setDuration(d)}
                  style={on
                    ? css("flex: 1; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer")
                    : css("flex: 1; height: 44px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer")}
                >{d}</button>
              );
            })}
          </div>
        </div>
        <Link to="/coach/plan" style={css("display: flex; align-items: center; gap: 12px; min-height: 48px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; text-decoration: none")}>
          <span style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1")}><span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Focus</span><span style={css("font-size: 15px; font-weight: 700")}>Chest + Triceps, plan Day A</span></span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
        </Link>
      </section>

      <label style={css("margin-top: 12px; display: flex; flex-direction: column; gap: 8px")}>
        <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; padding-left: 4px")}>Coach notes</span>
        <textarea rows={3} placeholder="Form cues, loads, how she felt" value={notes} onChange={(e) => setNotes(e.target.value)} style={css("box-sizing: border-box; min-height: 88px; resize: none; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 12px 14px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 15px; line-height: 1.45")}></textarea>
      </label>
    </PhoneScreen>
  );
}
