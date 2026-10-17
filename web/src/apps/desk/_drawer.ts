// Blind drawer count form shared by the phone and desk station shift screens.
// The draft lives in the demo store (setDraftCount); the expected system total is never read here.

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useDemo } from '../../demo/store';
import { BILL_DENOMINATIONS, drawerTotal } from '../../domain/drawer';
import type { Bill, DrawerCount } from '../../domain/drawer';
import { formatPhp } from '../../domain/money';

const MAX_DIGITS = 7;

export interface DrawerRow {
  text: string;
  subtotal: string;
  onChange: (raw: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  setRef: (el: HTMLInputElement | null) => void;
}

const group = (n: number) => n.toLocaleString('en-US');

export function useDrawerDraft(): { rows: DrawerRow[]; whole: string; cents: string; locked: boolean; lock: () => void } {
  const { state, dispatch } = useDemo();
  const draft = state.drawer.draft;
  const [text, setText] = useState<string[]>(() => [...BILL_DENOMINATIONS.map((b) => String(draft.bills[b])), String(draft.coinsPesos)]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const locked = state.drawer.outgoing !== null;

  const push = (next: string[]) => {
    const bills = {} as Record<Bill, number>;
    BILL_DENOMINATIONS.forEach((b, i) => {
      bills[b] = Number(next[i] || 0);
    });
    const count: DrawerCount = { bills, coinsPesos: Number(next[BILL_DENOMINATIONS.length] || 0) };
    dispatch({ type: 'setDraftCount', count });
  };

  const rows: DrawerRow[] = text.map((value, i) => {
    const multiplier = i < BILL_DENOMINATIONS.length ? BILL_DENOMINATIONS[i] : 1;
    return {
      text: value,
      subtotal: group(Number(value || 0) * multiplier),
      onChange: (raw) => {
        // Digits only, whole numbers: anything else is dropped as it is typed.
        const digits = raw.replace(/\D/g, '').slice(0, MAX_DIGITS).replace(/^0+(?=\d)/, '');
        const next = text.map((t, j) => (j === i ? digits : t));
        setText(next);
        push(next);
      },
      onKeyDown: (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        // Return jumps to the next field, 1,000 down to coins.
        const nextField = refs.current[i + 1];
        if (nextField) nextField.focus();
        else e.currentTarget.blur();
      },
      setRef: (el) => {
        refs.current[i] = el;
      },
    };
  });

  const [whole, cents] = formatPhp(drawerTotal(draft)).replace('PHP ', '').split('.');
  return { rows, whole, cents, locked, lock: () => dispatch({ type: 'lockCount', role: 'outgoing' }) };
}
