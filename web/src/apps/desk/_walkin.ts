// Walk-in form state shared by the phone walk-in screen and the desk station register.

import { useState } from 'react';
import type { PaymentMode } from '../../demo/seed';
import { useDemo } from '../../demo/store';

export const MODE_LABEL: Record<PaymentMode, string> = { cash: 'Cash', gcash: 'GCash', maya: 'Maya' };

export function useWalkInForm() {
  const { dispatch } = useDemo();
  const [name, setName] = useState('');
  const [mode, setMode] = useState<PaymentMode>('gcash');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const submit = (): boolean => {
    if (!name.trim()) {
      setError('Enter the visitor name.');
      return false;
    }
    if (mode !== 'cash' && !/^\d{4,}$/.test(reference)) {
      setError(`Enter the ${MODE_LABEL[mode]} reference number, digits only.`);
      return false;
    }
    setError('');
    dispatch({ type: 'recordWalkIn', name, mode, reference: mode === 'cash' ? null : reference });
    setName('');
    setReference('');
    return true;
  };

  return {
    name,
    mode,
    reference,
    error,
    setName,
    setMode,
    // Digits only: strips anything else as it is typed.
    setReference: (value: string) => setReference(value.replace(/\D/g, '')),
    submit,
  };
}
