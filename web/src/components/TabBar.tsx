// Shared renderer for the three iOS tab bars on the canvas (member, desk, coach).
// Style strings are the canvas strings; only the active tab color is data-driven.

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { css } from '../lib/css';

export interface Tab {
  key: string;
  label: string;
  to: string;
  icon: ReactNode;
  centerKey?: boolean;
}


export function TabBar({
  label,
  tabs,
  active,
  justifyStart,
}: {
  label: string;
  tabs: Tab[];
  active: string | null;
  // The member bar's tabs carry justify-content: flex-start on the canvas; desk and coach do not.
  justifyStart: boolean;
}) {
  return (
    <nav aria-label={label} style={css("position: absolute; left: 0; right: 0; bottom: 0; height: 83px; box-sizing: border-box; padding: 6px 8px 34px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: start; background: rgba(12,12,14,0.82); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border-top: 0.5px solid rgba(255,255,255,0.08)")}>
      {tabs.map((tab) => {
        const on = tab.key === active;
        const color = on ? '#FF6A00' : '#71717A';
        const anchor = justifyStart
          ? css(`min-height: 49px; color: ${color}; text-decoration: none; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 2px; font-size: 10px; font-weight: 600`)
          : css(`min-height: 49px; color: ${color}; text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 10px; font-weight: 600`);
        const wrap = tab.centerKey
          ? css('width: 48px; height: 32px; border-radius: 10px; background: #FF6A00; color: #000000; display: flex; align-items: center; justify-content: center')
          : justifyStart
            ? css('height: 32px; display: flex; align-items: center; justify-content: center')
            : css('height: 32px; display: flex; align-items: center');
        return (
          <Link key={tab.key} to={tab.to} aria-current={on ? 'page' : undefined} className={on ? 'tab-link tab-link-active' : 'tab-link'} style={anchor}>
            <span className={tab.centerKey ? 'tab-icon tab-key' : 'tab-icon'} style={wrap}>{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export const icon24 = (children: ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const icon20Key = (children: ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
