// Desk-Mobile-Checkin: find a member, see the match card, check in, renew or allow entry with a logged reason.

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { css } from '../../lib/css';
import { PhoneScreen } from '../../components/PhoneScreen';
import type { AllowReason, DemoAction } from '../../demo/state';
import { searchMembers, sheetCounts, statusOf } from '../../demo/state';
import { useDemo } from '../../demo/store';
import type { Member } from '../../demo/seed';
import type { MembershipStatus } from '../../domain/status';
import { DeskHeader } from './DeskHeader';
import { DeskTabBar } from './DeskTabBar';
import { useNetworkParam } from './_hooks';
import { memberView } from './_logic';
import type { MemberView } from './_logic';

const REASONS: AllowReason[] = ['Will pay before leaving', 'Owner approved', 'E-wallet payment pending', 'Other'];

// Bottom sheet that logs why a lapsed member was let in. Also used by the desk station layout.
export function ReasonSheet({ member, view, onClose, onConfirm }: { member: Member; view: MemberView; onClose: () => void; onConfirm: (reason: AllowReason, note: string | null) => void }) {
  const [picked, setPicked] = useState(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const confirm = () => {
    const reason = REASONS[picked];
    if (reason === 'Other' && !note.trim()) {
      setError('A note is required when the reason is Other.');
      return;
    }
    setError('');
    onConfirm(reason, note.trim() || null);
  };
  return (
    <>
    <div style={css("position: absolute; inset: 0; background: rgba(0,0,0,0.6)")}></div>
    <div role="dialog" aria-modal="true" aria-labelledby="reason-title" style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 10px 16px 34px; background: #17171A; border-top: 0.5px solid rgba(255,255,255,0.08); border-radius: 24px 24px 0 0; display: flex; flex-direction: column; gap: 14px")}>
      <span aria-hidden="true" style={css("align-self: center; width: 36px; height: 5px; border-radius: 3px; background: #3F3F46")}></span>
      <div style={css("display: flex; flex-direction: column; gap: 4px")}>
        <h2 id="reason-title" style={css("margin: 0; font-size: 19px; font-weight: 800")}>Allow entry without renewal</h2>
        <span style={css("font-size: 13px; line-height: 1.45; color: #8E8E93")}>{`${member.name}, expired ${view.endedDay}. The reason is written to the audit log.`}</span>
      </div>
      <div role="radiogroup" aria-label="Reason" style={css("display: flex; flex-direction: column; border-radius: 16px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
        {REASONS.map((label, i) => {
          const on = i === picked;
          const divider = i === 0 ? '0' : '1px solid rgba(255,255,255,0.06)';
          const ring = on ? '1.5px solid #FF6A00' : '1.5px solid #3F3F46';
          const dot = on ? '#FF6A00' : 'transparent';
          return (
          <button key={label} type="button" role="radio" aria-checked={on} onClick={() => setPicked(i)} style={css(`display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 14px; border: 0; border-top: ${divider}; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; text-align: left; cursor: pointer`)}>
            <span style={css(`width: 18px; height: 18px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: ${ring}; display: flex; align-items: center; justify-content: center`)}><span style={css(`width: 8px; height: 8px; border-radius: 50%; background: ${dot}`)}></span></span>{label}
          </button>
          );
        })}
      </div>
      <label style={css("display: flex; flex-direction: column; gap: 6px")}>
        <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Note</span>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} aria-invalid={error ? true : undefined} placeholder="Required when the reason is Other" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px")} />
      </label>
      {error && <span role="alert" style={css("font-size: 12px; color: #FF6961")}>{error}</span>}
      <div style={css("display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 10px")}>
        <button type="button" onClick={onClose} style={css("height: 54px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer")}>Cancel</button>
        <button type="button" onClick={confirm} style={css("height: 54px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 15px; font-weight: 800; cursor: pointer")}>Log and allow entry</button>
      </div>
      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8E93; text-align: center")}>Logged by Ana R. at 6:42 PM</span>
    </div>
    </>
  );
}

function RowIcon({ status }: { status: MembershipStatus }) {
  if (status === 'active')
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Active" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
    );
  if (status === 'expiring_soon')
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Expiring soon" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    );
  if (status === 'grace')
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Grace" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Expired" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
  );
}

function Match({ member, view, dispatch, openSheet }: { member: Member; view: MemberView; dispatch: (a: DemoAction) => void; openSheet: () => void }) {
  const { initials, name, memberId, statusLabel, statusColor, ringColor, ringDash, ringLabel, days, daysShort, planLine, gridLabel, weeks, visits, lastVisit, lastVisitNote } = view;
  const isActive = view.status === 'active';
  const isExpiring = view.status === 'expiring_soon';
  const isGrace = view.kind === 'grace';
  const isExpired = view.kind === 'blocked';
  const checkIn = () => dispatch({ type: 'checkIn', memberId: member.id });
  const renew = () => dispatch({ type: 'renew', memberId: member.id, months: 1, mode: 'cash' });
  return (
    <>
  <section aria-label="Member match" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 14px")}>
    <div style={css("display: flex; align-items: center; gap: 12px")}>
      <div style={css("width: 60px; height: 60px; flex-shrink: 0; box-sizing: border-box; border-radius: 16px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>{initials}</div>
      <div style={css("display: flex; flex-direction: column; gap: 4px; flex-grow: 1; min-width: 0")}>
        <span style={css("font-size: 22px; line-height: 1.05; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis")}>{name}</span>
        <span style={css("display: flex; align-items: center; gap: 6px; font-size: 12px; white-space: nowrap")}>
          {isActive && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></>)}
          {isGrace && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg></>)}
          {isExpired && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></>)}
          {isExpiring && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></>)}
          <span style={css(`font-weight: 700; color: ${statusColor}`)}>{statusLabel}</span>
          <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8E93")}>{memberId}</span>
        </span>
      </div>
      <div style={css("position: relative; width: 64px; height: 64px; flex-shrink: 0")}>
        <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label={ringLabel} style={css("display: block; transform: rotate(-90deg)")}>
          <circle cx="32" cy="32" r="31" fill="none" stroke="#3F3F46" strokeWidth="2"></circle>
          <circle cx="32" cy="32" r="31" fill="none" stroke={ringColor} strokeWidth="2" strokeDasharray={ringDash}></circle>
        </svg>
        <div style={css("position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center")}>
          <span style={css("font-size: 22px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums")}>{days}</span>
          <span style={css("font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8E8E93")}>{daysShort}</span>
        </div>
      </div>
    </div>

    <span style={css("font-size: 13px; color: #8E8E93")}>{planLine}</span>

    <div style={css("display: flex; align-items: flex-end; gap: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06)")}>
      <div role="img" aria-label={gridLabel} style={css("font-size: 0; line-height: 0; white-space: nowrap; flex-shrink: 0")}>
        {weeks.map((w, wi) => (<span key={wi} style={css(`display: inline-block; vertical-align: top; width: 8px; margin-right: ${w.gap}`)}>{w.days.map((d, di) => (<span key={di} style={css(`display: block; width: 8px; height: 8px; margin-bottom: 4px; border-radius: 50%; box-sizing: border-box; background: ${d.bg}; border: ${d.border}`)}></span>))}</span>))}
      </div>
      <div style={css("display: flex; flex-direction: column; gap: 10px; padding-bottom: 4px")}>
        <div style={css("display: flex; flex-direction: column; gap: 2px")}><span style={css("font-size: 22px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums")}>{visits}</span><span style={css("font-size: 11px; color: #8E8E93")}>visits, 8 weeks</span></div>
        <div style={css("display: flex; flex-direction: column; gap: 2px")}><span style={css("font-size: 22px; line-height: 1; font-weight: 800")}>{lastVisit}</span><span style={css("font-size: 11px; color: #8E8E93")}>{lastVisitNote}</span></div>
      </div>
    </div>
  </section>

  {(isActive || isExpiring) && (<>
    <div style={css("margin-top: 12px; display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 10px")}>
      <button type="button" disabled={view.checkedIn} onClick={checkIn} style={css("height: 56px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 17px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>Check in</button>
      <button type="button" onClick={renew} style={css("height: 56px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer")}>Renew</button>
    </div>
  </>)}

  {isGrace && (<>
    <div style={css("margin-top: 12px; display: flex; flex-direction: column; gap: 10px")}>
      <div style={css("display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,106,0,0.4)")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0; margin-top: 1px")}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
        <span style={css("font-size: 13px; line-height: 1.45; color: #A1A1AA")}><span style={css("color: #FFFFFF; font-weight: 700")}>In grace until Oct 18.</span> Renewing now continues from Oct 16 to Nov 15, so no days are lost.</span>
      </div>
      <div style={css("display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 10px")}>
        <button type="button" disabled={view.checkedIn} onClick={checkIn} style={css("height: 56px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 15px; font-weight: 800; line-height: 1.15; cursor: pointer")}>Check in (In Grace)</button>
        <button type="button" onClick={renew} style={css("height: 56px; border: 1px solid #FF6A00; border-radius: 16px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>Renew</button>
      </div>
    </div>
  </>)}

  {isExpired && (<>
    <div style={css("margin-top: 12px; display: flex; flex-direction: column; gap: 10px")}>
      <div role="alert" style={css("display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,69,58,0.4)")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6961" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0; margin-top: 1px")}><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
        <span style={css("font-size: 13px; line-height: 1.45; color: #A1A1AA")}><span style={css("color: #FFFFFF; font-weight: 700")}>Soft block.</span> Ended Oct 1, past grace. Renewal today runs Oct 17 to Nov 16.</span>
      </div>
      <div style={css("display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px")}>
        <button type="button" onClick={renew} style={css("height: 56px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer")}>Renew Now</button>
        <button type="button" onClick={openSheet} style={css("height: 56px; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 13px; font-weight: 600; line-height: 1.2; cursor: pointer")}>Allow Entry (Log Reason)</button>
      </div>
    </div>
  </>)}
    </>
  );
}

export function Checkin() {
  const { state, dispatch } = useDemo();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useNetworkParam();
  const [query, setQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(params.get('sheet') === 'reason');
  const wanted = params.get('member') ?? 'mika';
  const member = query.trim() ? searchMembers(state, query)[0] : (state.members.find((m) => m.id === wanted) ?? state.members[0]);
  const view = member ? memberView(state, member, 194.78, '4px', 'rgba(255,255,255,0.08)') : null;
  const counts = sheetCounts(state);
  const submit = (e: FormEvent) => e.preventDefault();
  return (
    <PhoneScreen
      padding="52px 16px 0"
      bottomInset={120}
      bars={
        <>
          <DeskTabBar active="checkin" />
          {sheetOpen && member && view && (
            <ReasonSheet
              member={member}
              view={view}
              onClose={() => setSheetOpen(false)}
              onConfirm={(reason, note) => {
                dispatch({ type: 'allowEntry', memberId: member.id, reason, note });
                setSheetOpen(false);
              }}
            />
          )}
        </>
      }
    >
      <DeskHeader title="Front desk" online={state.online} outbox={state.outbox} />

  <form role="search" onSubmit={submit} style={css("margin-top: 16px; display: flex; gap: 10px")}>
    <label style={css("flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 14px; border-radius: 16px; background: #17171A; border: 1px solid #FF6A00; box-sizing: border-box")}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
      <span style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>Find member</span>
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or member ID" style={css("flex-grow: 1; min-width: 0; height: 100%; border: 0; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 16px; font-weight: 600; outline: none")} />
    </label>
    <button type="button" onClick={() => navigate('/desk/scan')} aria-label="Scan member pass" style={css("width: 52px; height: 52px; flex-shrink: 0; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; display: flex; align-items: center; justify-content: center; cursor: pointer")}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M7 12h10"></path></svg>
    </button>
  </form>

      {member && view && <Match member={member} view={view} dispatch={dispatch} openSheet={() => setSheetOpen(true)} />}

  <section aria-label="Today's sign-in sheet" style={css("margin-top: 12px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px 6px")}>
    <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-bottom: 8px")}>
      <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Today</span>
      <span style={css("font-size: 13px; color: #8E8E93; font-variant-numeric: tabular-nums")}><span style={css("font-size: 17px; font-weight: 800; color: #FFFFFF")}>{counts.checkIns}</span> in, <span style={css("font-weight: 700; color: #FFFFFF")}>{counts.walkIns}</span> walk-ins</span>
    </div>
    <ol style={css("list-style: none; margin: 0; padding: 0")}>
        {state.signIns.slice(0, 3).map((s) => {
          const who = state.members.find((m) => m.id === s.memberId);
          return (
            <li key={s.id} style={css("display: flex; align-items: center; gap: 10px; min-height: 44px; border-top: 1px solid rgba(255,255,255,0.06); white-space: nowrap")}><span style={css("width: 58px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8E8E93")}>{s.time}</span><span style={css("flex-grow: 1; font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis")}>{s.name}</span>{who ? <RowIcon status={statusOf(state, who)} /> : <span style={css("font-size: 11px; color: #A1A1AA")}>Walk-in</span>}</li>
          );
        })}
    </ol>
  </section>
    </PhoneScreen>
  );
}
