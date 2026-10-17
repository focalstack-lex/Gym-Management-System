// Port of design/canvas/Desk-Mobile-Convert.dc.html. The canvas shows bracketed price tokens
// (PHP [MONTHLY] and so on) because the plan prices are not final; they are kept as drawn.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { parts } from '../../domain/dates';
import type { IsoDate } from '../../domain/dates';
import { periodEnd } from '../../domain/coverage';
import type { PaymentMode } from '../../demo/seed';
import { nextMemberCode } from '../../demo/state';
import { useDemo } from '../../demo/store';
import { css } from '../../lib/css';
import { newActivationCode } from './_qr';

const PLANS = [
  { key: 'monthly', name: 'Monthly', sub: 'Oct 17 to Nov 16', price: 'PHP [MONTHLY]', ends: 'Oct 17 to Nov 16.' },
  { key: 'three', name: '3-month', sub: 'Oct 17 to Jan 16', price: 'PHP [3-MONTH]', ends: 'Oct 17 to Jan 16.' },
  { key: 'student', name: 'Student monthly', sub: 'Valid student ID required', price: 'PHP [STUDENT]', ends: 'Oct 17 to Nov 16.' },
];

const PAYMENTS = [
  { key: 'cash', label: 'Cash' },
  { key: 'gcash', label: 'GCash' },
  { key: 'maya', label: 'Maya' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayLabel = (date: IsoDate) => {
  const p = parts(date);
  return `${MONTHS[p.month - 1]} ${p.day}`;
};

const MONTHS_BY_PLAN: Record<string, number> = { monthly: 1, three: 3, student: 1 };

export default function Convert() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [plan, setPlan] = useState('monthly');
  const [mode, setMode] = useState('gcash');
  const [error, setError] = useState('');
  const chosen = PLANS.find((p) => p.key === plan) ?? PLANS[0];
  const walkIn = state.signIns.find((s) => s.kind === 'walkin');

  const convert = () => {
    if (!walkIn) {
      setError('No walk-in recorded today to convert.');
      return;
    }
    if (!state.online) {
      setError('Conversion takes payment, so it is not available offline.');
      return;
    }
    setError('');
    const months = MONTHS_BY_PLAN[plan] ?? 1;
    const end = periodEnd(state.today, months);
    const memberCode = nextMemberCode(state);
    dispatch({ type: 'convertWalkIn', signInId: walkIn.id, plan: chosen.name, months, mode: mode as PaymentMode });
    navigate('/desk/enroll/activation', {
      state: {
        name: walkIn.name,
        memberCode,
        activationCode: newActivationCode(),
        coverageLabel: `Paid, ${chosen.name}, ${dayLabel(state.today)} to ${dayLabel(end)}`,
      },
    });
  };

  return (
    <PhoneScreen
      padding="52px 16px 0"
      bottomInset={0}
      bars={
        <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 16px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 0px")}>
            {error && <span role="alert" style={css("padding-bottom: 8px; font-size: 12px; color: #FF6961; text-align: center")}>{error}</span>}
            <button type="button" onClick={convert} style={css("height: 54px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer")}>Convert and enroll</button>
          </div>
      }
    >
      <header style={css("display: flex; align-items: center; gap: 12px")}>
          <Link to="/desk/walkin" aria-label="Back to walk-in" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="m15 18-6-6 6-6"></path></svg></Link>
          <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
            <h1 style={css("margin: 0; font-size: 20px; font-weight: 800")}>Convert to member</h1>
            <span role="status" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93; white-space: nowrap")}><span style={css("width: 6px; height: 6px; border-radius: 50%; background: #30D158")}></span>Online, Ana R. on shift</span>
          </div>
        </header>

        <section aria-label="Walk-in" style={css("margin-top: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: flex; align-items: center; gap: 12px")}>
          <div style={css("width: 48px; height: 48px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>JL</div>
          <div style={css("display: flex; flex-direction: column; gap: 3px; min-width: 0; flex-grow: 1")}>
            <span style={css("font-size: 17px; font-weight: 800; font-stretch: 105%")}>{walkIn?.name ?? 'Jessa Lim'}</span>
            <span style={css("font-size: 12px; color: #8E8E93")}>Walked in today <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px")}>6:38 PM</span></span>
            <span style={css("font-size: 12px; color: #8E8E93")}>Paid PHP [WALK-IN] by GCash, ref ending <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px")}>4402</span></span>
          </div>
        </section>

        <section aria-label="Plan" style={css("margin-top: 12px")}>
          <span style={css("display: block; padding: 0 2px 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Plan</span>
          <div role="radiogroup" aria-label="Plan" style={css("display: flex; flex-direction: column; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden")}>
              {PLANS.map((p, i) => {
        const on = p.key === plan;
        const row = i === 0
          ? css("display: flex; align-items: center; gap: 12px; width: 100%; min-height: 64px; padding: 0 14px; border: 0; border-top: 0; background: transparent; color: #FFFFFF; font-family: inherit; text-align: left; cursor: pointer")
          : css("display: flex; align-items: center; gap: 12px; width: 100%; min-height: 64px; padding: 0 14px; border: 0; border-top: 1px solid rgba(255,255,255,0.06); background: transparent; color: #FFFFFF; font-family: inherit; text-align: left; cursor: pointer");
        return (
          <button key={p.key} type="button" role="radio" aria-checked={on} onClick={() => setPlan(p.key)} style={row}>
            <span style={on ? css("width: 18px; height: 18px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 1.5px solid #FF6A00; display: flex; align-items: center; justify-content: center") : css("width: 18px; height: 18px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 1.5px solid #3F3F46; display: flex; align-items: center; justify-content: center")}><span style={on ? css("width: 8px; height: 8px; border-radius: 50%; background: #FF6A00") : css("width: 8px; height: 8px; border-radius: 50%; background: transparent")}></span></span>
            <span style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0")}><span style={css("font-size: 15px; font-weight: 700")}>{p.name}</span><span style={css("font-size: 12px; color: #8E8E93")}>{p.sub}</span></span>
            <span style={css("font-size: 14px; font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap")}>{p.price}</span>
          </button>
        );
      })}
          </div>
        </section>

        <section aria-label="Breakdown" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px")}>
          <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}><span style={css("font-size: 14px; color: #A1A1AA; ")}>Plan price</span><span style={css("font-size: 15px; font-weight: 700; color: #FFFFFF; font-variant-numeric: tabular-nums")}>PHP [PRICE]</span></div>
          <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}><span style={css("font-size: 14px; color: #A1A1AA; ")}>Today's walk-in credit</span><span style={css("font-size: 15px; font-weight: 700; color: #FFFFFF; font-variant-numeric: tabular-nums")}>minus PHP [WALK-IN]</span></div>
          <div style={css("padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06)")}><div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}><span style={css("font-size: 14px; color: #FFFFFF; font-weight: 700")}>Amount due now</span><span style={css("font-size: 22px; font-weight: 800; color: #FFFFFF; font-variant-numeric: tabular-nums")}>PHP [DUE]</span></div></div>
          <div style={css("display: flex; align-items: flex-start; gap: 8px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 13px; line-height: 1.4; color: #A1A1AA")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0; margin-top: 1px")}><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg><span><span style={css("color: #FFFFFF; font-weight: 700; font-variant-numeric: tabular-nums")}>{chosen.ends}</span> Starts today, since this is a new member.</span></div>
        </section>

        <div style={css("margin-top: 12px")}><div style={css("display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06)")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0; margin-top: 1px")}><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg><span style={css("font-size: 13px; line-height: 1.45; color: #A1A1AA")}><span style={css("color: #FFFFFF; font-weight: 700")}>Same day only.</span> Conversion must happen the same day as the walk-in. After midnight, the credit is gone.</span></div></div>

        <div style={css("margin-top: 12px; padding-bottom: 130px")}>
          <div style={css("display: flex; flex-direction: column; gap: 6px")}>
            <span id="paymode" style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Payment</span>
            <div role="radiogroup" aria-labelledby="paymode" style={css("display: flex; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
              {PAYMENTS.map((m) => {
        const on = m.key === mode;
        return (
          <button key={m.key} type="button" role="radio" aria-checked={on} onClick={() => setMode(m.key)} style={on ? css("flex: 1; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer") : css("flex: 1; height: 44px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer")}>{m.label}</button>
        );
      })}
            </div>
          </div>
        </div>
    </PhoneScreen>
  );
}
