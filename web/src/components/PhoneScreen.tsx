// The one sanctioned adaptation of the design: a canvas phone artboard is a fixed
// 390 x 844 frame. In the app the frame becomes the real viewport (full width up to
// 480px, full height), the content scrolls, and tab bars or sticky bars passed as
// `bars` stay pinned to the bottom exactly as drawn. Colors, type and padding are the
// artboard's own.

import type { ReactNode } from 'react';
import { css } from '../lib/css';

export function PhoneScreen({
  padding,
  bars,
  bottomInset = 120,
  children,
}: {
  padding: string;
  bars?: ReactNode;
  bottomInset?: number;
  children: ReactNode;
}) {
  return (
    <div style={css("position: relative; height: 100dvh; max-width: 480px; margin: 0 auto; overflow: hidden; background: #0C0C0E; color: #FFFFFF; font-family: 'Archivo', system-ui, sans-serif")}>
      <div
        style={{
          ...css('box-sizing: border-box; height: 100%; overflow-x: hidden; overflow-y: auto'),
          padding,
          paddingBottom: bars ? bottomInset : undefined,
        }}
      >
        {children}
      </div>
      {bars}
    </div>
  );
}
