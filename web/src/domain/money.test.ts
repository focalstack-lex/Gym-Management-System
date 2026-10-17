import { describe, expect, it } from 'vitest';
import { formatPhp, pesos } from './money';

describe('money', () => {
  it('converts whole pesos to centavos', () => {
    expect(pesos(5445)).toBe(544500);
    expect(() => pesos(10.5)).toThrow(RangeError);
  });

  it('formats centavos as PHP with grouping and two decimals', () => {
    expect(formatPhp(544500)).toBe('PHP 5,445.00');
    expect(formatPhp(5)).toBe('PHP 0.05');
    expect(formatPhp(0)).toBe('PHP 0.00');
    expect(formatPhp(-12050)).toBe('-PHP 120.50');
    expect(formatPhp(123456789)).toBe('PHP 1,234,567.89');
  });

  it('rejects fractional centavos', () => {
    expect(() => formatPhp(1.5)).toThrow(RangeError);
  });
});
