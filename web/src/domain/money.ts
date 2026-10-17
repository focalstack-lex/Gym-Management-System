// Money is always integer centavos; never floating-point pesos.

export type Centavos = number;

export function pesos(amount: number): Centavos {
  if (!Number.isInteger(amount)) throw new RangeError(`pesos must be a whole number: ${amount}`);
  return amount * 100;
}

export function formatPhp(amount: Centavos): string {
  if (!Number.isInteger(amount)) throw new RangeError(`centavos must be an integer: ${amount}`);
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const whole = Math.floor(abs / 100).toLocaleString('en-US');
  const cents = String(abs % 100).padStart(2, '0');
  return `${sign}PHP ${whole}.${cents}`;
}
