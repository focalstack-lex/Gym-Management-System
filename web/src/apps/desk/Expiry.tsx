// Desk-Mobile-Expiry: members by expiry bucket (expiring in 7 days, grace, lapsed) with a comeback list.

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { css } from '../../lib/css';
import { PhoneScreen } from '../../components/PhoneScreen';
import type { Member } from '../../demo/seed';
import { daysLeft, statusOf } from '../../demo/state';
import { useDemo } from '../../demo/store';
import type { MembershipStatus } from '../../domain/status';
import { DeskHeader } from './DeskHeader';
import { DeskTabBar } from './DeskTabBar';
import { useNetworkParam } from './_hooks';
import { fmtDay } from './_logic';

type Bucket = 'expiring' | 'grace' | 'lapsed';

interface Note {
  ends: string;
  when: string;
  visit: string;
}

// The lines under each name as drawn on the canvas. Last visit dates are not kept per day in the
// demo data, so these are sample text; a member missing here gets lines computed from the record.
const NOTES: Record<string, Note> = {
  carlo: { ends: 'Ends Oct 21', when: '4 days left', visit: '· Last visit Oct 16' },
  hannah: { ends: 'Ends Oct 18', when: '1 day left', visit: '· Last visit Oct 16' },
  marlon: { ends: 'Ends Oct 19', when: '2 days left', visit: '· Last visit Oct 15' },
  liza: { ends: 'Ends Oct 20', when: '3 days left', visit: '· Last visit Oct 13' },
  gab: { ends: 'Ends Oct 22', when: '5 days left', visit: '· Last visit Oct 14' },
  nina: { ends: 'Ends Oct 23', when: '6 days left', visit: '· Last visit Oct 12' },
  bea: { ends: 'Ended Oct 15', when: 'Grace until Oct 18', visit: '· Last visit Oct 13' },
  den: { ends: 'Ended Oct 14', when: 'Grace until Oct 17', visit: '· Last visit Oct 17' },
  paolo: { ends: 'Ended Oct 1', when: '16 days past end', visit: '· Last visit Sep 29' },
  elena: { ends: 'Ended Oct 5', when: '12 days past end', visit: '· Last visit Oct 3' },
  ramil: { ends: 'Ended Oct 9', when: '8 days past end', visit: '· Last visit Oct 7' },
  joy: { ends: 'Ended Oct 11', when: '6 days past end', visit: '· Last visit Oct 9' },
};

const LAPSED_ORDER = ['paolo', 'elena', 'ramil', 'joy'];
// Lapsed members beyond the demo roster; they are counted but not listed.
const OLDER_LAPSED = 5;
const LAPSED_SHOWN = 4;

const LABEL: Partial<Record<MembershipStatus, string>> = {
  expiring_soon: 'Expiring soon',
  grace: 'Grace',
  expired: 'Expired',
  inactive: 'Inactive',
  dormant: 'Dormant',
};

function noteFor(m: Member, status: MembershipStatus, left: number | null): Note {
  const known = NOTES[m.id];
  if (known) return known;
  const ended = m.coverageEnd ? fmtDay(m.coverageEnd) : '';
  const when = left === null ? '' : status === 'expiring_soon' ? `${left} days left` : `${-left} days past end`;
  return { ends: status === 'expiring_soon' ? `Ends ${ended}` : `Ended ${ended}`, when, visit: `· Last visit ${m.lastVisit}` };
}

function ExRow({ m, first, note, label, nudged, onNudge }: { m: Member; first: boolean; note: Note; label: string; nudged: boolean; onNudge: () => void }) {
  return (
        <li style={first ? css("display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 6px 0; border-top: 0") : css("display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <Link to={`/desk/checkin?member=${m.id}`} style={css("flex: 1 1 auto; min-width: 0; min-height: 52px; display: flex; align-items: center; gap: 12px; color: #FFFFFF; text-decoration: none")}>
            <div style={css("width: 40px; height: 40px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>{m.initials}</div>
            <span style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0; flex-grow: 1")}>
              <span style={css("font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>{m.name}</span>
              <span style={css("display: flex; align-items: center; gap: 6px; font-size: 12px; white-space: nowrap")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span style={css("font-weight: 700; color: #FF6A00")}>{label}</span><span style={css("color: #8E8E93")}>{note.ends}</span></span>
              <span style={css("font-size: 11px; color: #8E8E93; white-space: nowrap; font-variant-numeric: tabular-nums")}><span style={css("color: #A1A1AA; font-weight: 600")}>{note.when}</span> {note.visit}</span>
            </span>
          </Link>
          <button type="button" aria-label={nudged ? `Reminder sent to ${m.name}` : `Send in-app reminder to ${m.name}`} aria-pressed={nudged} disabled={nudged} onClick={onNudge} style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg></button>
        </li>
  );
}

function GrRow({ m, first, note, label, nudged, onNudge }: { m: Member; first: boolean; note: Note; label: string; nudged: boolean; onNudge: () => void }) {
  return (
        <li style={first ? css("display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 6px 0; border-top: 0") : css("display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <Link to={`/desk/checkin?member=${m.id}`} style={css("flex: 1 1 auto; min-width: 0; min-height: 52px; display: flex; align-items: center; gap: 12px; color: #FFFFFF; text-decoration: none")}>
            <div style={css("width: 40px; height: 40px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>{m.initials}</div>
            <span style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0; flex-grow: 1")}>
              <span style={css("font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>{m.name}</span>
              <span style={css("display: flex; align-items: center; gap: 6px; font-size: 12px; white-space: nowrap")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg><span style={css("font-weight: 700; color: #FF6A00")}>{label}</span><span style={css("color: #8E8E93")}>{note.ends}</span></span>
              <span style={css("font-size: 11px; color: #8E8E93; white-space: nowrap; font-variant-numeric: tabular-nums")}><span style={css("color: #A1A1AA; font-weight: 600")}>{note.when}</span> {note.visit}</span>
            </span>
          </Link>
          <button type="button" aria-label={nudged ? `Reminder sent to ${m.name}` : `Send in-app reminder to ${m.name}`} aria-pressed={nudged} disabled={nudged} onClick={onNudge} style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg></button>
        </li>
  );
}

function LaRow({ m, first, note, label, nudged, onNudge }: { m: Member; first: boolean; note: Note; label: string; nudged: boolean; onNudge: () => void }) {
  return (
        <li style={first ? css("display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 6px 0; border-top: 0") : css("display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <Link to={`/desk/checkin?member=${m.id}`} style={css("flex: 1 1 auto; min-width: 0; min-height: 52px; display: flex; align-items: center; gap: 12px; color: #FFFFFF; text-decoration: none")}>
            <div style={css("width: 40px; height: 40px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>{m.initials}</div>
            <span style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0; flex-grow: 1")}>
              <span style={css("font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>{m.name}</span>
              <span style={css("display: flex; align-items: center; gap: 6px; font-size: 12px; white-space: nowrap")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg><span style={css("font-weight: 700; color: #FF6961")}>{label}</span><span style={css("color: #8E8E93")}>{note.ends}</span></span>
              <span style={css("font-size: 11px; color: #8E8E93; white-space: nowrap; font-variant-numeric: tabular-nums")}><span style={css("color: #A1A1AA; font-weight: 600")}>{note.when}</span> {note.visit}</span>
            </span>
          </Link>
          <button type="button" aria-label={nudged ? `Reminder sent to ${m.name}` : `Send in-app reminder to ${m.name}`} aria-pressed={nudged} disabled={nudged} onClick={onNudge} style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg></button>
        </li>
  );
}

const tabVars = (on: boolean) => ({
  sel: on,
  bg: on ? '#1F1F23' : 'transparent',
  fg: on ? '#FFFFFF' : '#8E8E93',
  bd: on ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
});

export function Expiry() {
  const { state, dispatch } = useDemo();
  const [params] = useSearchParams();
  useNetworkParam();
  const initial = params.get('bucket');
  const [bucket, setBucket] = useState<Bucket>(initial === 'grace' || initial === 'lapsed' ? initial : 'expiring');
  const [showAll, setShowAll] = useState(false);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const nudge = (name: string) => {
    if (sent.has(name)) return;
    setSent((prev) => new Set(prev).add(name));
    dispatch({ type: 'logAudit', action: 'Reminder sent', target: name, detail: 'In-app expiry reminder' });
  };
  const rows = state.members.map((m) => ({ m, status: statusOf(state, m), left: daysLeft(state, m) }));
  const expiring = rows.filter((r) => r.status === 'expiring_soon');
  const grace = rows.filter((r) => r.status === 'grace');
  const lapsed = rows
    .filter((r) => r.status === 'expired' || r.status === 'inactive' || r.status === 'dormant')
    .sort((a, b) => (LAPSED_ORDER.indexOf(a.m.id) + 1 || 99) - (LAPSED_ORDER.indexOf(b.m.id) + 1 || 99));
  const shownLapsed = showAll ? lapsed : lapsed.slice(0, LAPSED_SHOWN);
  const moreLapsed = OLDER_LAPSED + lapsed.length - shownLapsed.length;
  const ex = tabVars(bucket === 'expiring');
  const gr = tabVars(bucket === 'grace');
  const la = tabVars(bucket === 'lapsed');
  return (
    <PhoneScreen padding="52px 16px 0" bottomInset={120} bars={<DeskTabBar active="expiry" />}>
      <DeskHeader title="Expiry" heading online={state.online} outbox={state.outbox} />

      <p style={css("margin: 14px 2px 0; font-size: 13px; color: #8E8E93; font-variant-numeric: tabular-nums")}><span style={css("font-size: 17px; font-weight: 800; color: #FFFFFF")}>{expiring.length}</span> expiring, <span style={css("font-size: 17px; font-weight: 800; color: #FFFFFF")}>{grace.length}</span> grace, <span style={css("font-size: 17px; font-weight: 800; color: #FFFFFF")}>{lapsed.length + OLDER_LAPSED}</span> lapsed</p>

  <div role="tablist" aria-label="Expiry bucket" style={css("margin-top: 10px; display: flex; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
    <button type="button" role="tab" aria-selected={ex.sel} onClick={() => setBucket('expiring')} style={css(`flex: 1; min-width: 0; height: 44px; border: ${ex.bd}; border-radius: 11px; background: ${ex.bg}; color: ${ex.fg}; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap`)}>Expiring (7 days)</button>
    <button type="button" role="tab" aria-selected={gr.sel} onClick={() => setBucket('grace')} style={css(`flex: 1; min-width: 0; height: 44px; border: ${gr.bd}; border-radius: 11px; background: ${gr.bg}; color: ${gr.fg}; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap`)}>Grace</button>
    <button type="button" role="tab" aria-selected={la.sel} onClick={() => setBucket('lapsed')} style={css(`flex: 1; min-width: 0; height: 44px; border: ${la.bd}; border-radius: 11px; background: ${la.bg}; color: ${la.fg}; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap`)}>Lapsed</button>
  </div>

  {bucket === 'expiring' && (<>
    <section aria-label="Members list" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 4px 14px")}>
      <ul style={css("list-style: none; margin: 0; padding: 0")}>
      {expiring.map((r, i) => (
        <ExRow key={r.m.id} m={r.m} first={i === 0} note={noteFor(r.m, r.status, r.left)} label={LABEL[r.status] ?? ''} nudged={sent.has(r.m.name)} onNudge={() => nudge(r.m.name)} />
      ))}
      </ul>
    </section>
  </>)}
  {bucket === 'grace' && (<>
    <section aria-label="Members list" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 4px 14px")}>
      <ul style={css("list-style: none; margin: 0; padding: 0")}>
      {grace.map((r, i) => (
        <GrRow key={r.m.id} m={r.m} first={i === 0} note={noteFor(r.m, r.status, r.left)} label={LABEL[r.status] ?? ''} nudged={sent.has(r.m.name)} onNudge={() => nudge(r.m.name)} />
      ))}
      </ul>
    </section>
  </>)}
  {bucket === 'lapsed' && (<>
    <section aria-label="Members list" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 4px 14px")}>
      <ul style={css("list-style: none; margin: 0; padding: 0")}>
      {shownLapsed.map((r, i) => (
        <LaRow key={r.m.id} m={r.m} first={i === 0} note={noteFor(r.m, r.status, r.left)} label={LABEL[r.status] ?? ''} nudged={sent.has(r.m.name)} onNudge={() => nudge(r.m.name)} />
      ))}
      </ul>
      {!showAll && <button type="button" onClick={() => setShowAll(true)} style={css("width: 100%; height: 44px; border: 0; border-top: 1px solid rgba(255,255,255,0.06); background: transparent; color: #FFFFFF; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer")}>{`Show ${moreLapsed} more lapsed`}</button>}
    </section>
  </>)}

  <section aria-label="Comeback" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 14px 4px")}>
    <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-bottom: 8px")}>
      <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Comeback</span>
      <span style={css("font-size: 12px; color: #8E8E93")}>Active, no visit in 14 days</span>
    </div>
    <ul style={css("list-style: none; margin: 0; padding: 0")}>
        <li style={css("display: flex; align-items: center; gap: 10px; min-height: 60px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <Link to="/desk/checkin" style={css("flex: 1 1 auto; min-width: 0; min-height: 48px; display: flex; align-items: center; gap: 12px; color: #FFFFFF; text-decoration: none")}>
            <div style={css("width: 40px; height: 40px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>LA</div>
            <span style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0; flex-grow: 1")}>
              <span style={css("font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>Lorna Aquino</span>
              <span style={css("font-size: 11px; color: #8E8E93; white-space: nowrap")}>Last visit Oct 2, 15 days ago</span>
            </span>
          </Link>
          <span style={css("flex-shrink: 0; min-height: 44px; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93; white-space: nowrap")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>Nudged Oct 15</span>
        </li>
        <li style={css("display: flex; align-items: center; gap: 10px; min-height: 60px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <Link to="/desk/checkin" style={css("flex: 1 1 auto; min-width: 0; min-height: 48px; display: flex; align-items: center; gap: 12px; color: #FFFFFF; text-decoration: none")}>
            <div style={css("width: 40px; height: 40px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>TG</div>
            <span style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0; flex-grow: 1")}>
              <span style={css("font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>Tomas Garcia</span>
              <span style={css("font-size: 11px; color: #8E8E93; white-space: nowrap")}>Last visit Oct 1, 16 days ago</span>
            </span>
          </Link>
          <button type="button" aria-label="Send in-app nudge to Tomas Garcia" aria-pressed={sent.has('Tomas Garcia')} disabled={sent.has('Tomas Garcia')} onClick={() => nudge('Tomas Garcia')} style={css("flex-shrink: 0; height: 44px; padding: 0 14px; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-family: inherit; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>Nudge</button>
        </li>
        <li style={css("display: flex; align-items: center; gap: 10px; min-height: 60px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <Link to="/desk/checkin" style={css("flex: 1 1 auto; min-width: 0; min-height: 48px; display: flex; align-items: center; gap: 12px; color: #FFFFFF; text-decoration: none")}>
            <div style={css("width: 40px; height: 40px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>KV</div>
            <span style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0; flex-grow: 1")}>
              <span style={css("font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>Kate Valdez</span>
              <span style={css("font-size: 11px; color: #8E8E93; white-space: nowrap")}>Last visit Oct 3, 14 days ago</span>
            </span>
          </Link>
          <button type="button" aria-label="Send in-app nudge to Kate Valdez" aria-pressed={sent.has('Kate Valdez')} disabled={sent.has('Kate Valdez')} onClick={() => nudge('Kate Valdez')} style={css("flex-shrink: 0; height: 44px; padding: 0 14px; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; font-family: inherit; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>Nudge</button>
        </li>
    </ul>
  </section>

  <div style={css("height: 100px")} aria-hidden="true"></div>
    </PhoneScreen>
  );
}
