// Helpers for the activation slip (Desk-Mobile-Activation).

const N = 21;

// The canvas placeholder QR, ported unchanged from its qrCells(): a seeded pattern with
// three finder squares and timing lines. Returns the background color of each cell.
export function qrCells(): string[] {
  let seed = 731;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const finder = (r: number, c: number): number => {
    for (const [r0, c0] of [
      [0, 0],
      [0, N - 7],
      [N - 7, 0],
    ]) {
      const dr = r - r0;
      const dc = c - c0;
      if (dr >= -1 && dr <= 7 && dc >= -1 && dc <= 7) {
        if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return 0;
        return Math.min(dr, dc, 6 - dr, 6 - dc) === 1 ? 0 : 1;
      }
    }
    return -1;
  };
  const cells: string[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let on = finder(r, c);
      if (on === -1) on = r === 6 ? (c % 2 === 0 ? 1 : 0) : c === 6 ? (r % 2 === 0 ? 1 : 0) : rand() > 0.52 ? 1 : 0;
      cells.push(on ? '#000000' : '#FFFFFF');
    }
  }
  return cells;
}

// No 0, O, 1, I or L: codes are read aloud and typed from a printed slip.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

// 8 characters from the unambiguous alphabet, shown as two groups of four.
export function newActivationCode(): string {
  const limit = 256 - (256 % ALPHABET.length);
  const out: string[] = [];
  while (out.length < 8) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    for (const b of bytes) {
      // Rejection sampling keeps every character equally likely.
      if (b < limit && out.length < 8) out.push(ALPHABET[b % ALPHABET.length]);
    }
  }
  return `${out.slice(0, 4).join('')} ${out.slice(4).join('')}`;
}
