# Motion system verification, 2026-10-18

Environment: Vite dev server on http://localhost:5173, Playwright Chromium, demo clock Saturday Oct 17 2026, 6:42 PM.

## Implementation

- `web/src/styles/tokens.css` gained the five motion durations, four Apple easings and three press scales.
- `web/src/styles/animations.css` holds every keyframe and utility class, with a global reduced-motion override.
- `web/src/main.tsx` imports the animation layer after the tokens.
- Animations are attached as classes on wrappers and interactive elements. Every canvas inline style string is unchanged, so the design parity suite still passes.
- Only transform, opacity and clip-path are animated. The motion test asserts that no keyframe writes top, left, right, bottom, width, height, margin or padding.

## Measured behavior

| Surface | Measurement |
| --- | --- |
| Phone screen entrance | `iosScreenIn`, 0.24s |
| Active tab icon | `tabIconIn`, 0.24s |
| Today cards | `iosSlideUp`, 0.04s stagger delay on the first card |
| Wallet pass reveal | `passReveal`, 0.52s |
| QR breathing | `qrBreathe`, 3.2s, infinite |
| Set checkmark | `checkPop`, 0.32s |
| Rest timer | Text changed from 1:24 to 1:23 after one second |
| Share style switch | Figure animation restarted and label changed to `Minimal style` |
| Attendance month change | `calendarInLeft`, 0.24s; returning uses `calendarInRight` |
| Scan laser | `scanSweep`, 2.4s, infinite; rect top moved from 246.7 to 356.6 in 600ms |
| Reason sheet | `iosSheetUp`, 0.36s, `cubic-bezier(0.32, 0.72, 0, 1)` |
| Sheet scrim | `iosFadeIn`, 0.24s |
| Dashboard chart bars | `barGrowY`, 0.45s, 15ms stagger |
| Payment share bars | `barGrowX`, 0.45s |
| Membership health rows | `iosSlideUp` with cascade delays |
| Approval resolve | Card gets `approval-leave`, waiting count falls from 3 to 2 after the exit |
| Audit export | Button reads `Exported` with a check icon, then returns to `Export CSV` after 2 seconds |
| Reduced motion | Animation and transition durations resolve to 0.01ms |
| Frame rate | 76 requestAnimationFrame callbacks in a one second sample |
| Responsive matrix | 33 routes at 320, 390, 768, 1024, 1440 and 1920 (198 loads), 0 horizontal overflow, 0 console errors |

## Regression checks

- `npm test`: 11 files, 223 tests passed, including 161 design parity tests, the house rules and 4 new motion tests.
- `npm run build`: passed.
- Share image export still downloads a 1080 x 1920 PNG after a style switch.
- The exported CSV still downloads with the expected filename.

## Screenshots

- `motion-reason-sheet-390x844.png`
- `motion-scan-laser-390x844.png`
- `motion-pass-reveal-390x844.png`
- `motion-owner-bars-1280x900.png`
