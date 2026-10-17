// Port of design/canvas/Owner-Audit.dc.html. The canvas rows render below any entries the demo
// store has logged (state.audit), newest first. Search, date range, actor and action filters
// narrow the rows locally.

import { useEffect, useRef, useState } from 'react';
import { css } from '../../lib/css';
import { useDemo } from '../../demo/store';
import { OwnerShell } from './OwnerShell';

interface Row {
  id: string;
  date: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  detail: string;
  device: string;
}

const CANVAS_ROWS: Row[] = [
  { id: 'c0', date: '2026-10-17', time: 'Oct 17, 6:42 PM', actor: 'Ana R.', action: 'Check-in', target: 'Mika Santos', detail: 'Active, 28 days left', device: 'Front desk phone' },
  { id: 'c1', date: '2026-10-17', time: 'Oct 17, 6:41 PM', actor: 'Ana R.', action: 'Void requested', target: 'Jessa Lim', detail: 'GCash ref ending 4402 entered twice, sent for approval', device: 'Front desk tablet' },
  { id: 'c2', date: '2026-10-17', time: 'Oct 17, 6:40 PM', actor: 'Ana R.', action: 'Check-in', target: 'Rhea Mendoza', detail: 'Active', device: 'Front desk phone' },
  { id: 'c3', date: '2026-10-17', time: 'Oct 17, 6:38 PM', actor: 'Ana R.', action: 'Walk-in recorded', target: 'Jessa Lim', detail: 'GCash ref ending 4402, PHP [WALK-IN]', device: 'Front desk tablet' },
  { id: 'c4', date: '2026-10-17', time: 'Oct 17, 6:36 PM', actor: 'Ana R.', action: 'Drawer count locked', target: '-', detail: 'Blind count locked at PHP 5,445.00, expected total hidden', device: 'Front desk tablet' },
  { id: 'c5', date: '2026-10-17', time: 'Oct 17, 6:31 PM', actor: 'Ana R.', action: 'Check-in', target: 'Carlo Dizon', detail: 'Expiring soon, ends Oct 21', device: 'Front desk phone' },
  { id: 'c6', date: '2026-10-17', time: 'Oct 17, 6:25 PM', actor: 'Ana R.', action: 'Entry allowed with reason', target: 'Paolo Reyes', detail: 'Expired Oct 1. Reason: Will pay before leaving', device: 'Front desk phone' },
  { id: 'c7', date: '2026-10-17', time: 'Oct 17, 6:19 PM', actor: 'Ana R.', action: 'Check-in', target: 'Den Villanueva', detail: 'Grace, ended Oct 14', device: 'Front desk phone' },
  { id: 'c8', date: '2026-10-16', time: 'Oct 16, 9:10 PM', actor: 'Lex', action: 'Price version scheduled', target: '-', detail: 'Student monthly, PHP [PRICE] effective Nov 1, 2026', device: 'Owner web' },
  { id: 'c9', date: '2026-10-16', time: 'Oct 16, 5:20 PM', actor: 'Ana R.', action: 'Renewal', target: 'Carlo Dizon', detail: 'Early renewal, chained Oct 22 to Nov 21', device: 'Front desk tablet' },
];

const ACTORS = ['All actors', 'Ana R.', 'Joel M.', 'Coach Ramon', 'Lex'];
const ACTIONS = ['All actions', 'Check-in', 'Walk-in recorded', 'Renewal', 'Entry allowed with reason', 'Drawer count locked', 'Void requested', 'Price version scheduled'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dayLabel(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`;
}

export function Audit() {
  const { state } = useDemo();
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('2026-10-16');
  const [to, setTo] = useState('2026-10-17');
  const [actor, setActor] = useState(ACTORS[0]);
  const [action, setAction] = useState(ACTIONS[0]);
  const [exported, setExported] = useState(false);
  const exportTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (exportTimer.current) window.clearTimeout(exportTimer.current);
    };
  }, []);

  const logged: Row[] = state.audit.map((e) => ({
    id: e.id,
    date: state.today,
    time: `${dayLabel(state.today)}, ${e.time}`,
    actor: e.actor,
    action: e.action,
    target: e.target || '-',
    detail: e.detail,
    device: 'Front desk',
  }));
  const needle = query.trim().toLowerCase();
  const rows = [...logged, ...CANVAS_ROWS].filter((r) => {
    if (from && r.date < from) return false;
    if (to && r.date > to) return false;
    if (actor !== ACTORS[0] && r.actor !== actor) return false;
    if (action !== ACTIONS[0] && r.action !== action) return false;
    if (!needle) return true;
    return [r.time, r.actor, r.action, r.target, r.detail, r.device].join(' ').toLowerCase().includes(needle);
  });

  function exportCsv() {
    const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const header = ['Date', 'Time', 'Actor', 'Action', 'Target', 'Detail', 'Device'];
    const body = rows.map((r) => [r.date, r.time, r.actor, r.action, r.target, r.detail, r.device].map(quote).join(','));
    const csv = [header.map(quote).join(','), ...body].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'infinity-audit.csv';
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    if (exportTimer.current) window.clearTimeout(exportTimer.current);
    exportTimer.current = window.setTimeout(() => setExported(false), 2000);
  }

  return (
    <OwnerShell>
      <main style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px; padding: 24px; border-radius: 24px")}>
        <div style={css("display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 20px")}>
          <div style={css("display: flex; flex-direction: column; gap: 6px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Append-only record</span>
            <h1 style={css("margin: 0; font-size: 28px; font-weight: 800; font-stretch: 110%")}>Audit log</h1>
          </div>
          <button type="button" onClick={exportCsv} aria-pressed={exported} className={exported ? 'export-done' : undefined} style={css("height: 44px; padding: 0 18px; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; ")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
              {exported ? (
                <path d="M20 6 9 17l-5-5"></path>
              ) : (
                <>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </>
              )}
            </svg>
            {exported ? 'Exported' : 'Export CSV'}
          </button>
        </div>
        <div style={css("display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 16px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #A1A1AA")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Entries cannot be edited or deleted.
        </div>
        <form onSubmit={(e) => e.preventDefault()} role="search" aria-label="Audit filters" style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px")}>
          <label style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Search</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Member, reference or detail" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px; width: 100%; min-width: 0")} />
          </label>
          <label style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>From</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px; width: 100%; min-width: 0")} />
          </label>
          <label style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>To</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px; width: 100%; min-width: 0")} />
          </label>
          <label style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Actor</span>
            <select value={actor} onChange={(e) => setActor(e.target.value)} style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px; width: 100%; min-width: 0")}>
              {ACTORS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Action type</span>
            <select value={action} onChange={(e) => setAction(e.target.value)} style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px; width: 100%; min-width: 0")}>
              {ACTIONS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
        </form>
        <div style={css("overflow-x: auto; max-width: 100%")}>
          <table style={css("border-collapse: collapse; width: 100%; min-width: 980px")}>
            <thead>
              <tr>
                <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>Time</th>
                <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>Actor</th>
                <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>Action</th>
                <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>Target member</th>
                <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>Detail</th>
                <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>Device</th>
              </tr>
            </thead>
            <tbody className="stagger">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>{r.time}</span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700")}>{r.actor}</span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>{r.action}</td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>{r.target}</span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>{r.detail}</span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>{r.device}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </OwnerShell>
  );
}
