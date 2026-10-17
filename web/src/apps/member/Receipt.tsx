// Canvas artboard Member-Receipt. Share receipt uses the device share sheet when there is one.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneScreen } from '../../components/PhoneScreen';
import { css } from '../../lib/css';

const ROWS = [
  { label: 'Date', mono: true, value: 'Oct 15, 2026 4:12 PM', sub: null },
  { label: 'Member', mono: false, value: 'Mika Santos', sub: { mono: true, text: 'INF-00482' } },
  { label: 'Item', mono: false, value: 'Monthly membership', sub: { mono: false, text: 'Oct 15 to Nov 14, 2026' } },
  { label: 'Payment', mono: false, value: 'Cash', sub: null },
  { label: 'Received by', mono: false, value: 'Ana R.', sub: null },
];

const SHARE_TEXT = 'Acknowledgment receipt AR-2026-1015-0482, Monthly membership, Oct 15 to Nov 14, 2026, The Infinity Fitness, Digos City.';

export default function Receipt() {
  const [shareError, setShareError] = useState<string | null>(null);

  async function share() {
    setShareError(null);
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'Acknowledgment receipt', text: SHARE_TEXT });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(SHARE_TEXT);
      } else {
        setShareError('Sharing is not available on this device.');
      }
    } catch (err) {
      // Dismissing the share sheet rejects with AbortError; anything else is a real failure.
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setShareError('Could not share the receipt.');
    }
  }

  const bar = (
    <div style={css('position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box; padding: 14px 16px 34px; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08); display: flex; gap: 12px')}>
      <button type="button" onClick={() => void share()} style={css('flex: 1; height: 54px; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; background: #17171A; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <path d="m16 6-4-4-4 4"></path>
          <path d="M12 2v13"></path>
        </svg>
        Share receipt
      </button>
      <Link to="/m/notices" className="pressable" style={css('flex: 1; height: 54px; box-sizing: border-box; border-radius: 16px; background: #FF6A00; color: #000000; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; text-decoration: none')}>Done</Link>
    </div>
  );

  return (
    <PhoneScreen padding="52px 16px 0" bottomInset={150} bars={bar}>
      <header style={css('display: flex; align-items: center; gap: 12px')}>
        <Link to="/m/notices" aria-label="Back to Notices" style={css('width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; background: #17171A; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; display: flex; align-items: center; justify-content: center')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css('flex-shrink: 0')}>
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </Link>
        <h1 style={css('margin: 0; font-size: 22px; font-weight: 800; font-stretch: 110%; letter-spacing: -0.01em')}>Receipt</h1>
      </header>

      <article aria-label="Acknowledgment receipt AR-2026-1015-0482" style={css('margin-top: 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 18px 18px 16px')}>
        <div style={css('display: flex; align-items: center; gap: 12px; padding-bottom: 14px')}>
          <div style={css('width: 40px; height: 40px; border-radius: 11px; background: #FFFFFF; overflow: hidden; flex-shrink: 0')}>
            <img src="/brand/logo.jpg" alt="" style={css('width: 100%; height: 100%; object-fit: cover; display: block')} />
          </div>
          <div style={css('display: flex; flex-direction: column; gap: 3px')}>
            <span style={css('font-size: 13px; font-weight: 800; font-stretch: 125%; line-height: 1.1')}>THE INFINITY FITNESS</span>
            <span style={css('font-size: 11px; color: #8E8E93')}>Digos City</span>
          </div>
        </div>
        <div style={css('padding: 14px 0; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 6px')}>
          <h2 style={css('margin: 0; font-size: 20px; font-weight: 800; font-stretch: 108%')}>Acknowledgment receipt</h2>
          <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #A1A1AA")}>AR-2026-1015-0482</span>
        </div>
        <div style={css('border-top: 1px solid rgba(255,255,255,0.06)')}>
          {ROWS.map((r, i) => (
            <div key={r.label} style={i === 0 ? css('display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 11px 0') : css('display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 11px 0; border-top: 1px solid rgba(255,255,255,0.06)')}>
              <span style={css('font-size: 12px; color: #8E8E93; flex-shrink: 0')}>{r.label}</span>
              {r.mono ? (
                <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 14px; text-align: right")}>{r.value}</span>
              ) : (
                <span style={css('font-size: 14px; text-align: right')}>
                  {r.value}
                  {r.sub && (
                    <>
                      <br />
                      <span style={r.sub.mono ? css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A1A1AA") : css('font-size: 12px; color: #A1A1AA')}>{r.sub.text}</span>
                    </>
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
        <div style={css('display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 14px 0; border-top: 1px solid rgba(255,255,255,0.06)')}>
          <span style={css('font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>Amount</span>
          <span style={css('font-size: 26px; font-weight: 800; font-stretch: 112%; font-variant-numeric: tabular-nums')}>PHP [MONTHLY]</span>
        </div>
        <p style={css('margin: 0; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; line-height: 1.5; color: #8E8E93')}>This is an acknowledgment slip, not an official BIR receipt. Ask the desk for an official receipt.</p>
      </article>
      {shareError && (
        <p role="alert" style={css('margin: 12px 4px 0; font-size: 12px; color: #FF6961')}>{shareError}</p>
      )}
    </PhoneScreen>
  );
}
