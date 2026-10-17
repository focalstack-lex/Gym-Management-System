// Desk-Mobile-Scan: QR viewfinder with the last check-in result and a short undo window.

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { css } from '../../lib/css';
import { PhoneScreen } from '../../components/PhoneScreen';
import { useDemo } from '../../demo/store';
import { daysLeft } from '../../demo/state';
import { DeskTabBar } from './DeskTabBar';
import { useNetworkParam } from './_hooks';

const DEFAULT_LINE = 'Mika Santos checked in,';
const DEFAULT_TIME = '6:42 PM';
const DEFAULT_META = 'Monthly, 28 days left';
const DEFAULT_META_LINE = 'Monthly, 28 days left,';
const DEFAULT_CODE = 'INF-00482';

export function Scan() {
  const { state, dispatch } = useDemo();
  const [params] = useSearchParams();
  useNetworkParam();
  const [torch, setTorch] = useState(false);
  const [undone, setUndone] = useState(false);
  const scanning = params.get('state') === 'scanning' || undone;
  const success = !scanning;
  const latest = state.signIns.find((s) => s.kind === 'member');
  const latestMember = latest?.memberId ? state.members.find((m) => m.id === latest.memberId) : undefined;
  const latestMeta = latestMember ? `${latestMember.plan}, ${daysLeft(state, latestMember)} days left` : DEFAULT_META;
  const undo = () => {
    if (!latest) return;
    dispatch({ type: 'undoCheckIn', signInId: latest.id });
    setUndone(true);
  };
  const torchPressed = torch ? 'true' : 'false';
  const torchBg = torch ? '#FFFFFF' : '#17171A';
  const torchFg = torch ? '#000000' : '#FFFFFF';
  const toggleTorch = () => setTorch((on) => !on);
  return (
    <PhoneScreen padding="52px 16px 0" bottomInset={120} bars={<DeskTabBar active="scan" />}>
  <div aria-hidden="true" style={css("position: absolute; left: 0; right: 0; top: 0; bottom: 83px; background: #000000")}></div>

  <header style={css("position: relative; display: flex; align-items: center; gap: 12px")}>
    <div style={css("width: 40px; height: 40px; border-radius: 11px; background: #FFFFFF; overflow: hidden; flex-shrink: 0")}><img src="/brand/logo.jpg" alt="The Infinity Fitness" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} /></div>
    <div style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0")}>
      <h1 style={css("margin: 0; font-size: 17px; font-weight: 800")}>Scan pass</h1>
    {state.online ? (
      <span role="status" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93; white-space: nowrap")}><span style={css("width: 6px; height: 6px; border-radius: 50%; background: #30D158")}></span>Online, Ana R. on shift</span>
    ) : (
      <span role="status" style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93; white-space: nowrap")}><span style={css("width: 7px; height: 7px; box-sizing: border-box; border-radius: 50%; border: 1.5px solid #FF9F0A")}></span>Offline, Outbox: {state.outbox}</span>
    )}
    </div>
    <button type="button" aria-label="Flashlight" aria-pressed={torchPressed} onClick={toggleTorch} style={css(`width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: ${torchBg}; border: 1px solid rgba(255,255,255,0.06); color: ${torchFg}; display: flex; align-items: center; justify-content: center; cursor: pointer`)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><path d="M6 2h12l-2 7H8z"></path><path d="M8 9v13h8V9"></path><path d="M12 13v3"></path></svg></button>
  </header>

  <div role="img" aria-label="Viewfinder" style={css("position: absolute; top: 190px; left: 75px; width: 240px; height: 240px")}>
    <span aria-hidden="true" style={css("position: absolute; width: 32px; height: 32px; box-sizing: border-box; border: 0 solid #FFFFFF; top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; border-top-left-radius: 8px")}></span>
    <span aria-hidden="true" style={css("position: absolute; width: 32px; height: 32px; box-sizing: border-box; border: 0 solid #FFFFFF; top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; border-top-right-radius: 8px")}></span>
    <span aria-hidden="true" style={css("position: absolute; width: 32px; height: 32px; box-sizing: border-box; border: 0 solid #FFFFFF; bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; border-bottom-left-radius: 8px")}></span>
    <span aria-hidden="true" style={css("position: absolute; width: 32px; height: 32px; box-sizing: border-box; border: 0 solid #FFFFFF; bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; border-bottom-right-radius: 8px")}></span>
    <span aria-hidden="true" style={css("position: absolute; left: 14px; right: 14px; top: 119px; height: 2px; background: #FF6A00")}></span>
  </div>

  <p style={css("position: absolute; top: 446px; left: 16px; right: 16px; margin: 0; text-align: center; font-size: 14px; font-weight: 600; color: #FFFFFF")}>Hold the member's pass inside the frame</p>
  <div style={css("position: absolute; top: 478px; left: 0; right: 0; display: flex; justify-content: center")}>
    <Link to="/desk/checkin" style={css("min-height: 44px; padding: 0 16px; display: inline-flex; align-items: center; font-size: 14px; font-weight: 600; color: #A1A1AA; text-decoration: underline; text-underline-offset: 3px")}>Type name instead</Link>
  </div>

  {success && (<>
    <section role="status" aria-label="Last check-in" style={css("position: absolute; left: 16px; right: 16px; bottom: 99px; box-sizing: border-box; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 14px 16px; display: flex; flex-direction: column; gap: 12px")}>
      <div style={css("display: flex; align-items: center; gap: 12px")}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
        <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0; flex-grow: 1")}>
          <span style={css("font-size: 16px; font-weight: 800")}>{latest ? `${latest.name} checked in,` : DEFAULT_LINE} <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500")}>{latest?.time ?? DEFAULT_TIME}</span></span>
          <span style={css("font-size: 12px; color: #8E8E93")}>{latestMember ? `${latestMeta},` : DEFAULT_META_LINE} <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 11px")}>{latestMember?.code ?? DEFAULT_CODE}</span></span>
        </div>
        <button type="button" onClick={undo} style={css("flex-shrink: 0; min-width: 56px; height: 44px; padding: 0 8px; border: 0; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; cursor: pointer")}>Undo</button>
      </div>
      <div style={css("display: flex; flex-direction: column; gap: 6px")}>
        <div role="img" aria-label="Undo available for 7 more seconds" style={css("height: 2px; background: #3F3F46")}><div style={css("width: 70%; height: 2px; background: #FFFFFF")}></div></div>
        <span style={css("font-size: 11px; color: #8E8E93")}>Undo within 10 seconds</span>
      </div>
    </section>
  </>)}

  {scanning && (<>
    <p role="status" style={css("position: absolute; left: 16px; right: 16px; bottom: 112px; margin: 0; text-align: center; font-size: 13px; color: #8E8E93")}>Looking for a pass</p>
  </>)}

    </PhoneScreen>
  );
}
