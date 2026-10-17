// Port of design/canvas/Owner-Dashboard.dc.html. Check-in and walk-in tiles come from the
// sign-in sheet; the rest renders the canvas content.

import { Link } from 'react-router-dom';
import { css } from '../../lib/css';
import { useDemo } from '../../demo/store';
import { sheetCounts } from '../../demo/state';
import { OwnerShell } from './OwnerShell';

export function Dashboard() {
  const { state } = useDemo();
  const counts = sheetCounts(state);
  return (
    <OwnerShell>
      <div style={css("display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px")}>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 10px")}>
          <span style={css("font-size: 56px; line-height: 1; font-weight: 800; font-stretch: 118%; font-variant-numeric: tabular-nums")}>
            {counts.checkIns}
          </span>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
            Check-ins
          </span>
        </div>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 10px")}>
          <span style={css("font-size: 56px; line-height: 1; font-weight: 800; font-stretch: 118%; font-variant-numeric: tabular-nums")}>
            {counts.walkIns}
          </span>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
            Walk-ins
          </span>
        </div>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 10px")}>
          <span style={css("font-size: 56px; line-height: 1; font-weight: 800; font-stretch: 118%; font-variant-numeric: tabular-nums")}>
            3
          </span>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
            Renewals
          </span>
        </div>
        <div style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 10px")}>
          <span style={css("font-size: 56px; line-height: 1; font-weight: 800; font-stretch: 118%; font-variant-numeric: tabular-nums")}>
            1
          </span>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
            New members
          </span>
        </div>
      </div>
      <div style={css("display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start")}>
        <main style={css("flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>
          <section aria-label="Revenue by payment mode" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <div style={css("display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                Revenue by payment mode
              </span>
              <span style={css("font-size: 12px; color: #8E8E93")}>
                13 payments today
              </span>
            </div>
            <div role="img" aria-label="Share of payments today: cash 7 of 13, GCash 4, Maya 2" style={css("display: flex; gap: 3px; height: 2px")}>
              <span style={css("flex: 7; background: #E4E4E7")}>
              </span>
              <span style={css("flex: 4; background: #71717A")}>
              </span>
              <span style={css("flex: 2; background: #3F3F46")}>
              </span>
            </div>
            <div style={css("display: flex; flex-direction: column")}>
              <div style={css("display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("font-size: 14px; font-weight: 600; flex: 1 1 80px")}>
                  Cash
                </span>
                <span style={css("font-size: 12px; color: #8E8E93")}>
                  7 payments
                </span>
                <span style={css("font-size: 18px; font-weight: 800; font-variant-numeric: tabular-nums; min-width: 120px; text-align: right")}>
                  PHP [TOTAL]
                </span>
              </div>
              <div style={css("display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("font-size: 14px; font-weight: 600; flex: 1 1 80px")}>
                  GCash
                </span>
                <span style={css("font-size: 12px; color: #8E8E93")}>
                  4 payments
                </span>
                <span style={css("font-size: 18px; font-weight: 800; font-variant-numeric: tabular-nums; min-width: 120px; text-align: right")}>
                  PHP [TOTAL]
                </span>
              </div>
              <div style={css("display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("font-size: 14px; font-weight: 600; flex: 1 1 80px")}>
                  Maya
                </span>
                <span style={css("font-size: 12px; color: #8E8E93")}>
                  2 payments
                </span>
                <span style={css("font-size: 18px; font-weight: 800; font-variant-numeric: tabular-nums; min-width: 120px; text-align: right")}>
                  PHP [TOTAL]
                </span>
              </div>
            </div>
          </section>
          <section aria-label="Hourly entries" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <div style={css("display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                Entries per hour
              </span>
              <span style={css("font-size: 12px; color: #8E8E93")}>
                56 entries so far, busiest now at 6 PM with 8
              </span>
            </div>
            <div role="img" aria-label="Entries per hour from 6 AM: 4, 6, 5, 3, 3, 2, 3, 4, 3, 3, 5, 7, 8 at 6 PM" style={css("display: flex; flex-direction: column; gap: 6px")}>
              <div style={css("display: flex; align-items: flex-end; gap: 4px; height: 96px")}>
                <span style={css("flex: 1; height: 50%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 75%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 62%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 38%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 38%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 25%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 38%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 50%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 38%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 38%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 62%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 88%; border-radius: 1px; background: #71717A")}>
                </span>
                <span style={css("flex: 1; height: 100%; border-radius: 1px; background: #FFFFFF")}>
                </span>
                <span style={css("flex: 1; height: 2px; border-radius: 1px; background: #3F3F46")}>
                </span>
                <span style={css("flex: 1; height: 2px; border-radius: 1px; background: #3F3F46")}>
                </span>
                <span style={css("flex: 1; height: 2px; border-radius: 1px; background: #3F3F46")}>
                </span>
              </div>
              <div style={css("display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8E8E93")}>
                <span>
                  6 AM
                </span>
                <span>
                  12 PM
                </span>
                <span>
                  6 PM
                </span>
                <span>
                  9 PM
                </span>
              </div>
            </div>
          </section>
          <section aria-label="Membership health" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <div style={css("display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                Membership health
              </span>
              <span style={css("font-size: 12px; color: #8E8E93")}>
                232 members in total
              </span>
            </div>
            <div style={css("display: flex; flex-direction: column")}>
              <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                    <circle cx="12" cy="12" r="10">
                    </circle>
                    <path d="m9 12 2 2 4-4">
                    </path>
                  </svg>
                  Active
                </span>
                <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>
                  142
                </span>
              </div>
              <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                    <circle cx="12" cy="12" r="10">
                    </circle>
                    <polyline points="12 6 12 12 16 14">
                    </polyline>
                  </svg>
                  Expiring soon
                </span>
                <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>
                  11
                </span>
              </div>
              <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                    <circle cx="12" cy="12" r="10">
                    </circle>
                    <line x1="12" x2="12" y1="8" y2="12">
                    </line>
                    <line x1="12" x2="12.01" y1="16" y2="16">
                    </line>
                  </svg>
                  Grace
                </span>
                <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>
                  4
                </span>
              </div>
              <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FF6961; white-space: nowrap")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                    <circle cx="12" cy="12" r="10">
                    </circle>
                    <path d="m15 9-6 6">
                    </path>
                    <path d="m9 9 6 6">
                    </path>
                  </svg>
                  Expired
                </span>
                <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>
                  23
                </span>
              </div>
              <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64D2FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                    <circle cx="12" cy="12" r="10">
                    </circle>
                    <line x1="10" x2="10" y1="15" y2="9">
                    </line>
                    <line x1="14" x2="14" y1="15" y2="9">
                    </line>
                  </svg>
                  Frozen
                </span>
                <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>
                  3
                </span>
              </div>
              <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                    <circle cx="12" cy="12" r="10">
                    </circle>
                    <path d="M8 12h8">
                    </path>
                  </svg>
                  Inactive
                </span>
                <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>
                  18
                </span>
              </div>
              <div style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#48484A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z">
                    </path>
                  </svg>
                  Dormant
                </span>
                <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>
                  31
                </span>
              </div>
            </div>
          </section>
        </main>
        <aside style={css("flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>
          <section aria-label="Cash drawer" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
              Cash drawer, Ana's shift
            </span>
            <div style={css("display: flex; flex-direction: column; gap: 6px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                Ana's blind count
              </span>
              <span style={css("font-size: 36px; line-height: 1; font-weight: 800; font-stretch: 115%; font-variant-numeric: tabular-nums")}>
                5,445
                <span style={css("font-size: 16px; font-weight: 600; color: #8E8E93")}>
                  .00 PHP
                </span>
              </span>
            </div>
            <div style={css("display: flex; flex-direction: column")}>
              <div style={css("display: flex; align-items: center; gap: 10px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2">
                  </rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4">
                  </path>
                </svg>
                <span style={css("color: #FFFFFF; font-weight: 600")}>
                  Count locked
                </span>
              </div>
              <div style={css("display: flex; align-items: center; gap: 10px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #A1A1AA")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                  <circle cx="12" cy="12" r="10">
                  </circle>
                  <polyline points="12 6 12 12 16 14">
                  </polyline>
                </svg>
                <span>
                  Waiting for Joel's count
                </span>
              </div>
              <div style={css("display: flex; align-items: center; gap: 10px; min-height: 46px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: #A1A1AA")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49">
                  </path>
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242">
                  </path>
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143">
                  </path>
                  <path d="m2 2 20 20">
                  </path>
                </svg>
                <span>
                  Expected total hidden until both lock
                </span>
              </div>
            </div>
          </section>
          <section aria-label="Approvals waiting" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <div style={css("display: flex; align-items: baseline; justify-content: space-between; gap: 12px")}>
              <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                Approvals waiting
              </span>
              <span style={css("font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums")}>
                3
              </span>
            </div>
            <ul style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
              <li style={css("display: flex; flex-direction: column; gap: 2px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("font-size: 14px; font-weight: 700")}>
                  Void
                </span>
                <span style={css("font-size: 13px; color: #A1A1AA")}>
                  Duplicate GCash walk-in, ref ending 4402
                </span>
              </li>
              <li style={css("display: flex; flex-direction: column; gap: 2px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("font-size: 14px; font-weight: 700")}>
                  Correction
                </span>
                <span style={css("font-size: 13px; color: #A1A1AA")}>
                  Den Villanueva, renewal date
                </span>
              </li>
              <li style={css("display: flex; flex-direction: column; gap: 2px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <span style={css("font-size: 14px; font-weight: 700")}>
                  Backdated freeze
                </span>
                <span style={css("font-size: 13px; color: #A1A1AA")}>
                  Bea Navarro, from Oct 10
                </span>
              </li>
            </ul>
            <Link to="/owner/approvals" style={css("height: 44px; padding: 0 20px; border: 0; border-radius: 14px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 14px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; text-decoration: none; align-self: flex-start")}>
              Review approvals
            </Link>
          </section>
          <section aria-label="End-of-day summary" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
              End of day, so far
            </span>
            <ol style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
              <li style={css("padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; line-height: 1.5; color: #A1A1AA")}>
                47 check-ins and 9 walk-ins so far, busiest hour is 6 PM.
              </li>
              <li style={css("padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; line-height: 1.5; color: #A1A1AA")}>
                3 renewals and 1 new member enrolled.
              </li>
              <li style={css("padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; line-height: 1.5; color: #A1A1AA")}>
                6 e-wallet references logged, none unmatched.
              </li>
              <li style={css("padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; line-height: 1.5; color: #A1A1AA")}>
                1 entry allowed with a logged reason: Paolo Reyes, "Will pay before leaving".
              </li>
            </ol>
          </section>
          <section aria-label="Gym closure" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
              Gym closure
            </span>
            <p style={css("margin: 0; font-size: 14px; line-height: 1.5; color: #A1A1AA")}>
              Declaring a closure extends every active membership by the closed days and notifies members in the app.
            </p>
            <button type="button" style={css("height: 44px; padding: 0 18px; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; align-self: flex-start")}>
              Declare closure
            </button>
          </section>
        </aside>
      </div>
    </OwnerShell>
  );
}
