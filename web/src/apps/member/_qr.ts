// Placeholder pattern shaped like a QR code, seeded by the member code. This is the same
// algorithm as the canvas renderVals (design/canvas/Member-Pass.dc.html): 25 x 25 cells,
// three finder squares, timing lines, and a seeded linear congruential fill.
// The real code is generated from the member ID once Supabase is wired in.

export const QR_SIZE = 25;

export function qrCells(code: string): boolean[] {
  const n = QR_SIZE;
  let seed = Number(code.replace(/\D/g, ''));
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const finder = (r: number, c: number) => {
    const origins = [
      [0, 0],
      [0, n - 7],
      [n - 7, 0],
    ];
    for (const [r0, c0] of origins) {
      const dr = r - r0;
      const dc = c - c0;
      if (dr >= -1 && dr <= 7 && dc >= -1 && dc <= 7) {
        if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return 0;
        const ring = Math.min(dr, dc, 6 - dr, 6 - dc);
        return ring === 1 ? 0 : 1;
      }
    }
    return -1;
  };
  const cells: boolean[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      let on = finder(r, c);
      if (on === -1) {
        if (r === 6) on = c % 2 === 0 ? 1 : 0;
        else if (c === 6) on = r % 2 === 0 ? 1 : 0;
        else on = rand() > 0.52 ? 1 : 0;
      }
      cells.push(on === 1);
    }
  }
  return cells;
}
