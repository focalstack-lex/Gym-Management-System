// Desk-Mobile-Walkin: record a walk-in visitor with the payment mode and e-wallet reference.

import type { FormEvent } from 'react';
import { css } from '../../lib/css';
import { Link } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { sheetCounts } from '../../demo/state';
import { useDemo } from '../../demo/store';
import { DeskTabBar } from './DeskTabBar';
import { MODE_LABEL, useWalkInForm } from './_walkin';

const MODES = [
  { key: 'cash', label: 'Cash' },
  { key: 'gcash', label: 'GCash' },
  { key: 'maya', label: 'Maya' },
] as const;

// Walk-ins recorded before the demo sheet starts, shown after the live ones.
const EARLIER_WALKINS = [{ id: 'earlier-paul', time: '5:52 PM', name: 'Paul Garcia', pay: 'Cash' }];

export function Walkin() {
  const { state } = useDemo();
  const walk = useWalkInForm();
  const counts = sheetCounts(state);
  const rows = [
    ...state.signIns
      .filter((s) => s.kind === 'walkin')
      .map((s) => ({ id: s.id, time: s.time, name: s.name, pay: s.payment ? (s.payment.reference ? `${MODE_LABEL[s.payment.mode]} ${s.payment.reference}` : MODE_LABEL[s.payment.mode]) : '' })),
    ...EARLIER_WALKINS,
  ].slice(0, 4);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    walk.submit();
  };
  return (
    <PhoneScreen padding="52px 16px 0" bottomInset={120} bars={<DeskTabBar active="walkin" />}>
  <header style={css("display: flex; align-items: flex-end; justify-content: space-between; gap: 12px")}>
    <div style={css("display: flex; flex-direction: column; gap: 4px")}>
      <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Saturday, Oct 17</span>
      <h1 style={css("margin: 0; font-size: 26px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em")}>Walk-in</h1>
    </div>
    <span style={css("font-size: 13px; color: #8E8E93; padding-bottom: 4px; font-variant-numeric: tabular-nums")}><span style={css("font-size: 20px; font-weight: 800; color: #FFFFFF")}>{counts.walkIns}</span> today</span>
  </header>

  <form aria-label="Record walk-in" onSubmit={submit} style={css("margin-top: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px")}>
    <label style={css("display: flex; flex-direction: column; gap: 6px")}>
      <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Visitor name</span>
      <input type="text" autoComplete="off" value={walk.name} onChange={(e) => walk.setName(e.target.value)} placeholder="First and last name" style={css("height: 48px; box-sizing: border-box; border: 1px solid #FF6A00; border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 16px")} />
    </label>
    <div style={css("display: flex; flex-direction: column; gap: 6px")}>
      <span id="pay-mode" style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Payment</span>
      <div role="radiogroup" aria-labelledby="pay-mode" style={css("display: flex; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
        {MODES.map(({ key, label }) => (
          <button key={key} type="button" role="radio" aria-checked={walk.mode === key} onClick={() => walk.setMode(key)} style={walk.mode === key ? css("flex: 1; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer") : css("flex: 1; height: 44px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer")}>{label}</button>
        ))}
      </div>
    </div>
    {walk.mode !== 'cash' && (
    <label style={css("display: flex; flex-direction: column; gap: 6px")}>
      <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>{`${MODE_LABEL[walk.mode]} reference no.`}</span>
      <input type="text" inputMode="numeric" value={walk.reference} onChange={(e) => walk.setReference(e.target.value)} placeholder="13 digits" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 16px; letter-spacing: 0.06em")} />
    </label>
    )}
    <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06)")}>
      <span style={css("font-size: 14px; color: #8E8E93")}>Walk-in rate</span>
      <span style={css("font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums")}>PHP [RATE]</span>
    </div>
    {walk.error && <span role="alert" style={css("font-size: 12px; color: #FF6961")}>{walk.error}</span>}
    <button type="submit" style={css("height: 56px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer")}>Record walk-in</button>
  </form>

  <Link to="/desk/convert" style={css("margin-top: 12px; text-decoration: none; color: #FFFFFF; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; gap: 12px")}>
    <span style={css("width: 36px; height: 36px; flex-shrink: 0; box-sizing: border-box; border-radius: 10px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #8E8E93; display: flex; align-items: center; justify-content: center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg></span>
    <span style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0")}>
      <span style={css("font-size: 14px; font-weight: 700")}>Convert to membership</span>
      <span style={css("font-size: 12px; color: #8E8E93")}>Today's walk-in fee counts toward a plan</span>
    </span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
  </Link>

  <section aria-label="Today's walk-ins" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 12px 16px 4px")}>
    <span style={css("display: block; padding-bottom: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Latest</span>
    <ol style={css("list-style: none; margin: 0; padding: 0")}>
      {rows.map((r) => (
        <li key={r.id} className="row-in" style={css("display: flex; align-items: center; gap: 10px; min-height: 44px; border-top: 1px solid rgba(255,255,255,0.06); white-space: nowrap")}><span style={css("width: 58px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8E93")}>{r.time}</span><span style={css("flex-grow: 1; font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis")}>{r.name}</span><span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #A1A1AA")}>{r.pay}</span></li>
      ))}
    </ol>
  </section>
    </PhoneScreen>
  );
}
