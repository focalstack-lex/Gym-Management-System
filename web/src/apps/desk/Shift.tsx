// Desk-Mobile-Shift: the outgoing attendant's blind drawer count. The expected total is never shown.

import { Link } from 'react-router-dom';
import { css } from '../../lib/css';
import { PhoneScreen } from '../../components/PhoneScreen';
import { sheetCounts } from '../../demo/state';
import { useDemo } from '../../demo/store';
import { useDrawerDraft } from './_drawer';

const LABELS = ['1,000', '500', '200', '100', '50', '20', 'Coins, PHP'];
const ARIA = [
  'Count of 1,000 peso bills',
  'Count of 500 peso bills',
  'Count of 200 peso bills',
  'Count of 100 peso bills',
  'Count of 50 peso bills',
  'Count of 20 peso bills',
  'Total value of coins in whole pesos',
];

export function Shift() {
  const { state } = useDemo();
  const drawer = useDrawerDraft();
  const counts = sheetCounts(state);
  return (
    <PhoneScreen
      padding="52px 16px 0"
      bottomInset={170}
      bars={
  <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 16px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 12px")}>
    <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}>
      <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Ana's count, PHP</span>
      <span key={drawer.locked ? 'locked' : 'open'} className="count-roll" style={css("font-size: 30px; line-height: 1; font-weight: 800; font-stretch: 115%; font-variant-numeric: tabular-nums")}>{drawer.whole}<span style={css("font-size: 16px; font-weight: 600; color: #8E8E93")}>.{drawer.cents}</span></span>
    </div>
    <button type="button" disabled={drawer.locked} onClick={drawer.lock} style={css("height: 54px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg className={drawer.locked ? 'padlock-snap' : undefined} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Lock my count</button>
  </div>
      }
    >
  <header style={css("display: flex; align-items: center; gap: 12px")}>
    <Link to="/desk/checkin" aria-label="Back to check-in" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
    <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
      <h1 style={css("margin: 0; font-size: 20px; font-weight: 800")}>Hand over shift</h1>
      <span style={css("font-size: 12px; color: #8E8E93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>{`Ana R. to Joel M., ${counts.checkIns} in, ${counts.walkIns} walk-ins`}</span>
    </div>
  </header>

  <ol aria-label="Handover steps" style={css("list-style: none; margin: 16px 0 0; padding: 0; display: flex; align-items: center; gap: 8px")}>
    <li aria-current="step" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; white-space: nowrap")}><span style={css("width: 22px; height: 22px; box-sizing: border-box; border-radius: 50%; border: 1px solid #FF6A00; color: #FF6A00; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800")}>1</span>Ana counts</li>
    <li aria-hidden="true" style={css("flex: 1; height: 1px; background: rgba(255,255,255,0.12)")}></li>
    <li style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #8E8E93; white-space: nowrap")}><span style={css("width: 22px; height: 22px; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 11px")}>2</span>Joel</li>
    <li aria-hidden="true" style={css("flex: 1; height: 1px; background: rgba(255,255,255,0.12)")}></li>
    <li style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #8E8E93; white-space: nowrap")}><span style={css("width: 22px; height: 22px; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 11px")}>3</span>Reconcile</li>
  </ol>

  <section aria-label="Blind drawer count" style={css("margin-top: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px 6px")}>
    <div style={css("display: flex; align-items: center; gap: 8px; padding-bottom: 10px; font-size: 12px; color: #A1A1AA")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>System total stays hidden until Ana and Joel both lock their counts
    </div>
    <div style={css("display: grid; grid-template-columns: minmax(0, 1fr) 84px minmax(0, 1fr); gap: 12px; padding-bottom: 6px; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
      <span>Bill</span><span style={css("text-align: center")}>Count</span><span style={css("text-align: right")}>Subtotal</span>
    </div>
    {drawer.rows.map((r, i) => (
      <label key={LABELS[i]} style={css("display: grid; grid-template-columns: minmax(0, 1fr) 84px minmax(0, 1fr); gap: 12px; align-items: center; min-height: 52px; border-top: 1px solid rgba(255,255,255,0.06)")}><span style={css("font-size: 15px; font-weight: 600; white-space: nowrap")}>{LABELS[i]}</span><input ref={r.setRef} type="text" inputMode="numeric" pattern="[0-9]*" enterKeyHint={i === LABELS.length - 1 ? 'done' : 'next'} value={r.text} onChange={(e) => r.onChange(e.target.value)} onKeyDown={r.onKeyDown} disabled={drawer.locked} aria-label={ARIA[i]} style={i === LABELS.length - 1 ? css("height: 44px; box-sizing: border-box; border: 1px solid #FF6A00; border-radius: 12px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 17px; font-weight: 800; text-align: center") : css("height: 44px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 17px; font-weight: 800; text-align: center")} /><span style={css("text-align: right; font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums")}>{r.subtotal}</span></label>
    ))}
  </section>

  <p style={css("margin: 10px 4px 0; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 4v7a4 4 0 0 1-4 4H4"></path><path d="m9 10-5 5 5 5"></path></svg>Number pad only. Return jumps to the next bill, 1,000 down to coins.</p>
    </PhoneScreen>
  );
}
