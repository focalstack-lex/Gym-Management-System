// Desk-Checkin: the attendance station layout (1024px and wider) of the front desk check-in.

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { css } from '../../lib/css';
import { SEED_HOURLY } from '../../demo/seed';
import { searchMembers, sheetCounts, statusOf } from '../../demo/state';
import { useDemo } from '../../demo/store';
import type { MembershipStatus } from '../../domain/status';
import { ReasonSheet } from './Checkin';
import { useNetworkParam } from './_hooks';
import { memberView } from './_logic';
import { MODE_LABEL, useWalkInForm } from './_walkin';

// Entries per hour, 6 AM to 9 PM; hours not reached yet are drawn as a flat 2px tick.
function hourBars(): { height: string; bg: string }[] {
  const counts: (number | null)[] = [...SEED_HOURLY, null, null, null];
  return counts.map((n, i) => {
    if (n === null) return { height: '2px', bg: '#3F3F46' };
    return { height: Math.round((n / 8) * 100) + '%', bg: i === 12 ? '#FFFFFF' : '#71717A' };
  });
}

const MODES = [
  { key: 'cash', label: 'Cash' },
  { key: 'gcash', label: 'GCash' },
  { key: 'maya', label: 'Maya' },
] as const;

function RowStatus({ status }: { status: MembershipStatus }) {
  const wrap = css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #A1A1AA");
  if (status === 'active')
    return (
      <span style={wrap}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>Active</span>
    );
  if (status === 'expiring_soon')
    return (
      <span style={wrap}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Expiring soon</span>
    );
  if (status === 'grace')
    return (
      <span style={wrap}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>Grace</span>
    );
  return (
    <span style={wrap}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>Expired</span>
  );
}

export function CheckinDesktop() {
  const { state, dispatch } = useDemo();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useNetworkParam();
  const [query, setQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(params.get('sheet') === 'reason');
  const walk = useWalkInForm();
  const wanted = params.get('member') ?? 'mika';
  const member = query.trim() ? searchMembers(state, query)[0] : (state.members.find((m) => m.id === wanted) ?? state.members[0]);
  const view = member ? memberView(state, member, 402.12, '5px', 'rgba(255,255,255,0.06)') : null;
  const counts = sheetCounts(state);
  const hours = hourBars();
  const submit = (e: FormEvent) => e.preventDefault();
  const checkIn = () => member && dispatch({ type: 'checkIn', memberId: member.id });
  const renew = () => member && dispatch({ type: 'renew', memberId: member.id, months: 1, mode: 'cash' });
  const renewAndCheckIn = () => {
    if (!member) return;
    dispatch({ type: 'renew', memberId: member.id, months: 1, mode: 'cash' });
    dispatch({ type: 'checkIn', memberId: member.id });
  };
  const initials = view?.initials ?? '';
  const memberId = view?.memberId ?? '';
  const name = view?.name ?? '';
  const planLine = view?.planLine ?? '';
  const isActive = view?.status === 'active';
  const isExpiring = view?.status === 'expiring_soon';
  const isGrace = view?.kind === 'grace';
  const isExpired = view?.kind === 'blocked';
  const showAllow = isActive || isExpiring || isGrace;
  const statusLabel = view?.statusLabel ?? '';
  const ringLabel = view?.ringLabel ?? '';
  const ringDash = view?.ringDash ?? '';
  const days = view?.days ?? '';
  const daysLabel = view?.kind === 'active' ? 'Days left' : view?.kind === 'grace' ? 'Grace days left' : 'Days past end';
  const gridLabel = view?.gridLabel ?? '';
  const weeks = view?.weeks ?? [];
  const visits = view?.visits ?? '';
  const lastVisit = view?.lastVisit ?? '';
  const lastVisitNote = view?.lastVisitNote ?? '';
  return (
    <>
<div style={css("min-height: 980px; box-sizing: border-box; background: #0C0C0E; color: #FFFFFF; font-family: 'Archivo', system-ui, sans-serif; padding: 20px 16px 32px")}>
<div style={css("max-width: 1440px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px")}>

  <header style={css("display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; padding: 10px 12px 10px 10px; border-radius: 20px; background: #17171A; border: 1px solid rgba(255,255,255,0.06)")}>
    <div style={css("display: flex; align-items: center; gap: 12px; flex-grow: 1; min-width: 220px")}>
      <div style={css("width: 44px; height: 44px; border-radius: 12px; background: #FFFFFF; overflow: hidden; flex-shrink: 0")}><img src="/brand/logo.jpg" alt="The Infinity Fitness" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} /></div>
      <div style={css("display: flex; flex-direction: column; gap: 2px")}>
        <span style={css("font-size: 16px; font-weight: 800")}>Front desk</span>
        <span style={css("font-size: 12px; color: #8E8E93")}>Saturday, Oct 17</span>
      </div>
    </div>
    {state.online ? (
    <span style={css("display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #8E8E93")}><span style={css("width: 6px; height: 6px; border-radius: 50%; background: #30D158")}></span><span style={css("color: #FFFFFF; font-weight: 600")}>Online</span><span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px")}>outbox {state.outbox}</span></span>
    ) : (
    <span style={css("display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #8E8E93")}><span style={css("width: 7px; height: 7px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid #FF9F0A")}></span><span style={css("color: #FFFFFF; font-weight: 600")}>Offline</span><span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px")}>outbox {state.outbox}</span></span>
    )}
    <span style={css("width: 1px; height: 24px; background: rgba(255,255,255,0.06)")}></span>
    <span style={css("display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #8E8E93")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg><span style={css("color: #FFFFFF; font-weight: 600")}>Ana R.</span>since 6:00 AM</span>
    <span style={css("font-size: 24px; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums; padding: 0 4px")}>6:42<span style={css("font-size: 13px; font-weight: 600; color: #8E8E93")}> PM</span></span>
    <Link to="/desk/shift" style={css("display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 16px; border-radius: 14px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 3 4 4-4 4"></path><path d="M20 7H4"></path><path d="m8 21-4-4 4-4"></path><path d="M4 17h16"></path></svg>Hand over shift</Link>
  </header>

  <div style={css("display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start")}>

    <main style={css("flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>

      <form role="search" onSubmit={submit} style={css("display: flex; flex-wrap: wrap; gap: 12px")}>
        <label style={css("flex: 999 1 320px; min-width: 0; display: flex; align-items: center; gap: 14px; height: 64px; padding: 0 18px; border-radius: 18px; background: #17171A; border: 1px solid #FF6A00; box-sizing: border-box")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <span style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>Find member</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, nickname or member ID" style={css("flex-grow: 1; min-width: 0; height: 100%; border: 0; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 20px; font-weight: 600; outline: none")} />
          <span style={css("flex-shrink: 0; height: 26px; padding: 0 8px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.06); color: #8E8E93; font-family: 'JetBrains Mono', monospace; font-size: 11px; display: inline-flex; align-items: center")}>Enter</span>
        </label>
        <button type="button" onClick={() => navigate('/desk/scan')} style={css("flex: 1 1 160px; height: 64px; border: 0; border-radius: 18px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M7 12h10"></path></svg>Scan pass
        </button>
      </form>

        {view && member && (<>
      <section aria-label="Member match" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 22px")}>
        <div style={css("display: flex; flex-wrap: wrap; gap: 24px; align-items: center")}>
          <div style={css("width: 128px; height: 128px; flex-shrink: 0; border-radius: 28px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px")}>
            <span style={css("font-size: 44px; font-weight: 800; font-stretch: 115%; color: #8E8E93")}>{initials}</span>
            <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Desk photo</span>
          </div>
          <div style={css("flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 10px")}>
            <div style={css("display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; font-size: 13px")}>
              <span style={css("display: inline-flex; align-items: center; gap: 7px; font-weight: 700; color: #FFFFFF")}>{isActive && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></>)}{isExpiring && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></>)}{isGrace && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg></>)}{isExpired && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></>)}{statusLabel}</span>
              <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93")}>{memberId}</span>
            </div>
            <h1 style={css("margin: 0; font-size: clamp(32px, 4vw, 46px); line-height: 1; font-weight: 800; font-stretch: 112%; letter-spacing: -0.015em")}>{name}</h1>
            <span style={css("font-size: 15px; color: #8E8E93")}>{planLine}</span>
          </div>
          <div style={css("position: relative; width: 132px; height: 132px; flex-shrink: 0")}>
            <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label={ringLabel} style={css("display: block; transform: rotate(-90deg)")}>
              <circle cx="66" cy="66" r="64" fill="none" stroke="#3F3F46" strokeWidth="2"></circle>
              <circle cx="66" cy="66" r="64" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray={ringDash}></circle>
            </svg>
            <div style={css("position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px")}>
              <span style={css("font-size: 44px; line-height: 1; font-weight: 800; font-stretch: 118%; font-variant-numeric: tabular-nums")}>{days}</span>
              <span style={css("font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>{daysLabel}</span>
            </div>
          </div>
        </div>

        <div style={css("display: flex; flex-wrap: wrap; gap: 16px 28px; align-items: flex-end; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.06)")}>
          <div style={css("display: flex; flex-direction: column; gap: 10px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Visits, last 8 weeks</span>
            <div role="img" aria-label={gridLabel} style={css("font-size: 0; line-height: 0; white-space: nowrap")}>
              {weeks.map((w, wi) => (<span key={wi} style={css(`display: inline-block; vertical-align: top; width: 11px; margin-right: ${w.gap}`)}>{w.days.map((d, di) => (<span key={di} style={css(`display: block; width: 11px; height: 11px; margin-bottom: 5px; border-radius: 3px; box-sizing: border-box; background: ${d.bg}; border: ${d.border}`)}></span>))}</span>))}
            </div>
          </div>
          <div style={css("display: flex; flex-wrap: wrap; gap: 28px; padding-bottom: 6px")}>
            <div style={css("display: flex; flex-direction: column; gap: 4px")}><span style={css("font-size: 32px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums")}>{visits}</span><span style={css("font-size: 12px; color: #8E8E93")}>visits in 8 weeks</span></div>
            <div style={css("display: flex; flex-direction: column; gap: 4px")}><span style={css("font-size: 32px; line-height: 1; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums")}>{lastVisit}</span><span style={css("font-size: 12px; color: #8E8E93")}>{lastVisitNote}</span></div>
          </div>
        </div>

        {showAllow && (<>
          <div style={css("display: flex; flex-wrap: wrap; gap: 12px")}>
            <button type="button" disabled={view.checkedIn} onClick={checkIn} style={css("flex: 999 1 320px; height: 72px; border: 0; border-radius: 20px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 21px; font-weight: 800; font-stretch: 108%; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>Check in
            </button>
            <button type="button" onClick={renew} style={css("flex: 1 1 140px; height: 72px; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer")}>Renew early</button>
          </div>
        </>)}

        {isExpired && (<>
          <div style={css("display: flex; flex-direction: column; gap: 12px")}>
            <div role="alert" style={css("display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; border-radius: 16px; background: #1F1F23; border: 1px solid rgba(255,69,58,0.4)")}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6961" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0; margin-top: 1px")}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
              <div style={css("display: flex; flex-direction: column; gap: 4px")}>
                <span style={css("font-size: 16px; font-weight: 700")}>{`Soft block: membership ended ${view.endedDay}`}</span>
                <span style={css("font-size: 14px; line-height: 1.5; color: #A1A1AA")}>{`Past the ${view.graceDays}-day grace window, so a renewal today runs ${view.renewFrom} to ${view.renewTo}.`}</span>
              </div>
            </div>
            <div style={css("display: flex; flex-wrap: wrap; gap: 12px")}>
              <button type="button" onClick={renewAndCheckIn} style={css("flex: 999 1 320px; height: 72px; border: 0; border-radius: 20px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 19px; font-weight: 800; font-stretch: 108%; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>Renew and check in
              </button>
              <button type="button" onClick={() => setSheetOpen(true)} style={css("flex: 1 1 200px; height: 72px; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer")}>Allow entry, log reason</button>
            </div>
          </div>
        </>)}
      </section>
        </>)}

      <div style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px")}>
        <button type="button" onClick={() => navigate('/desk/enroll')} style={css("min-height: 60px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 12px; padding: 0 16px; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>Enroll new member</button>
        <button type="button" onClick={() => navigate('/desk/expiry')} style={css("min-height: 60px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 12px; padding: 0 16px; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>Expiry board</button>
        <button type="button" onClick={() => navigate('/desk/freeze')} style={css("min-height: 60px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 12px; padding: 0 16px; cursor: pointer")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Freeze request</button>
      </div>
    </main>

    <aside style={css("flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>

      <section aria-label="Today's sign-in sheet" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 16px")}>
        <div style={css("display: flex; align-items: flex-end; justify-content: space-between; gap: 12px")}>
          <div style={css("display: flex; flex-direction: column; gap: 6px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Sign-in sheet, today</span>
            <span style={css("font-size: 44px; line-height: 1; font-weight: 800; font-stretch: 115%; font-variant-numeric: tabular-nums")}>{counts.checkIns}<span style={css("font-size: 14px; font-weight: 600; color: #8E8E93")}> check-ins</span></span>
          </div>
          <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums; padding-bottom: 4px")}>{counts.walkIns}<span style={css("font-size: 13px; font-weight: 600; color: #8E8E93")}> walk-ins</span></span>
        </div>
        <div role="img" aria-label="Entries per hour from 6 AM, busiest now at 6 PM with 8" style={css("display: flex; flex-direction: column; gap: 6px")}>
          <div style={css("display: flex; align-items: flex-end; gap: 4px; height: 56px")}>
            {hours.map((h, i) => (<span key={i} style={css(`flex: 1; height: ${h.height}; border-radius: 1px; background: ${h.bg}`)}></span>))}
          </div>
          <div style={css("display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8E8E93")}><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>9 PM</span></div>
        </div>
        <ol style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
          {state.signIns.slice(0, 4).map((s) => {
            const who = state.members.find((m) => m.id === s.memberId);
            return (
              <li key={s.id} style={css("display: flex; align-items: center; gap: 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}><span style={css("width: 62px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93")}>{s.time}</span><span style={css("flex-grow: 1; font-size: 14px; font-weight: 600")}>{s.name}</span>{who ? <RowStatus status={statusOf(state, who)} /> : <span style={css("font-size: 12px; color: #A1A1AA")}>{`Walk-in, ${s.payment ? MODE_LABEL[s.payment.mode] : ''}`}</span>}</li>
            );
          })}
        </ol>
        <a href="#" onClick={(e) => e.preventDefault()} style={css("align-self: flex-start; min-height: 44px; display: inline-flex; align-items: center; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.25); text-underline-offset: 4px")}>{`See all ${counts.checkIns + counts.walkIns} entries`}</a>
      </section>

      <section aria-label="Walk-in register" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
        <h2 style={css("margin: 0; font-size: 17px; font-weight: 700")}>Walk-in register</h2>
        <label style={css("display: flex; flex-direction: column; gap: 6px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Visitor name</span>
          <input type="text" value={walk.name} onChange={(e) => walk.setName(e.target.value)} placeholder="First and last name" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px")} />
        </label>
        <div role="radiogroup" aria-label="Payment mode" style={css("display: flex; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06)")}>
          {MODES.map(({ key: m, label }) => (
            <button key={m} type="button" role="radio" aria-checked={walk.mode === m} onClick={() => walk.setMode(m)} style={walk.mode === m ? css("flex: 1; height: 44px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; background: #1F1F23; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer") : css("flex: 1; height: 44px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #8E8E93; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer")}>{label}</button>
          ))}
        </div>
        {walk.mode !== 'cash' && (
          <label style={css("display: flex; flex-direction: column; gap: 6px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>{`${MODE_LABEL[walk.mode]} reference no.`}</span>
            <input type="text" inputMode="numeric" value={walk.reference} onChange={(e) => walk.setReference(e.target.value)} placeholder="13 digits" style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 15px; letter-spacing: 0.06em")} />
          </label>
        )}
        <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-top: 4px")}>
          <span style={css("font-size: 14px; color: #8E8E93")}>Walk-in rate</span>
          <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>PHP [RATE]</span>
        </div>
        {walk.error && <span role="alert" style={css("font-size: 12px; color: #FF6961")}>{walk.error}</span>}
        <button type="button" onClick={walk.submit} style={css("height: 52px; border: 0; border-radius: 16px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer")}>Record walk-in</button>
      </section>
    </aside>
  </div>
</div>
</div>
    {sheetOpen && member && view && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)' }}>
        <div style={{ position: 'relative', maxWidth: 480, height: '100%', margin: '0 auto' }}>
          <ReasonSheet
            member={member}
            view={view}
            onClose={() => setSheetOpen(false)}
            onConfirm={(reason, note) => {
              dispatch({ type: 'allowEntry', memberId: member.id, reason, note });
              setSheetOpen(false);
            }}
          />
        </div>
      </div>
    )}
    </>
  );
}
