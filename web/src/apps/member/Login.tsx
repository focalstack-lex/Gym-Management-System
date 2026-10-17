// Port of design/canvas/Member-Login.dc.html. Demo mode accepts any non-empty values.

import { useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';

export function Login() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [invalid, setInvalid] = useState<'identity' | 'password' | null>(null);
  const identityRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function submit() {
    if (!identity.trim()) {
      setInvalid('identity');
      identityRef.current?.focus();
      return;
    }
    if (!password) {
      setInvalid('password');
      passwordRef.current?.focus();
      return;
    }
    setInvalid(null);
    navigate('/m/today');
  }

  function onSignIn(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    submit();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function onKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <PhoneScreen padding="0">
      <div style={css("position: relative; height: 340px; overflow: hidden; border-radius: 0 0 28px 28px; border-bottom: 1px solid rgba(255,255,255,0.06)")}>
        <img src="/brand/gym-floor.jpg" alt="The Infinity Fitness training floor in Digos City" style={css("width: 100%; height: 100%; object-fit: cover; object-position: center 72%; display: block")} />
        <div aria-hidden="true" style={css("position: absolute; inset: 0; background: rgba(12,12,14,0.32)")}></div>
        <div style={css("position: absolute; left: 20px; top: 56px; display: flex; align-items: center; gap: 10px")}>
          <div style={css("width: 44px; height: 44px; border-radius: 12px; background: #FFFFFF; overflow: hidden")}><img src="/brand/logo.jpg" alt="The Infinity Fitness" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} /></div>
        </div>
      </div>

      <main style={css("padding: 24px 20px 0; display: flex; flex-direction: column")}>
        <h1 style={css("margin: 0; font-size: 30px; line-height: 1.05; font-weight: 800; font-stretch: 112%; letter-spacing: -0.015em")}>Welcome back</h1>
        <p style={css("margin: 6px 0 0; font-size: 14px; color: #8E8E93")}>Sign in to your Infinity Fitness membership.</p>

        <form onSubmit={onSubmit} onKeyDown={onKeyDown} noValidate style={css("margin-top: 20px; display: flex; flex-direction: column; gap: 10px")}>
          <label style={css("display: flex; align-items: center; gap: 12px; height: 52px; padding: 0 14px; box-sizing: border-box; border-radius: 16px; background: #17171A; border: 1px solid #FF6A00")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>Member ID or mobile number</span>
            <input ref={identityRef} type="text" autoComplete="username" placeholder="Member ID or mobile number" value={identity} onChange={(e) => setIdentity(e.target.value)} aria-invalid={invalid === 'identity' ? true : undefined} style={css("flex-grow: 1; min-width: 0; height: 100%; border: 0; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 16px; outline: none")} />
          </label>
          <label style={css("display: flex; align-items: center; gap: 12px; height: 52px; padding: 0 4px 0 14px; box-sizing: border-box; border-radius: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06)")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span style={css("position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)")}>Password</span>
            <input ref={passwordRef} type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={invalid === 'password' ? true : undefined} style={css("flex-grow: 1; min-width: 0; height: 100%; border: 0; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 16px; outline: none")} />
            <button type="button" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={() => setShow((v) => !v)} style={css("width: 44px; height: 44px; flex-shrink: 0; border: 0; border-radius: 12px; background: transparent; color: #8E8E93; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
          </label>
          <a href="#" onClick={(e) => e.preventDefault()} style={css("align-self: flex-end; min-height: 44px; display: inline-flex; align-items: center; font-size: 13px; font-weight: 600; color: #A1A1AA; text-decoration: none")}>Forgot password?</a>
          <a href="/m/today" onClick={onSignIn} style={css("height: 54px; border-radius: 16px; background: #FF6A00; color: #000000; text-decoration: none; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800")}>Sign in</a>
        </form>

        <div aria-hidden="true" style={css("margin: 16px 0; display: flex; align-items: center; gap: 12px; font-size: 12px; color: #8E8E93")}><span style={css("flex: 1; height: 1px; background: rgba(255,255,255,0.06)")}></span>or<span style={css("flex: 1; height: 1px; background: rgba(255,255,255,0.06)")}></span></div>

        <button type="button" onClick={() => navigate('/m/today')} style={css("height: 54px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer")}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"></path><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24z"></path><path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11z"></path><path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.53 11.53 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z"></path></svg>
          Continue with Google
        </button>

        <p style={css("margin: 18px 0 0; text-align: center; font-size: 13px; color: #8E8E93")}>New member? <Link to="/activate" style={css("font-weight: 700; color: #FFFFFF; text-decoration: underline; text-underline-offset: 3px")}>Activate with your desk code</Link></p>
      </main>
    </PhoneScreen>
  );
}
