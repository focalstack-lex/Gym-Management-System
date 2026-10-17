// Port of design/canvas/Owner-Plans.dc.html. The price form validates the new price and
// effective date, then stores a scheduled version in the demo store and shows it in history.

import { useRef, useState } from 'react';
import { css } from '../../lib/css';
import { isoDate } from '../../domain/dates';
import { useDemo } from '../../demo/store';
import { OwnerShell } from './OwnerShell';

const MIN_DATE = '2026-10-18';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateLabel = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
};

export function Plans() {
  const { state, dispatch } = useDemo();
  const [price, setPrice] = useState('');
  const [effective, setEffective] = useState('2026-11-01');
  const [note, setNote] = useState('');
  const [priceBad, setPriceBad] = useState(false);
  const [dateBad, setDateBad] = useState(false);
  const priceRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  function save() {
    const amount = Number(price.replace(/,/g, '').trim());
    const priceOk = /^[0-9][0-9,]*(\.[0-9]{1,2})?$/.test(price.trim()) && Number.isFinite(amount) && amount > 0;
    const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(effective) && effective >= MIN_DATE;
    setPriceBad(!priceOk);
    setDateBad(!dateOk);
    if (!priceOk) {
      priceRef.current?.focus();
      return;
    }
    if (!dateOk) {
      dateRef.current?.focus();
      return;
    }
    dispatch({ type: 'schedulePrice', price: price.trim(), effective: isoDate(effective), note: note.trim() || null });
    setPrice('');
    setNote('');
  }

  return (
    <OwnerShell>
      <div style={css("display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start")}>
        <main style={css("flex: 999 1 560px; min-width: 0; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px; padding: 24px; border-radius: 24px")}>
          <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
            Plans and prices
          </span>
          <h1 style={css("margin: 0; font-size: 28px; font-weight: 800; font-stretch: 110%")}>
            Plan catalogue
          </h1>
          <p style={css("margin: 0; font-size: 14px; line-height: 1.5; color: #A1A1AA")}>
            Memberships get 3 grace days after the end date. A retired plan stays on existing members but is no longer sold at the desk.
          </p>
          <div style={css("overflow-x: auto; max-width: 100%")}>
            <table style={css("border-collapse: collapse; width: 100%; min-width: 760px")}>
              <thead>
                <tr>
                  <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                    Plan
                  </th>
                  <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                    Length
                  </th>
                  <th scope="col" style={css("text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                    Price
                  </th>
                  <th scope="col" style={css("text-align: right; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                    Grace days
                  </th>
                  <th scope="col" style={css("text-align: right; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93; white-space: nowrap")}>
                    Active members
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
                      Monthly
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      1 month
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700; font-variant-numeric: tabular-nums")}>
                      PHP [PRICE]
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      3
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-variant-numeric: tabular-nums")}>
                      88
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
                      3-month
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      3 months
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700; font-variant-numeric: tabular-nums")}>
                      PHP [PRICE]
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      3
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-variant-numeric: tabular-nums")}>
                      27
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
                      6-month
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      6 months
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700; font-variant-numeric: tabular-nums")}>
                      PHP [PRICE]
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      3
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-variant-numeric: tabular-nums")}>
                      15
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
                      Student monthly
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      1 month
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700; font-variant-numeric: tabular-nums")}>
                      PHP [PRICE]
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      3
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-variant-numeric: tabular-nums")}>
                      20
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
                      Senior monthly
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      1 month
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700; font-variant-numeric: tabular-nums")}>
                      PHP [PRICE]
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      3
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-variant-numeric: tabular-nums")}>
                      10
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
                      Walk-in day pass
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      1 day
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700; font-variant-numeric: tabular-nums")}>
                      PHP [PRICE]
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      -
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-variant-numeric: tabular-nums")}>
                      0
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
                      PT 8-session package
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      8 sessions
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700; font-variant-numeric: tabular-nums")}>
                      PHP [PRICE]
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      -
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-variant-numeric: tabular-nums")}>
                      6
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={css("flex-shrink: 0")}>
                        <circle cx="12" cy="12" r="10">
                        </circle>
                        <path d="M8 12h8">
                        </path>
                      </svg>
                      Retired
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700")}>
                      PT 12-session package
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      12 sessions
                    </span>
                  </td>
                  <td style={css("text-align: left; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-weight: 700; font-variant-numeric: tabular-nums")}>
                      PHP [PRICE]
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("color: #A1A1AA")}>
                      -
                    </span>
                  </td>
                  <td style={css("text-align: right; padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; vertical-align: middle")}>
                    <span style={css("font-variant-numeric: tabular-nums")}>
                      9
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
        </main>
        <aside style={css("flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 16px")}>
          <section aria-label="Edit Monthly" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
              Price version history
            </span>
            <h2 style={css("margin: 0; font-size: 20px; font-weight: 800")}>
              Edit Monthly
            </h2>
            <ol style={css("list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column")}>
              {state.priceVersions.map((v, i) => (
                <li key={v.id} style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 56px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                  <div style={css("display: flex; flex-direction: column; gap: 2px")}>
                    <span style={css("font-size: 14px; font-weight: 700; color: #FFFFFF")}>
                      {`Version ${3 + state.priceVersions.length - i}, scheduled`}
                    </span>
                    <span style={css("font-size: 12px; color: #8E8E93")}>
                      {`From ${dateLabel(v.effective)}`}
                    </span>
                  </div>
                  <span style={css("font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; color: #FFFFFF")}>
                    {`PHP ${v.price}`}
                  </span>
                </li>
              ))}
              <li style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 56px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <div style={css("display: flex; flex-direction: column; gap: 2px")}>
                  <span style={css("font-size: 14px; font-weight: 700; color: #FFFFFF")}>
                    Version 3, current
                  </span>
                  <span style={css("font-size: 12px; color: #8E8E93")}>
                    From Oct 1, 2026
                  </span>
                </div>
                <span style={css("font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; color: #FFFFFF")}>
                  PHP [PRICE]
                </span>
              </li>
              <li style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 56px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <div style={css("display: flex; flex-direction: column; gap: 2px")}>
                  <span style={css("font-size: 14px; font-weight: 700; color: #A1A1AA")}>
                    Version 2
                  </span>
                  <span style={css("font-size: 12px; color: #8E8E93")}>
                    Apr 1, 2026 to Sep 30, 2026
                  </span>
                </div>
                <span style={css("font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; color: #8E8E93")}>
                  PHP [PRICE]
                </span>
              </li>
              <li style={css("display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 56px; border-top: 1px solid rgba(255,255,255,0.06)")}>
                <div style={css("display: flex; flex-direction: column; gap: 2px")}>
                  <span style={css("font-size: 14px; font-weight: 700; color: #A1A1AA")}>
                    Version 1
                  </span>
                  <span style={css("font-size: 12px; color: #8E8E93")}>
                    Jan 1, 2025 to Mar 31, 2026
                  </span>
                </div>
                <span style={css("font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; color: #8E8E93")}>
                  PHP [PRICE]
                </span>
              </li>
            </ol>
          </section>
          <section aria-label="Schedule a new price" style={css("background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 20px; display: flex; flex-direction: column; gap: 14px")}>
            <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
              Schedule a new price
            </span>
            <form noValidate onSubmit={(e) => { e.preventDefault(); save(); }} style={css("display: flex; flex-direction: column; gap: 14px")}>
              <label style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
                <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                  New price
                </span>
                <input ref={priceRef} type="text" inputMode="decimal" placeholder="PHP [PRICE]" value={price} onChange={(e) => setPrice(e.target.value)} aria-invalid={priceBad || undefined} style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px; width: 100%; min-width: 0")} />
              </label>
              <label style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
                <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                  Effective from
                </span>
                <input ref={dateRef} type="date" value={effective} onChange={(e) => setEffective(e.target.value)} min={MIN_DATE} aria-invalid={dateBad || undefined} style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px; width: 100%; min-width: 0")} />
              </label>
              <label style={css("display: flex; flex-direction: column; gap: 6px; min-width: 0")}>
                <span style={css("font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93")}>
                  Note for the audit log
                </span>
                <input type="text" placeholder="Optional reason" value={note} onChange={(e) => setNote(e.target.value)} style={css("height: 48px; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 0 14px; background: #0C0C0E; color: #FFFFFF; font-family: inherit; font-size: 15px; width: 100%; min-width: 0")} />
              </label>
              <p style={css("margin: 0; font-size: 13px; line-height: 1.5; color: #A1A1AA")}>
                The new price applies to payments recorded on or after the effective date. Past payments keep the price they were taken at.
              </p>
              <button type="button" onClick={save} style={css("height: 52px; padding: 0 20px; border: 0; border-radius: 14px; background: #FF6A00; color: #000000; font-family: inherit; font-size: 14px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; text-decoration: none; width: 100%; font-size: 15px")}>
                Save new price version
              </button>
            </form>
          </section>
        </aside>
      </div>
    </OwnerShell>
  );
}
