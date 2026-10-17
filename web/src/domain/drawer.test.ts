import { describe, expect, it } from 'vitest';
import type { DrawerCount } from './drawer';
import { BILL_DENOMINATIONS, drawerTotal } from './drawer';
import { formatPhp } from './money';

const canvasCount: DrawerCount = {
  bills: { 1000: 2, 500: 3, 200: 4, 100: 6, 50: 5, 20: 8 },
  coinsPesos: 135,
};

describe('drawerTotal', () => {
  it('lists denominations from 1,000 down to 20', () => {
    expect([...BILL_DENOMINATIONS]).toEqual([1000, 500, 200, 100, 50, 20]);
  });

  it('matches the canvas handover count of PHP 5,445.00', () => {
    expect(formatPhp(drawerTotal(canvasCount))).toBe('PHP 5,445.00');
  });

  it('accepts an empty drawer', () => {
    expect(drawerTotal({ bills: { 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0 }, coinsPesos: 0 })).toBe(0);
  });

  it('rejects negative or fractional counts', () => {
    expect(() => drawerTotal({ ...canvasCount, bills: { ...canvasCount.bills, 500: -1 } })).toThrow(RangeError);
    expect(() => drawerTotal({ ...canvasCount, bills: { ...canvasCount.bills, 20: 1.5 } })).toThrow(RangeError);
    expect(() => drawerTotal({ ...canvasCount, coinsPesos: -5 })).toThrow(RangeError);
  });
});
