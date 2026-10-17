// Port of design/canvas/Member-Activate.dc.html. The desk code is 8 letters or digits.

import { useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';

// Canvas state: code typed so far is K7QM 2X, the mobile number is filled in.
const TYPED = 'K7QM2X';
const MOBILE = '0917 482 1530';
const LENGTH = 8;

export function Activate() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState(MOBILE);
  const [chars, setChars] = useState<string[]>(() => Array.from({ length: LENGTH }, (_, i) => TYPED[i] ?? ''));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const filled = chars.filter(Boolean).length;
  const focusIndex = chars.findIndex((c) => !c);
  const ready = filled === LENGTH && identity.trim().length > 0;

  function put(index: number, value: string) {
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (!clean) {
      setChars((prev) => prev.map((c, i) => (i === index ? '' : c)));
      return;
    }
    // A multi-character value (autofill) spreads over the following boxes.
    const next = [...chars];
    let at = index;
    for (const ch of clean) {
      if (at >= LENGTH) break;
      next[at] = ch;
      at++;
    }
    setChars(next);
    refs.current[Math.min(at, LENGTH - 1)]?.focus();
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !chars[index] && index > 0) {
      event.preventDefault();
      setChars((prev) => prev.map((c, i) => (i === index - 1 ? '' : c)));
      refs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function onPaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    put(index, event.clipboardData.getData('text'));
  }

  function onContinue(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (!ready) return;
    navigate('/activate/password', { state: { identity: identity.trim() } });
  }

  const box = (i: number) => (
    <input
      key={i}
      ref={(el) => {
        refs.current[i] = el;
      }}
      type="text"
      maxLength={1}
      aria-label={'Code character ' + (i + 1)}
      value={chars[i]}
      autoCapitalize="characters"
      autoComplete="one-time-code"
      onChange={(e) => put(i, e.target.value)}
      onKeyDown={(e) => onKeyDown(i, e)}
      onPaste={(e) => onPaste(i, e)}
      onFocus={(e) => e.target.select()}
      style={css(`width: 36px; height: 50px; box-sizing: border-box; border-radius: 12px; background: #17171A; border: ${i === focusIndex ? '1px solid #FF6A00' : '1px solid rgba(255,255,255,0.06)'}; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 20px; text-align: center; outline: none`)}
    />
  );

  const bar = (
    <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 20px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08)")}>
      <a
        href="/activate/password"
        onClick={onContinue}
        className="pressable"
        aria-disabled={!ready}
        style={{ ...css("height: 54px; border-radius: 16px; background: #FF6A00; color: #000000; text-decoration: none; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800"), ...(ready ? null : { opacity: 0.4 }) }}
      >
        Continue
      </a>
    </div>
  );

  return (
    <PhoneScreen padding="52px 20px 0" bars={bar}>
      <header style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px")}>
        <Link to="/login" aria-label="Back to sign in" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
        <span style={css("font-size: 12px; font-weight: 600; color: #8E8E93")}>Step 1 of 2</span>
      </header>

      <h1 style={css("margin: 22px 0 0; font-size: 28px; line-height: 1.1; font-weight: 800; font-stretch: 112%; letter-spacing: -0.015em")}>Activate your membership</h1>
      <p style={css("margin: 8px 0 0; font-size: 14px; line-height: 1.5; color: #8E8E93")}>Use the code on the slip the front desk gave you when you joined.</p>

      <button type="button" style={css("margin-top: 22px; width: 100%; min-height: 64px; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; background: #17171A; color: #FFFFFF; font-family: inherit; text-align: left; padding: 0 16px; display: flex; align-items: center; gap: 14px; cursor: pointer")}>
        <span style={css("width: 40px; height: 40px; flex-shrink: 0; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M7 12h10"></path></svg></span>
        <span style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1")}><span style={css("font-size: 15px; font-weight: 700")}>Scan the QR on your slip</span><span style={css("font-size: 12px; color: #8E8E93")}>Fills in everything for you</span></span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
      </button>

      <div aria-hidden="true" style={css("margin: 18px 0; display: flex; align-items: center; gap: 12px; font-size: 12px; color: #8E8E93")}><span style={css("flex: 1; height: 1px; background: rgba(255,255,255,0.06)")}></span>or type it<span style={css("flex: 1; height: 1px; background: rgba(255,255,255,0.06)")}></span></div>

      <label style={css("display: flex; flex-direction: column; gap: 6px")}>
        <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Mobile number or member ID</span>
        <span style={css("display: flex; align-items: center; height: 52px; box-sizing: border-box; border-radius: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); padding: 0 14px")}>
          <input type="text" inputMode="tel" autoComplete="tel" value={identity} onChange={(e) => setIdentity(e.target.value)} style={css("flex-grow: 1; min-width: 0; height: 100%; border: 0; background: transparent; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 16px; outline: none")} />
        </span>
      </label>

      <fieldset style={css("margin: 16px 0 0; padding: 0; border: 0; display: flex; flex-direction: column; gap: 6px")}>
        <legend style={css("padding: 0; margin-bottom: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Activation code</legend>
        <div style={css("display: flex; align-items: center; gap: 6px")}>
          {[0, 1, 2, 3].map(box)}
          <span aria-hidden="true" style={css("width: 10px; height: 2px; margin: 0 2px; background: #3F3F46")}></span>
          {[4, 5, 6, 7].map(box)}
        </div>
        <span style={css("font-size: 12px; color: #8E8E93")}>8 characters, letters and numbers. Valid for 48 hours.</span>
      </fieldset>

      <p style={css("margin: 18px 0 0; font-size: 13px; line-height: 1.5; color: #8E8E93")}>Lost your slip or the code expired? The front desk can issue a new one in seconds.</p>
    </PhoneScreen>
  );
}
