// Port of design/canvas/Staff-PIN.dc.html. The keypad only counts digits (the canvas does the same);
// PIN verification arrives with Supabase auth in Plan 03. Six digits move on to the desk.

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';

const PEOPLE = [
  ['AR', 'Ana R.', 'Front desk'],
  ['JM', 'Joel M.', 'Relief'],
];

// Keypad order: 1 to 9, an empty slot, then 0. The empty slot is hidden but keeps the grid.
const KEYS: (string | null)[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0'];

// The canvas shows four digits already entered; ?pin=0 starts clean.
function initialPin(search: string): number {
  const raw = new URLSearchParams(search).get('pin');
  const n = raw === null ? 4 : Number(raw);
  return Number.isInteger(n) && n >= 0 && n <= 5 ? n : 4;
}

export default function StaffPin() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [who, setWho] = useState(0);
  const [pin, setPin] = useState(() => initialPin(search));

  const pick = (i: number) => {
    setWho(i);
    setPin(0);
  };
  const press = () => {
    const next = Math.min(6, pin + 1);
    setPin(next);
    if (next === 6) navigate('/desk/checkin');
  };
  const del = () => setPin(Math.max(0, pin - 1));

  return (
    <PhoneScreen padding="52px 20px 0">
      <header style={css("display: flex; align-items: center; gap: 12px")}>
          <div style={css("width: 40px; height: 40px; border-radius: 11px; background: #FFFFFF; overflow: hidden; flex-shrink: 0")}><img src="/brand/logo.jpg" alt="The Infinity Fitness" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} /></div>
          <div style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0")}>
            <span style={css("font-size: 17px; font-weight: 800")}>Front desk phone</span>
            <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Registered desk device <span style={css("font-family: 'JetBrains Mono', monospace")}>DSK-02</span></span>
          </div>
        </header>

        <h1 style={css("margin: 26px 0 0; font-size: 26px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em")}>Who is at the desk?</h1>

        <div role="radiogroup" aria-label="Staff member" style={css("margin-top: 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
          {PEOPLE.map(([initials, name, role], i) => (
        <button key={name} type="button" role="radio" aria-checked={i === who} onClick={() => pick(i)} style={css(`min-height: 64px; box-sizing: border-box; border: ${i === who ? '1px solid #FF6A00' : '1px solid rgba(255,255,255,0.06)'}; border-radius: 18px; background: #17171A; color: #FFFFFF; font-family: inherit; text-align: left; padding: 0 14px; display: flex; align-items: center; gap: 12px; cursor: pointer`)}>
          <span style={css("width: 36px; height: 36px; flex-shrink: 0; box-sizing: border-box; border-radius: 11px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #8E8E93")}>{initials}</span>
          <span style={css("display: flex; flex-direction: column; gap: 2px")}><span style={css("font-size: 15px; font-weight: 700")}>{name}</span><span style={css("font-size: 11px; color: #8E8E93")}>{role}</span></span>
        </button>
      ))}
        </div>

        <div style={css("margin-top: 26px; display: flex; flex-direction: column; align-items: center; gap: 12px")}>
          <span style={css("font-size: 13px; color: #8E8E93")}>Enter your 6-digit PIN</span>
          <div role="img" aria-label={`${pin} of 6 digits entered`} style={css("display: flex; gap: 14px")}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={css(`width: 14px; height: 14px; box-sizing: border-box; border-radius: 50%; background: ${i < pin ? '#FFFFFF' : 'transparent'}; border: 1.5px solid ${i < pin ? '#FFFFFF' : '#3F3F46'}`)}></span>
      ))}
          </div>
        </div>

        <div style={css("margin: 22px auto 0; width: 300px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px")}>
          {KEYS.map((k, i) => (
        <button key={i} type="button" aria-label={k === null ? 'Empty' : k} onClick={k === null ? undefined : press} style={css(`height: 60px; border: ${k === null ? '0' : '1px solid rgba(255,255,255,0.06)'}; border-radius: 18px; background: ${k === null ? 'transparent' : '#17171A'}; color: #FFFFFF; font-family: inherit; font-size: 24px; font-weight: 600; font-variant-numeric: tabular-nums; display: flex; align-items: center; justify-content: center; cursor: pointer; visibility: ${k === null ? 'hidden' : 'visible'}`)}>{k}</button>
      ))}
          <button type="button" aria-label="Delete last digit" onClick={del} style={css("height: 60px; border: 0; border-radius: 18px; background: transparent; color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer")}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path><path d="m12 9 6 6"></path><path d="m18 9-6 6"></path></svg></button>
        </div>

        <div style={css("margin-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center")}>
          <a href="#" onClick={(e) => e.preventDefault()} style={css("min-height: 44px; display: inline-flex; align-items: center; font-size: 13px; font-weight: 600; color: #A1A1AA; text-decoration: none")}>Forgot your PIN? The owner can reset it.</a>
          <span style={css("font-size: 12px; color: #8E8E93")}>5 wrong tries lock this device for 5 minutes.</span>
        </div>
    </PhoneScreen>
  );
}
