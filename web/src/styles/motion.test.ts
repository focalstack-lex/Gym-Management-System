import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const motion = readFileSync(fileURLToPath(new URL('./animations.css', import.meta.url)), 'utf8');
const tokens = readFileSync(fileURLToPath(new URL('./tokens.css', import.meta.url)), 'utf8');

describe('motion system', () => {
  it('declares every motion token and Apple easing', () => {
    for (const token of [
      '--motion-instant: 100ms;',
      '--motion-fast: 160ms;',
      '--motion-normal: 240ms;',
      '--motion-deliberate: 360ms;',
      '--motion-sheet: 420ms;',
      '--ease-apple-spring: cubic-bezier(0.32, 0.72, 0, 1);',
      '--ease-in-out-smooth: cubic-bezier(0.4, 0, 0.2, 1);',
      '--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);',
      '--ease-bounce-back: cubic-bezier(0.34, 1.56, 0.64, 1);',
      '--scale-tap-card: scale(0.985);',
      '--scale-tap-button: scale(0.97);',
      '--scale-tap-tab: scale(0.92);',
    ]) {
      expect(tokens).toContain(token);
    }
  });

  it('ships the shared keyframes and utilities', () => {
    for (const name of [
      'iosFadeIn',
      'iosScreenIn',
      'iosSlideUp',
      'iosSheetUp',
      'scanSweep',
      'cardPop',
      'checkPop',
      'rowIn',
      'rowFlash',
      'passReveal',
      'qrBreathe',
      'shareCardIn',
      'calendarInLeft',
      'calendarInRight',
      'barGrowY',
      'barGrowX',
      'countRoll',
      'padlockSnap',
      'approvalLeave',
    ]) {
      expect(motion).toContain(`@keyframes ${name}`);
    }
    for (const utility of ['.screen-enter', '.animate-fade-in', '.animate-slide-up', '.stagger', '.pressable', '.sheet-panel', '.sheet-scrim', '.scan-laser']) {
      expect(motion).toContain(utility);
    }
  });

  it('honours reduced motion', () => {
    expect(motion).toContain('@media (prefers-reduced-motion: reduce)');
    expect(motion).toContain('animation-duration: 0.01ms !important;');
    expect(motion).toContain('transition-duration: 0.01ms !important;');
  });

  it('never animates layout properties inside keyframes', () => {
    const blocks = [...motion.matchAll(/@keyframes\s+\w+\s*\{([\s\S]*?)\n\}/g)].map((m) => m[1]);
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      expect(block).not.toMatch(/(?:^|[;{]\s*)(?:top|left|right|bottom|width|height|margin|padding)\s*:/);
    }
  });
});
