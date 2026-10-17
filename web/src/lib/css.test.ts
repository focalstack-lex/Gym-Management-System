import { describe, expect, it } from 'vitest';
import { css } from './css';

describe('css', () => {
  it('converts declarations to camelCase React style keys, values verbatim', () => {
    expect(css('width: 44px; border-radius: 50%; font-variant-numeric: tabular-nums')).toEqual({
      width: '44px',
      borderRadius: '50%',
      fontVariantNumeric: 'tabular-nums',
    });
  });

  it('keeps vendor prefixes, custom properties and parenthesised values intact', () => {
    expect(
      css("-webkit-backdrop-filter: blur(20px) saturate(160%); --x: 1; background: rgba(12,12,14,0.82); font-family: 'Archivo', system-ui, sans-serif"),
    ).toEqual({
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      '--x': '1',
      background: 'rgba(12,12,14,0.82)',
      fontFamily: "'Archivo', system-ui, sans-serif",
    });
  });

  it('rejects a declaration without a colon', () => {
    expect(() => css('width 44px')).toThrow();
  });
});
