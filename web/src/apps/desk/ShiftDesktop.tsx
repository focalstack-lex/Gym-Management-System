// Desk-Shift: the desk station layout (1024px and wider) of the outgoing attendant's blind drawer count.

import { Link } from 'react-router-dom';
import { css } from '../../lib/css';
import { sheetCounts } from '../../demo/state';
import { useDemo } from '../../demo/store';
import { useDrawerDraft } from './_drawer';

const LABELS = ['PHP 1,000', 'PHP 500', 'PHP 200', 'PHP 100', 'PHP 50', 'PHP 20', 'Coins, total'];
const ARIA = [
  'Count of 1,000 peso bills',
  'Count of 500 peso bills',
  'Count of 200 peso bills',
  'Count of 100 peso bills',
  'Count of 50 peso bills',
  'Count of 20 peso bills',
  'Total value of coins in pesos',
];

export function ShiftDesktop() {
  const { state } = useDemo();
  const drawer = useDrawerDraft();
  const counts = sheetCounts(state);
  return (
    <>
<div className="screen-enter" style={css("min-height: 980px; box-sizing: border-box; background: #0C0C0E; color: #FFFFFF; font-family: 'Archivo', system-ui, sans-serif; padding: 20px 16px 32px")}>
<div style={css("max-width: 1440px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px")}>

  <header style={css("display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; padding: 10px 14px 10px 10px; border-radius: 20px; background: #17171A; border: 1px solid rgba(255,255,255,0.06)")}>
    <Link to="/desk/checkin" aria-label="Back to check-in" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
    <div style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 200px")}>
      <h1 style={css("margin: 0; font-size: 20px; font-weight: 800")}>Hand over shift</h1>
      <span style={css("font-size: 12px; color: #8E8E93")}>Ana R. to Joel M., Saturday, Oct 17</span>
    </div>
    <ol aria-label="Handover steps" style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 10px")}>
      <li aria-current="step" style={css("display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #FFFFFF")}><span style={css("width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; border: 1px solid #FF6A00; color: #FF6A00; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800")}>1</span>Ana counts</li>
      <li aria-hidden="true" style={css("width: 24px; height: 1px; background: rgba(255,255,255,0.12)")}></li>
      <li style={css("display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #8E8E93")}><span style={css("width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700")}>2</span>Joel counts</li>
      <li aria-hidden="true" style={css("width: 24px; height: 1px; background: rgba(255,255,255,0.12)")}></li>
      <li style={css("display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #8E8E93")}><span style={css("width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700")}>3</span>Reconcile</li>
    </ol>
  </header>

  <div style={css("display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start")}>

    <main style={css("flex: 999 1 560px; min-width: 0; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 18px")}>
      <div style={css("display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 20px")}>
        <div style={css("display: flex; flex-direction: column; gap: 6px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Blind drawer count</span>
          <h2 style={css("margin: 0; font-size: 28px; font-weight: 800; font-stretch: 110%")}>Ana, count the cash drawer</h2>
        </div>
        <span style={css("display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #A1A1AA")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>Expected total stays hidden until both counts are in</span>
      </div>

      <div style={css("display: grid; grid-template-columns: minmax(0, 1fr) 112px minmax(0, 1fr); gap: 8px 14px; align-items: center; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; padding: 0 4px")}>
        <span>Denomination</span><span style={css("text-align: center")}>Count</span><span style={css("text-align: right")}>Subtotal</span>
      </div>

      <div style={css("display: flex; flex-direction: column")}>
        {drawer.rows.map((r, i) => {
          const coins = i === LABELS.length - 1;
          return (
            <label key={LABELS[i]} style={coins ? css("display: grid; grid-template-columns: minmax(0, 1fr) 112px minmax(0, 1fr); gap: 14px; align-items: center; min-height: 60px; padding: 0 4px; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06)") : css("display: grid; grid-template-columns: minmax(0, 1fr) 112px minmax(0, 1fr); gap: 14px; align-items: center; min-height: 60px; padding: 0 4px; border-top: 1px solid rgba(255,255,255,0.06)")}><span style={css("font-size: 17px; font-weight: 600")}>{LABELS[i]}</span><input ref={r.setRef} type="text" inputMode={coins ? 'decimal' : 'numeric'} value={r.text} onChange={(e) => r.onChange(e.target.value)} onKeyDown={r.onKeyDown} disabled={drawer.locked} aria-label={ARIA[i]} style={coins ? css("height: 48px; box-sizing: border-box; border: 1px solid #FF6A00; border-radius: 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 18px; font-weight: 800; text-align: center") : css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 18px; font-weight: 800; text-align: center")} /><span style={css("text-align: right; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums")}>{r.subtotal}</span></label>
          );
        })}
      </div>

      <div style={css("display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; border-radius: 18px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06)")}>
        <div style={css("display: flex; flex-direction: column; gap: 6px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Ana's count</span>
          <span key={drawer.locked ? 'locked' : 'open'} className="count-roll" style={css("font-size: 44px; line-height: 1; font-weight: 800; font-stretch: 118%; font-variant-numeric: tabular-nums")}>{drawer.whole}<span style={css("font-size: 20px; font-weight: 600; color: #8E8E93")}>.{drawer.cents} PHP</span></span>
        </div>
        <button type="button" disabled={drawer.locked} onClick={drawer.lock} style={css("flex: 0 1 280px; height: 60px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 17px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer")}>
          <svg className={drawer.locked ? 'padlock-snap' : undefined} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Lock my count
        </button>
      </div>
    </main>

    <aside style={css("flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>
      <section aria-label="Shift activity" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 4px")}>
        <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; margin-bottom: 8px")}>Ana's shift, 6:00 AM to now</span>
        <div style={css("display: flex; align-items: center; justify-content: space-between; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}><span style={css("font-size: 14px; color: #A1A1AA")}>Check-ins</span><span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>{counts.checkIns}</span></div>
        <div style={css("display: flex; align-items: center; justify-content: space-between; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}><span style={css("font-size: 14px; color: #A1A1AA")}>Walk-ins</span><span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>{counts.walkIns}</span></div>
        <div style={css("display: flex; align-items: center; justify-content: space-between; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}><span style={css("font-size: 14px; color: #A1A1AA")}>Renewals</span><span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>3</span></div>
        <div style={css("display: flex; align-items: center; justify-content: space-between; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}><span style={css("font-size: 14px; color: #A1A1AA")}>New enrollments</span><span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>1</span></div>
        <div style={css("display: flex; align-items: center; justify-content: space-between; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}><span style={css("font-size: 14px; color: #A1A1AA")}>E-wallet references logged</span><span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>6</span></div>
        <span style={css("font-size: 12px; line-height: 1.5; color: #8E8E93; margin-top: 8px")}>Counts only. Peso amounts appear after both attendants lock their counts.</span>
      </section>

      <section aria-label="Relief attendant" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 16px")}>
        <div style={css("display: flex; align-items: center; gap: 14px")}>
          <div style={css("width: 52px; height: 52px; box-sizing: border-box; border-radius: 16px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #8E8E93; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; font-stretch: 115%")}>JM</div>
          <div style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Relief attendant</span>
            <span style={css("font-size: 17px; font-weight: 700")}>Joel Manalo</span>
          </div>
          <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Waiting</span>
        </div>
        <p style={css("margin: 0; font-size: 14px; line-height: 1.5; color: #A1A1AA")}>After Ana locks her count, Joel signs in with his PIN and counts the same drawer on this screen without seeing her number.</p>
        <button type="button" disabled style={css("height: 52px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 14px; font-weight: 600")}>Relief sign-in opens after step 1</button>
      </section>
    </aside>
  </div>
</div>
</div>
    </>
  );
}
