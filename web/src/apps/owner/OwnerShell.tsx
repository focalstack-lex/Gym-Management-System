// Shared header card and section nav of the five owner pages (Owner-Dashboard, Owner-Plans,
// Owner-Approvals, Owner-Staff, Owner-Audit). The current page comes from the route.

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { css } from '../../lib/css';

const SECTIONS = [
  { to: '/owner', label: 'Dashboard' },
  { to: '/owner/plans', label: 'Plans and prices' },
  { to: '/owner/approvals', label: 'Approvals' },
  { to: '/owner/staff', label: 'Staff and devices' },
  { to: '/owner/audit', label: 'Audit log' },
];

export function OwnerShell({ children }: { children: ReactNode }) {
  const path = useLocation().pathname.replace(/\/+$/, '') || '/';
  return (
    <div className="screen-enter" style={css("min-height: 980px; box-sizing: border-box; background: #0C0C0E; color: #FFFFFF; font-family: 'Archivo', system-ui, sans-serif; padding: 20px 16px 32px")}>
      <div style={css("max-width: 1440px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px")}>
        <header style={css("display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; padding: 10px 14px 10px 10px; border-radius: 20px; background: #17171A; border: 1px solid rgba(255,255,255,0.06)")}>
          <div style={css("display: flex; align-items: center; gap: 12px; flex-grow: 1; min-width: 220px")}>
            <div style={css("width: 44px; height: 44px; border-radius: 12px; background: #FFFFFF; overflow: hidden; flex-shrink: 0")}>
              <img src="/brand/logo.jpg" alt="The Infinity Fitness" style={css("width: 100%; height: 100%; object-fit: cover; display: block")} />
            </div>
            <div style={css("display: flex; flex-direction: column; gap: 2px")}>
              <span style={css("font-size: 16px; font-weight: 800")}>Owner</span>
              <span style={css("font-size: 12px; color: #8E8E93")}>The Infinity Fitness, Digos City</span>
            </div>
          </div>
          <span style={css("font-size: 13px; color: #8E8E93")}>Saturday, Oct 17, 2026</span>
        </header>

        <nav aria-label="Owner sections" style={css("display: flex; flex-wrap: wrap; gap: 4px; padding: 3px; border-radius: 14px; background: #0C0C0E; border: 1px solid rgba(255,255,255,0.06); align-self: flex-start; max-width: 100%; box-sizing: border-box")}>
          {SECTIONS.map((s) =>
            s.to === path ? (
              <Link key={s.to} to={s.to} aria-current="page" style={css("display: inline-flex; align-items: center; height: 44px; padding: 0 18px; box-sizing: border-box; border-radius: 12px; background: #1F1F23; border: 1px solid rgba(255,255,255,0.06); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700")}>{s.label}</Link>
            ) : (
              <Link key={s.to} to={s.to} style={css("display: inline-flex; align-items: center; height: 44px; padding: 0 18px; box-sizing: border-box; border-radius: 12px; border: 1px solid transparent; color: #8E8E93; text-decoration: none; font-size: 14px; font-weight: 600")}>{s.label}</Link>
            ),
          )}
        </nav>

        {children}
      </div>
    </div>
  );
}
