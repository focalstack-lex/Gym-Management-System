// Port of design/canvas/Member-Set-Password.dc.html. Live rule checks, confirm must match,
// privacy notice must be accepted before the account is activated.

import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';

// Canvas state: the member activated with the slip for INF-00731 and typed a password.
const MEMBER_ID = 'INF-00731';
const FALLBACK_IDENTITY = '0917 482 1530';
const SAMPLE_PASSWORD = 'trainbeyond26';

const squash = (value: string) => value.replace(/[\s-]/g, '').toLowerCase();

export function SetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { identity?: string } | null;
  const identity = state?.identity?.trim() ? state.identity : FALLBACK_IDENTITY;

  const [password, setPassword] = useState(SAMPLE_PASSWORD);
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [show, setShow] = useState(false);
  const [invalid, setInvalid] = useState<'password' | 'confirm' | 'privacy' | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const privacyRef = useRef<HTMLInputElement>(null);

  const typed = squash(password);
  const rule = (text: string, ok: boolean) => ({ text, color: ok ? '#FFFFFF' : '#8E8E93', icon: ok ? '#30D158' : '#48484A' });
  const checks = [
    rule('At least 10 characters', password.length >= 10),
    rule('Includes a number', /\d/.test(password)),
    rule('Not your mobile number or member ID', typed.length > 0 && !typed.includes(squash(identity)) && !typed.includes(squash(MEMBER_ID))),
  ];
  const rulesPass = checks.every((c) => c.icon === '#30D158');

  function activate(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (!rulesPass) {
      setInvalid('password');
      passwordRef.current?.focus();
      return;
    }
    if (confirm !== password) {
      setInvalid('confirm');
      confirmRef.current?.focus();
      return;
    }
    if (!agreed) {
      setInvalid('privacy');
      privacyRef.current?.focus();
      return;
    }
    setInvalid(null);
    navigate('/m/today');
  }

  const bar = (
    <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 20px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08)")}>
      <a href="/m/today" onClick={activate} style={css("height: 54px; border-radius: 16px; background: #FF6A00; color: #000000; text-decoration: none; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800")}>Activate account</a>
    </div>
  );

  return (
    <PhoneScreen padding="52px 20px 0" bars={bar} bottomInset={130}>
      <header style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
        <Link to="/activate" aria-label="Back to activation code" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
        <span style={css("font-size: 12px; font-weight: 600; color: #8E8E93")}>Step 2 of 2</span>
      </header>

      <h1 style={css("margin: 20px 0 0; font-size: 28px; line-height: 1.1; font-weight: 800; font-stretch: 112%; letter-spacing: -0.015em")}>Hi Jessa, set your password</h1>

      <div style={css("margin-top: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; gap: 12px")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
        <span style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0")}><span style={css("font-size: 14px; font-weight: 700")}>Code accepted</span><span style={css("font-size: 12px; color: #8E8E93")}>Monthly, active Oct 18 to Nov 17</span></span>
        <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A1A1AA")}>INF-00731</span>
      </div>

      <form onSubmit={(e) => e.preventDefault()} style={css("margin-top: 16px; display: flex; flex-direction: column; gap: 10px")}>
        <label style={css("display: flex; flex-direction: column; gap: 6px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>New password</span>
          <span style={css("display: flex; align-items: center; height: 52px; box-sizing: border-box; border-radius: 16px; background: #17171A; border: 1px solid #FF6A00; padding: 0 4px 0 14px")}>
            <input ref={passwordRef} type={show ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={invalid === 'password' ? true : undefined} style={css("flex-grow: 1; min-width: 0; height: 100%; border: 0; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 16px; outline: none")} />
            <button type="button" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={() => setShow((v) => !v)} style={css("width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: #8E8E93; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
          </span>
        </label>
        <ul aria-label="Password rules" style={css("list-style: none; margin: 0; padding: 0 4px; display: flex; flex-direction: column; gap: 6px; font-size: 13px")}>
          {checks.map((r) => (
            <li key={r.text} style={css(`display: flex; align-items: center; gap: 8px; color: ${r.color}`)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={r.icon} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>{r.text}</li>
          ))}
        </ul>
        <label style={css("display: flex; flex-direction: column; gap: 6px; margin-top: 4px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Confirm password</span>
          <input ref={confirmRef} type="password" autoComplete="new-password" placeholder="Type it again" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={invalid === 'confirm' ? true : undefined} style={css("height: 52px; box-sizing: border-box; border-radius: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); padding: 0 14px; color: #FFFFFF; font-family: inherit; font-size: 16px")} />
        </label>
        <label style={css("display: flex; flex-direction: column; gap: 6px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Email for password reset (optional)</span>
          <input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={css("height: 52px; box-sizing: border-box; border-radius: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); padding: 0 14px; color: #FFFFFF; font-family: inherit; font-size: 16px")} />
        </label>
        <label style={css("display: flex; align-items: flex-start; gap: 12px; min-height: 44px; padding-top: 6px; font-size: 13px; line-height: 1.45; color: #A1A1AA; cursor: pointer")}>
          <input ref={privacyRef} type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} aria-invalid={invalid === 'privacy' ? true : undefined} style={css("width: 20px; height: 20px; margin: 0; flex-shrink: 0; accent-color: #FFFFFF")} />
          <span>I have read the <a href="#" onClick={(e) => e.preventDefault()} style={css("color: #FFFFFF; text-decoration: underline; text-underline-offset: 3px")}>privacy notice</a>. My data is used only for my membership (RA 10173).</span>
        </label>
      </form>
    </PhoneScreen>
  );
}
