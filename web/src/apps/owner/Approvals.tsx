// Port of design/canvas/Owner-Approvals.dc.html. The segmented filter is interactive;
// Approve and Reject move a waiting item to the resolved section (local state only,
// the demo store has no approval queue yet).

import { useEffect, useRef, useState } from 'react';
import { css } from '../../lib/css';
import { useDemo } from '../../demo/store';
import { OwnerShell } from './OwnerShell';

type Filter = 'All' | 'Voids' | 'Corrections' | 'Backdated freezes';
const FILTERS: Filter[] = ['All', 'Voids', 'Corrections', 'Backdated freezes'];

interface Waiting {
  id: string;
  group: Exclude<Filter, 'All'>;
  kind: string;
  subject: string;
  body: string;
  by: string;
  when: string;
  amount?: string;
  rejectLabel: string;
}

interface Resolved {
  id: string;
  title: string;
  note: string;
  outcome: string;
}

const WAITING: Waiting[] = [
  {
    id: 'void-jessa',
    group: 'Voids',
    kind: 'Void',
    subject: 'Jessa Lim, walk-in',
    body: 'GCash reference ending in 4402 was entered twice. Void the duplicate walk-in payment and keep the first.',
    by: 'Ana R.',
    when: 'Today, 6:41 PM',
    amount: 'PHP [WALK-IN]',
    rejectLabel: 'Reject void',
  },
  {
    id: 'correction-den',
    group: 'Corrections',
    kind: 'Correction',
    subject: 'Den Villanueva',
    body: 'Renewal date was keyed wrongly. It should chain from Oct 15, the day after the Oct 14 end date, so the new period runs Oct 15 to Nov 14.',
    by: 'Ana R.',
    when: 'Today, 6:22 PM',
    rejectLabel: 'Reject correction',
  },
  {
    id: 'freeze-bea',
    group: 'Backdated freezes',
    kind: 'Backdated freeze',
    subject: 'Bea Navarro',
    body: 'Freeze starting Oct 10, medical reason. Member was away from the gym and has a note from her doctor.',
    by: 'Ana R.',
    when: 'Today, 4:50 PM',
    rejectLabel: 'Reject backdated freeze',
  },
];

const RESOLVED: Resolved[] = [
  { id: 'r1', title: 'Void, Rhea Mendoza', note: 'Maya payment entered twice, duplicate removed', outcome: 'Approved by Lex, 9:15 AM' },
  { id: 'r2', title: 'Correction, Carlo Dizon', note: 'Start date fixed from Oct 8 to Oct 7', outcome: 'Approved by Lex, 11:40 AM' },
];

export function Approvals() {
  const { state, dispatch } = useDemo();
  const [filter, setFilter] = useState<Filter>('All');
  const [waiting, setWaiting] = useState<Waiting[]>(WAITING);
  const [resolved, setResolved] = useState<Resolved[]>(RESOLVED);
  const [leaving, setLeaving] = useState<string | null>(null);
  const leaveTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    };
  }, []);

  function resolve(item: Waiting, verdict: 'Approved' | 'Rejected') {
    if (leaving || !waiting.some((w) => w.id === item.id)) return;
    dispatch({ type: 'logAudit', action: `${verdict} ${item.kind}`, target: item.subject, detail: item.body });
    setLeaving(item.id);
    leaveTimer.current = window.setTimeout(() => {
      setWaiting((list) => list.filter((w) => w.id !== item.id));
      setResolved((list) => [
        ...list,
        { id: item.id, title: `${item.kind}, ${item.subject}`, note: item.body, outcome: `${verdict} by Lex, ${state.time}` },
      ]);
      setLeaving(null);
    }, 260);
  }

  const shown = waiting.filter((w) => filter === 'All' || w.group === filter);

  return (
    <OwnerShell>
      <main style={css("display: flex; flex-direction: column; gap: 16px")}>
        <div style={css("display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px")}>
          <div style={css("display: flex; flex-direction: column; gap: 6px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>{waiting.length} waiting</span>
            <h1 style={css("margin: 0; font-size: 28px; font-weight: 800; font-stretch: 110%")}>Approvals queue</h1>
          </div>
          <div role="radiogroup" aria-label="Filter approvals" style={css("display: flex; flex-wrap: wrap; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06); max-width: 100%; box-sizing: border-box")}>
            {FILTERS.map((f) =>
              f === filter ? (
                <button key={f} type="button" role="radio" aria-checked="true" onClick={() => setFilter(f)} style={css("flex: 1 1 auto; height: 44px; padding: 0 16px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer")}>{f}</button>
              ) : (
                <button key={f} type="button" role="radio" aria-checked="false" onClick={() => setFilter(f)} style={css("flex: 1 1 auto; height: 44px; padding: 0 16px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer")}>{f}</button>
              ),
            )}
          </div>
        </div>
        <ul className="stagger" style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px")}>
          {shown.map((item) => (
            <li key={item.id} className={leaving === item.id ? 'approval-leave' : undefined} style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 18px 20px; display: flex; flex-wrap: wrap; gap: 16px 24px; align-items: center")}>
              <div style={css("flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 12px")}>
                <div style={css("display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px")}>
                  <span style={css("font-size: 17px; font-weight: 800")}>{item.kind}</span>
                  <span style={css("font-size: 15px; color: #FFFFFF")}>{item.subject}</span>
                </div>
                <p style={css("margin: 0; font-size: 14px; line-height: 1.5; color: #A1A1AA")}>{item.body}</p>
                <div style={css("display: flex; flex-wrap: wrap; gap: 12px 28px")}>
                  <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
                    <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Requested by</span>
                    <span style={css("font-size: 14px; ")}>{item.by}</span>
                  </div>
                  <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
                    <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>When</span>
                    <span style={css("font-size: 14px; ")}>{item.when}</span>
                  </div>
                  {item.amount && (
                    <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
                      <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Amount</span>
                      <span style={css("font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums")}>{item.amount}</span>
                    </div>
                  )}
                </div>
              </div>
              <div style={css("display: flex; flex-wrap: wrap; gap: 10px; flex: 0 1 auto")}>
                <button onClick={() => resolve(item, "Approved")} type="button" style={css("height: 44px; padding: 0 20px; border: 0; border-radius: 14px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 14px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; text-decoration: none; min-width: 120px")}>Approve</button>
                <button onClick={() => resolve(item, "Rejected")} type="button" aria-label={item.rejectLabel} style={css("height: 44px; padding: 0 18px; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; min-width: 120px")}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
        <section aria-label="Resolved" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Resolved today</span>
          <ul style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
            {resolved.map((r) => (
              <li key={r.id} style={css("display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 16px; min-height: 56px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
                  <span style={css("font-size: 14px; font-weight: 600; color: #A1A1AA")}>{r.title}</span>
                  <span style={css("font-size: 13px; color: #8E8E93")}>{r.note}</span>
                </div>
                <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; color: #8E8E93")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                    <circle cx="12" cy="12" r="10"></circle>
                    {r.outcome.startsWith('Approved') ? (
                      <path d="m9 12 2 2 4-4"></path>
                    ) : (
                      <>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                      </>
                    )}
                  </svg>
                  {r.outcome}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </OwnerShell>
  );
}
