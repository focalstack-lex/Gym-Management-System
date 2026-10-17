import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(fileURLToPath(new URL('./tokens.css', import.meta.url)), 'utf8');

const expected: Record<string, string> = {
  '--bg-canvas': '#0C0C0E',
  '--bg-card': '#17171A',
  '--bg-card-elevated': '#1F1F23',
  '--border-hairline': 'rgba(255, 255, 255, 0.06)',
  '--color-accent': '#FF6A00',
  '--color-accent-dim': 'rgba(255, 106, 0, 0.15)',
  '--text-primary': '#FFFFFF',
  '--text-secondary': '#71717A',
  '--text-label': '#8E8E93',
  '--text-quiet': '#A1A1AA',
  '--text-muted': '#3F3F46',
  '--status-active': '#30D158',
  '--status-accent': '#FF6A00',
  '--status-frozen': '#64D2FF',
  '--status-expired': '#FF453A',
  '--status-expired-text': '#FF6961',
  '--status-gray': '#8E8E93',
  '--status-gray-dim': '#48484A',
  '--color-offline': '#FF9F0A',
  '--surface-rest-bar': '#2C2C2E',
  '--tabbar-bg': 'rgba(12, 12, 14, 0.82)',
  '--tabbar-hairline': 'rgba(255, 255, 255, 0.08)',
};

describe('design tokens', () => {
  it('declares every spec section 6 token with its exact value', () => {
    for (const [name, value] of Object.entries(expected)) {
      expect(css).toContain(`${name}: ${value};`);
    }
  });

  it('carries none of the retired tactile tokens', () => {
    for (const retired of ['#0E0E10', '#121214', '#1C1C1E', '#242428']) {
      expect(css.toUpperCase()).not.toContain(retired);
    }
  });
});
