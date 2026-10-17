// Blind drawer count, spec section 8.1.4. Coins are counted as whole pesos.

import type { Centavos } from './money';
import { pesos } from './money';

export const BILL_DENOMINATIONS = [1000, 500, 200, 100, 50, 20] as const;

export type Bill = (typeof BILL_DENOMINATIONS)[number];

export interface DrawerCount {
  bills: Record<Bill, number>;
  coinsPesos: number;
}

function assertCount(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${label} must be a non-negative whole number: ${value}`);
  }
}

export function drawerTotal(count: DrawerCount): Centavos {
  let totalPesos = 0;
  for (const bill of BILL_DENOMINATIONS) {
    const n = count.bills[bill];
    assertCount(n, `Count of PHP ${bill} bills`);
    totalPesos += n * bill;
  }
  assertCount(count.coinsPesos, 'Coins');
  return pesos(totalPesos + count.coinsPesos);
}
