// Port of design/canvas/Desk-Mobile-Freeze.dc.html. The preview is the domain rule (spec 4.2):
// a freeze of N days moves the coverage end N days later.

import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { extendForFreeze } from '../../domain/coverage';
import type { IsoDate } from '../../domain/dates';
import { addDays, diffDays, isoDate, parts } from '../../domain/dates';
import type { MembershipStatus } from '../../domain/status';
import { statusOf } from '../../demo/state';
import { useDemo } from '../../demo/store';

const LENGTHS = [
  { days: 7, label: '7 days' },
  { days: 14, label: '14 days' },
  { days: 30, label: '30 days' },
];

const STATUS_LABEL: Record<MembershipStatus, string> = {
  frozen: 'Frozen',
  active: 'Active',
  expiring_soon: 'Expiring soon',
  grace: 'Grace',
  expired: 'Expired',
  inactive: 'Inactive',
  dormant: 'Dormant',
  no_plan: 'No plan',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (d: IsoDate) => {
  const p = parts(d);
  return `${MONTHS[p.month - 1]} ${p.day}`;
};

function validDate(value: string): IsoDate | null {
  try {
    return isoDate(value);
  } catch {
    return null;
  }
}

export default function Freeze() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const member = state.members.find((m) => m.id === 'mika');
  const [start, setStart] = useState<string>(state.today);
  const [days, setDays] = useState(14);
  const [reason, setReason] = useState('Travel');
  const [note, setNote] = useState('');
  const reasonRef = useRef<HTMLSelectElement | null>(null);
  const startRef = useRef<HTMLInputElement | null>(null);

  if (!member || !member.coverageEnd) return null;
  const current = member.coverageEnd;
  const startDate = validDate(start) ?? state.today;
  const freezeEnd = addDays(startDate, days);
  const moved = extendForFreeze(current, days);
  const remaining = Math.max(1, diffDays(startDate, current));
  const coverageLabel = `to ${fmt(current)}`;

  const submit = () => {
    const field = (el: HTMLInputElement | HTMLSelectElement | null, message: string) => {
      if (!el) return;
      el.setCustomValidity(message);
      el.reportValidity();
    };
    if (!state.online) return field(reasonRef.current, 'Freezes are not allowed while the desk is offline');
    if (!validDate(start)) return field(startRef.current, 'Enter a valid start date');
    if (!reason) return field(reasonRef.current, 'Select a reason');
    if (member.frozen) return field(reasonRef.current, 'This membership is already frozen');
    dispatch({
      type: 'freeze',
      memberId: member.id,
      start: startDate,
      days,
      reason,
      note: note.trim() || null,
    });
    navigate('/desk/checkin');
  };

  return (
    <PhoneScreen
      padding="52px 16px 0"
      bottomInset={0}
      bars={
        <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 16px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 0px")}>
            <button type="button" onClick={submit} style={css("height: 54px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer")}>Submit freeze request</button>
          </div>
      }
    >
      <header style={css("display: flex; align-items: center; gap: 12px")}>
          <Link to="/desk/checkin" aria-label="Back to check-in" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="m15 18-6-6 6-6"></path></svg></Link>
          <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
            <h1 style={css("margin: 0; font-size: 20px; font-weight: 800")}>Freeze membership</h1>
            <span role="status" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93; white-space: nowrap")}><span style={css("width: 6px; height: 6px; border-radius: 50%; background: #30D158")}></span>Online, Ana R. on shift</span>
          </div>
        </header>

        <section aria-label="Member" style={css("margin-top: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: flex; align-items: center; gap: 12px")}>
          <div style={css("width: 48px; height: 48px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>{member.initials}</div>
          <div style={css("display: flex; flex-direction: column; gap: 3px; min-width: 0; flex-grow: 1")}>
            <span style={css("font-size: 17px; font-weight: 800; font-stretch: 105%")}>{member.name}</span>
            <span style={css("display: flex; align-items: center; gap: 6px; font-size: 12px; white-space: nowrap")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span style={css("font-weight: 700; color: #30D158")}>{STATUS_LABEL[statusOf(state, member)]}</span><span style={css("color: #8E8E93")}>{coverageLabel}</span></span>
          </div>
          <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8E93")}>{member.code}</span>
        </section>

        <form aria-label="Freeze request" noValidate onSubmit={(e) => e.preventDefault()} style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px")}>
          <label style={css("display: flex; flex-direction: column; gap: 6px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Start date</span>
            <input type="date" ref={startRef} value={start} onChange={(e) => { e.target.setCustomValidity(""); setStart(e.target.value); }} style={css("height: 48px; box-sizing: border-box; border: 1px solid #FF6A00; border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; color-scheme: dark; font-family: inherit; font-size: 16px")} />
            <span style={css("font-size: 12px; color: #8E8E93")}>Today, Sat Oct 17</span>
          </label>
          <div style={css("display: flex; flex-direction: column; gap: 6px")}>
            <span id="len" style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Length</span>
            <div role="radiogroup" aria-labelledby="len" style={css("display: flex; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
              {LENGTHS.map((len) => {
        const on = len.days === days;
        return (
          <button key={len.days} type="button" role="radio" aria-checked={on} onClick={() => setDays(len.days)} style={on ? css("flex: 1; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer") : css("flex: 1; height: 44px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer")}>{len.label}</button>
        );
      })}
            </div>
          </div>
          <div style={css("display: flex")}>
              <label style={css("flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 6px")}>
                <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Reason</span>
                <span style={css("position: relative; display: block")}>
                  <select ref={reasonRef} value={reason} onChange={(e) => { e.target.setCustomValidity(""); setReason(e.target.value); }} style={css("width: 100%; height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 36px 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px; appearance: none; -webkit-appearance: none")}><option value="">Select reason</option><option>Travel</option><option>Injury</option><option>Work</option><option>Other</option></select>
                  <span style={css("position: absolute; right: 12px; top: 0; bottom: 0; display: flex; align-items: center; pointer-events: none; color: #8E8E93")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="m6 9 6 6 6-6"></path></svg></span>
                </span>
              </label>
          </div>
          <label style={css("display: flex; flex-direction: column; gap: 6px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Note</span>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional, for the owner" autoComplete="off" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px")} />
            </label>
        </form>

        <section aria-label="Coverage preview" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Preview</span>
          <span style={css("font-size: 18px; line-height: 1.2; font-weight: 800; font-stretch: 105%")}>Coverage moves from {fmt(current)} to {fmt(moved)}</span>
          <div role="img" aria-label={`Frozen ${days} days from ${fmt(startDate)}, then coverage resumes through ${fmt(moved)}`} style={css("display: flex; gap: 2px; height: 2px")}>
            <span style={css(`flex: ${days} 1 0; background: #64D2FF`)}></span>
            <span style={css(`flex: ${remaining} 1 0; background: #FFFFFF`)}></span>
          </div>
          <div style={css("display: flex; justify-content: space-between; gap: 12px; font-size: 11px; color: #8E8E93; font-variant-numeric: tabular-nums")}><span>{fmt(startDate)}</span><span>{fmt(freezeEnd)}</span><span>{fmt(moved)}</span></div>
          <div style={css("display: flex; align-items: center; gap: 8px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #A1A1AA")}>Status during freeze <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64D2FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><line x1="10" x2="10" y1="15" y2="9"></line><line x1="14" x2="14" y1="15" y2="9"></line></svg><span style={css("font-weight: 700; color: #64D2FF")}>Frozen</span></div>
        </section>

        <div style={css("margin-top: 12px; padding-bottom: 130px; display: flex; flex-direction: column; gap: 8px")}>
          <div style={css("display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06)")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0; margin-top: 1px")}><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg><span style={css("font-size: 13px; line-height: 1.45; color: #A1A1AA")}><span style={css("color: #FFFFFF; font-weight: 700")}>Approval.</span> Backdated freezes need owner approval.</span></div>
          <div style={css("display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06)")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0; margin-top: 1px")}><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg><span style={css("font-size: 13px; line-height: 1.45; color: #A1A1AA")}><span style={css("color: #FFFFFF; font-weight: 700")}>Online only.</span> Freezes are not allowed while the desk is offline.</span></div>
        </div>
    </PhoneScreen>
  );
}
