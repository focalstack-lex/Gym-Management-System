// Port of design/canvas/Owner-Staff.dc.html. Invite and revoke are demo actions; both are
// written to the audit log so the owner audit screen shows the result.

import { useState } from 'react';
import { css } from '../../lib/css';
import { useDemo } from '../../demo/store';
import { OwnerShell } from './OwnerShell';

export function Staff() {
  const { dispatch } = useDemo();
  const [invited, setInvited] = useState(false);
  const [revoked, setRevoked] = useState<Record<string, boolean>>({});
  const invite = () => {
    if (invited) return;
    setInvited(true);
    dispatch({ type: 'logAudit', action: 'Staff invited', target: 'New staff member', detail: 'Invitation created by Lex' });
  };
  const revoke = (device: string) => {
    if (revoked[device]) return;
    setRevoked((prev) => ({ ...prev, [device]: true }));
    dispatch({ type: 'logAudit', action: 'Staff device revoked', target: device, detail: 'Revoked by Lex' });
  };
  return (
    <OwnerShell>
      <div style={css("display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start")}>
        <main style={css("flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>
          <section aria-label="Staff" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px; padding: 24px; border-radius: 24px")}>
            <div style={css("display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 20px")}>
              <div style={css("display: flex; flex-direction: column; gap: 6px")}>
                <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                  Staff and devices
                </span>
                <h1 style={css("margin: 0; font-size: 28px; font-weight: 800; font-stretch: 110%")}>
                  Staff
                </h1>
              </div>
              <button type="button" onClick={invite} aria-pressed={invited} disabled={invited} style={css("height: 48px; padding: 0 20px; border: 0; border-radius: 14px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 14px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; text-decoration: none; ")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2">
                  </path>
                  <circle cx="9" cy="7" r="4">
                  </circle>
                  <line x1="19" x2="19" y1="8" y2="14">
                  </line>
                  <line x1="22" x2="16" y1="11" y2="11">
                  </line>
                </svg>
                {invited ? 'Invited' : 'Invite staff'}
              </button>
            </div>
            <div style={css("overflow-x: auto; max-width: 100%")}>
              <table style={css("border-collapse: collapse; width: 100%; min-width: 640px")}>
                <thead>
                  <tr>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Name
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Role
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      PIN status
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Last active
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-weight: 700")}>
                        Ana R.
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Front desk, primary
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Set, changed Sep 2
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>
                        Today, 6:42 PM
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-weight: 700")}>
                        Joel M.
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Front desk, relief
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Set, changed Aug 19
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>
                        Oct 16, 2:04 PM
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-weight: 700")}>
                        Coach Ramon
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Coach
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Set, changed Jul 8
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>
                        Today, 5:30 PM
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-weight: 700")}>
                        Lex
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Owner
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Set, changed Mar 3
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>
                        Today, 6:30 PM
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section aria-label="Role permissions" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
              Role permissions
            </span>
            <div style={css("overflow-x: auto; max-width: 100%")}>
              <table style={css("border-collapse: collapse; width: 100%; min-width: 640px")}>
                <thead>
                  <tr>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Action
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Ana R.
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Joel M.
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Coach Ramon
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Lex
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      Check in and record walk-ins
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      Renew memberships
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      Void a payment
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #A1A1AA")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <polyline points="12 6 12 12 16 14">
                          </polyline>
                        </svg>
                        <span>
                          Request only
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #A1A1AA")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <polyline points="12 6 12 12 16 14">
                          </polyline>
                        </svg>
                        <span>
                          Request only
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      Approve voids and corrections
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      Change prices
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      Manage staff and devices
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #8E8E93")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="M8 12h8">
                          </path>
                        </svg>
                        <span>
                          No
                        </span>
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("display: inline-flex; align-items: center; gap: 7px; color: #FFFFFF")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                          <circle cx="12" cy="12" r="10">
                          </circle>
                          <path d="m9 12 2 2 4-4">
                          </path>
                        </svg>
                        <span>
                          Yes
                        </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
        <aside style={css("flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>
          <section aria-label="Devices" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
              Bound desk devices
            </span>
            <p style={css("margin: 0; font-size: 13px; line-height: 1.5; color: #A1A1AA")}>
              Revoking a device signs it out and blocks it until it is bound again with a PIN.
            </p>
            <div style={css("overflow-x: auto; max-width: 100%")}>
              <table style={css("border-collapse: collapse; width: 100%; min-width: 560px")}>
                <thead>
                  <tr>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Device
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Bound to
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Last sync
                    </th>
                    <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Outbox
                    </th>
                    <th scope="col" style={css("text-align: right; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-weight: 700")}>
                        Front desk phone
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Ana R., front desk
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>
                        6:42 PM
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>
                        0
                      </span>
                    </td>
                    <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <button type="button" aria-label="Revoke Front desk phone" aria-pressed={!!revoked['Front desk phone']} disabled={!!revoked['Front desk phone']} onClick={() => revoke('Front desk phone')} style={css("height: 44px; padding: 0 18px; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; ")}>
                        {revoked['Front desk phone'] ? 'Revoked' : 'Revoke'}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-weight: 700")}>
                        Front desk tablet
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("color: #A1A1AA")}>
                        Front desk
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>
                        6:41 PM
                      </span>
                    </td>
                    <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93; white-space: nowrap")}>
                        0
                      </span>
                    </td>
                    <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                      <button type="button" aria-label="Revoke Front desk tablet" aria-pressed={!!revoked['Front desk tablet']} disabled={!!revoked['Front desk tablet']} onClick={() => revoke('Front desk tablet')} style={css("height: 44px; padding: 0 18px; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; background: transparent; color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; ")}>
                        {revoked['Front desk tablet'] ? 'Revoked' : 'Revoke'}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </aside>
      </div>
    </OwnerShell>
  );
}
