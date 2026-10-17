// Port of design/canvas/Desk-Mobile-Activation.dc.html. The QR is the canvas placeholder pattern
// (same algorithm and size); the real token QR arrives with the backend.

import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';
import { newActivationCode, qrCells } from './_qr';

const INITIAL_CODE = 'K7QM 2XDF';
const DEFAULT_NAME = 'Jessa Lim';
const DEFAULT_MEMBER_CODE = 'INF-00731';
const DEFAULT_COVERAGE = 'Paid, Monthly, Oct 18 to Nov 17';

interface SlipState {
  name?: string;
  memberCode?: string;
  activationCode?: string;
  coverageLabel?: string;
}

export default function Activation() {
  const location = useLocation();
  const slip = (location.state as SlipState | null) ?? null;
  const [code, setCode] = useState(slip?.activationCode ?? INITIAL_CODE);
  const cells = useMemo(() => qrCells(), []);

  return (
    <PhoneScreen
      padding="52px 16px 0"
      bottomInset={150}
      bars={
        <div style={css("position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 16px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08)")}>
            <Link to="/desk/checkin" style={css("height: 54px; border-radius: 16px; background: #FF6A00; color: #000000; text-decoration: none; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800")}>Done, back to check-in</Link>
          </div>
      }
    >
      <header style={css("display: flex; align-items: center; gap: 12px")}>
          <Link to="/desk/enroll" aria-label="Back to enrollment" style={css("width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></Link>
          <div style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
            <h1 style={css("margin: 0; font-size: 20px; font-weight: 800")}>Member enrolled</h1>
            <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>{slip?.coverageLabel ?? DEFAULT_COVERAGE}</span>
          </div>
        </header>

        <article aria-label="Activation slip" style={css("margin-top: 18px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 18px; display: flex; flex-direction: column; gap: 16px")}>
          <div style={css("display: flex; align-items: center; gap: 12px")}>
            <div style={css("width: 40px; height: 40px; border-radius: 11px; background: #FFFFFF; overflow: hidden; flex-shrink: 0")}><img src="/brand/logo.jpg" alt="" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} /></div>
            <div style={css("display: flex; flex-direction: column; gap: 2px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>App activation</span>
              <span style={css("font-size: 18px; font-weight: 800")}>{slip?.name ?? DEFAULT_NAME}</span>
            </div>
            <span style={css("margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A1A1AA")}>{slip?.memberCode ?? DEFAULT_MEMBER_CODE}</span>
          </div>

          <div style={css("display: flex; align-items: center; gap: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06)")}>
            <div style={css("background: #FFFFFF; border-radius: 14px; padding: 10px; flex-shrink: 0")}>
              <div role="img" aria-label="Activation QR code" style={css("width: 126px; height: 126px; font-size: 0; line-height: 0")}>
                {cells.map((bg, i) => (
        <span key={i} style={css(`display: inline-block; width: 6px; height: 6px; vertical-align: top; background: ${bg}`)}></span>
      ))}
              </div>
            </div>
            <div style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>Activation code</span>
              <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 500; letter-spacing: 0.08em")}>{code}</span>
              <span style={css("display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #8E8E93")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Valid until Oct 20, 10:12 AM</span>
              <span style={css("font-size: 12px; color: #8E8E93")}>Works once.</span>
            </div>
          </div>

          <ol style={css("margin: 0; padding: 14px 0 0; list-style: none; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 10px; font-size: 13px; line-height: 1.4; color: #A1A1AA")}>
            <li style={css("display: flex; gap: 10px")}><span style={css("width: 20px; height: 20px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #FFFFFF")}>1</span>Open the Infinity Fitness app and tap Activate with your desk code.</li>
            <li style={css("display: flex; gap: 10px")}><span style={css("width: 20px; height: 20px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #FFFFFF")}>2</span>Scan this QR or type the code with your mobile number.</li>
            <li style={css("display: flex; gap: 10px")}><span style={css("width: 20px; height: 20px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 1px solid #3F3F46; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #FFFFFF")}>3</span>Set your password. Never share this code.</li>
          </ol>
        </article>

        <div style={css("margin-top: 12px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
          <button type="button" onClick={() => window.print()} style={css("height: 48px; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect width="12" height="8" x="6" y="14"></rect></svg>Print slip</button>
          <button type="button" onClick={() => setCode(newActivationCode())} style={css("height: 48px; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>New code</button>
        </div>
        <p style={css("margin: 10px 4px 0; font-size: 12px; line-height: 1.45; color: #8E8E93")}>A new code cancels this one. Codes are stored hashed and every issue is written to the audit log.</p>
    </PhoneScreen>
  );
}
