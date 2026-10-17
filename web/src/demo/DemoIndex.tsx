// Demo-mode launcher listing every screen. Not part of the product design.

import { Link } from 'react-router-dom';
import { css } from '../lib/css';
import { SCREENS } from './screens';

export function DemoIndex() {
  return (
    <main style={css("min-height: 100dvh; box-sizing: border-box; padding: 32px 16px; background: #0C0C0E; color: #FFFFFF; font-family: 'Archivo', system-ui, sans-serif")}>
      <div style={css('max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px')}>
        <h1 style={css('margin: 0; font-size: 26px; font-weight: 800')}>The Infinity Fitness, demo mode</h1>
        <p style={css('margin: 0; font-size: 14px; color: #8E8E93')}>In-memory data, clock fixed at Saturday, Oct 17, 2026, 6:42 PM.</p>
        {SCREENS.map((group) => (
          <section key={group.app} style={css('display: flex; flex-direction: column; gap: 8px')}>
            <h2 style={css('margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8E8E93')}>{group.app}</h2>
            <ul style={css('list-style: none; margin: 0; padding: 0 16px; background: #17171A; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px')}>
              {group.items.map((item, i) => (
                <li key={item.path} style={{ borderTop: i === 0 ? '0' : '1px solid rgba(255,255,255,0.06)' }}>
                  <Link to={item.path} style={css('display: flex; justify-content: space-between; gap: 12px; min-height: 48px; align-items: center; color: #FFFFFF; text-decoration: none; font-size: 15px')}>
                    <span>{item.label}</span>
                    <span style={css("font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8E8E93")}>{item.path}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
