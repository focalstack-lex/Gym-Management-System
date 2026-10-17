// Port of design/canvas/Member-Pass.dc.html. The pass shows the demo member; the QR pattern
// is the canvas algorithm seeded by the member code (see _qr.ts).

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { useDemo } from '../../demo/store';
import { daysLeft, statusOf } from '../../demo/state';
import { MemberTabBar } from './MemberTabBar';
import { qrCells } from './_qr';
import { STATUS_ICON, STATUS_LABEL, shortDate, signedInMember } from './_status';

// Length of the current Monthly period, Oct 15 to Nov 14.
const PERIOD_DAYS = 31;

export function Pass() {
  const { state } = useDemo();
  const member = signedInMember(state);
  const status = statusOf(state, member);
  const remaining = daysLeft(state, member) ?? 0;
  const validThru = member.coverageEnd ? shortDate(member.coverageEnd) : '';
  const cells = useMemo(() => qrCells(member.code), [member.code]);
  const width = Math.min(100, Math.max(0, (remaining / PERIOD_DAYS) * 100)).toFixed(1);

  async function sharePass() {
    const text = `The Infinity Fitness pass, ${member.code}, ${member.plan}, valid to ${validThru}.`;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Membership pass', text });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Pass share failed', error);
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Pass copy failed', error);
    }
  }

  return (
    <PhoneScreen padding="52px 20px 0" bars={<MemberTabBar active="pass" />}>
      <header style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
        <Link to="/m/today" aria-label="Back to today" style={css("width: 44px; height: 44px; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
        <h1 style={css("margin: 0; font-size: 17px; font-weight: 700")}>Membership pass</h1>
        <button type="button" aria-label="Pass options" onClick={sharePass} style={css("width: 44px; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 50%; background: #17171A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>
      </header>

      <article aria-label="Digital membership pass" style={css("margin-top: 20px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 18px")}>
        <div style={css("display: flex; align-items: center; gap: 12px")}>
          <div style={css("width: 40px; height: 40px; border-radius: 11px; background: #FFFFFF; overflow: hidden; flex-shrink: 0")}>
            <img src="/brand/logo.jpg" alt="" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} />
          </div>
          <div style={css("display: flex; flex-direction: column; gap: 3px; flex-grow: 1")}>
            <span style={css("font-size: 13px; font-weight: 800; font-stretch: 125%; line-height: 1.1")}>THE INFINITY FITNESS</span>
            <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Train Beyond Limits</span>
          </div>
          <div style={css("display: flex; flex-direction: column; align-items: flex-end; gap: 3px")}>
            <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Plan</span>
            <span style={css("font-size: 14px; font-weight: 700")}>{member.plan}</span>
          </div>
        </div>

        <div style={css("display: flex; justify-content: space-between; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <div style={css("display: flex; flex-direction: column; gap: 4px")}>
            <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Member</span>
            <span style={css("font-size: 22px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em")}>{member.name}</span>
          </div>
          <div style={css("display: flex; flex-direction: column; align-items: flex-end; gap: 4px")}>
            <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Valid thru</span>
            <span style={css("font-size: 22px; font-weight: 800; font-stretch: 110%; font-variant-numeric: tabular-nums")}>{validThru}</span>
          </div>
        </div>

        <div style={css("background: #FFFFFF; border-radius: 18px; padding: 18px; display: flex; flex-direction: column; align-items: center; gap: 12px")}>
          <div role="img" aria-label={'Member QR code for ' + member.code} style={css("width: 200px; height: 200px; font-size: 0; line-height: 0; white-space: normal")}>
            {cells.map((on, i) => (
              <span key={i} style={css(`display: inline-block; width: 8px; height: 8px; vertical-align: top; background: ${on ? '#000000' : '#FFFFFF'}`)}></span>
            ))}
          </div>
          <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 500; letter-spacing: 0.12em; color: #000000")}>{member.code}</span>
        </div>

        <div style={css("display: flex; flex-direction: column; gap: 10px")}>
          <div style={css("display: flex; align-items: center; justify-content: space-between; font-size: 13px")}>
            <span style={css("display: inline-flex; align-items: center; gap: 7px; font-weight: 700")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={STATUS_ICON[status]} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>{STATUS_LABEL[status]}</span>
            <span style={css("color: #8E8E93; font-variant-numeric: tabular-nums")}><span style={css("color: #FFFFFF; font-weight: 700")}>{remaining}</span> of 31 days left</span>
          </div>
          <div role="img" aria-label={'Coverage: ' + remaining + ' of ' + PERIOD_DAYS + ' days left'} style={css("height: 2px; background: #3F3F46")}>
            <div style={css(`width: ${width}%; height: 100%; background: #FFFFFF`)}></div>
          </div>
        </div>
      </article>

      <p style={css("margin: 16px 4px 0; font-size: 13px; line-height: 1.5; color: #8E8E93; text-align: center")}>Show this code at the front desk to check in.</p>

      <div style={css("margin-top: 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px")}>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px")}>
          <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Last check-in</span>
          <span style={css("font-size: 15px; font-weight: 700")}>Today, 6:42 PM</span>
        </div>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px")}>
          <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>This month</span>
          <span style={css("font-size: 15px; font-weight: 700")}>12 visits</span>
        </div>
      </div>
    </PhoneScreen>
  );
}
