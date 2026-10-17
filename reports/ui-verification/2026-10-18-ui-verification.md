# UI verification, 2026-10-18

Environment: Vite dev server on http://localhost:5173, Playwright Chromium, demo clock Saturday Oct 17 2026, 6:42 PM. Screens rendered from the demo store, no backend.

## Route and viewport matrix

33 routes x 6 widths (320, 390, 768, 1024, 1440, 1920) = 198 page loads.

- Horizontal overflow: 0
- Console errors or uncaught page errors: 0

Routes covered: member (13), staff (1), desk (10), coach (4), owner (5), demo launcher (1). The matrix included `/demo` and every artboard route, including the responsive desk routes that switch to the station layout at 1024px and wider.

## Interaction flows

| Flow | Result | Evidence |
| --- | --- | --- |
| Member sign in with member ID and password | Reached `/m/today` | Browser run, 0 console errors |
| Member activation, 8-character code, password rules and confirm | Reached `/m/today` | Browser run, 0 console errors |
| Continue with Google (demo) | Reached `/m/today` | Browser run |
| Staff PIN keypad, six digits | Reached `/desk/checkin` | Browser run |
| Check in Mika (Active) | Sign-in sheet 47 to 48 check-ins | Browser run |
| Allow entry for expired Paolo with a logged reason | Sign-in sheet 48 to 49 check-ins | Browser run |
| Record walk-in then convert the same walk-in | Activation slip shows the walk-in name | Browser run |
| Enroll a member | Slip shows the new name and generated `INF-00483` | Browser run |
| Freeze Mika for 14 days | Search shows `Frozen` status | Browser run |
| Undo the last scan check-in | Card returns to `Looking for a pass`; sign-in sheet no longer lists the member | Browser run |
| Expiry reminder nudge | Button becomes disabled and its label changes to `Reminder sent to ...` | Browser run |
| Expiry lapsed list | `Show 5 more lapsed` expands the list and disappears | Browser run |
| Coach log a 45 minute session | Sessions 2 to 3 of 4; PT balance 7 to 6 | Browser run |
| Coach plan add `Cable fly` and save | 10 to 13 sets; returns to clients | Browser run |
| Owner approve a waiting item | Waiting count 3 to 2; resolved row written; audit row `Approved Void` | Browser run |
| Owner schedule a price version | `Version 4, scheduled`, `PHP 1,500`; audit row `Price version scheduled` | Browser run |
| Owner invite staff and revoke a device | Button states change to `Invited` and `Revoked`; both audit rows written | Browser run |
| Owner audit CSV export | Downloaded `infinity-audit.csv` with the expected header and rows | `infinity-audit.csv` |
| Attendance previous and next month | September 2026 renders, next returns to October 2026 | Browser run |
| Share card style picker | Figure label changes from Stats to Minimal | Browser run |
| Share card Save image | Downloaded a 1080 x 1920 PNG (3.1 MB), status `Saved as a 1080 x 1920 image.` | `infinity-workout.png` |
| Workout Add set | Planned sets 10 to 11 | Browser run |
| Desk station See all entries | List expands and the link is removed | Browser run |

The member Pass options control invokes the native share sheet when available and falls back to copying the pass text. Headless Chromium exposes `navigator.share`, so the operating-system sheet itself is not observable in this harness; no page error was raised.

## Build and tests

- `npm test`: 10 files, 218 tests passed.
- `npm run build`: TypeScript project build and Vite production build succeeded.
- Design parity suite: 161 tests passed; every artboard style, SVG path and visible copy still matches the canvas.

## Dependency audit

- Production: 2 moderate `react-router` advisories remain (open redirect via backslash, and an SSR hydration constructor-injection issue). Both require the v7 major upgrade. This app has no SSR hydration and never navigates to user-supplied paths or query-driven redirect targets, so the exposure is accepted for Release 1 and recorded for the Plan 08 release gate.
- Development: the remaining advisories are in the Vitest/Vite toolchain (no production bundle impact).

## Screenshots

- `member-today-390x844.png`
- `member-pass-390x844.png`
- `member-workout-390x844.png`
- `member-share-390x844.png`
- `desk-checkin-phone-390x844.png`
- `desk-shift-phone-390x844.png`
- `coach-clients-390x844.png`
- `desk-checkin-station-1280x900.png`
- `desk-shift-station-1280x900.png`
- `owner-dashboard-full-1280x900.png`
- `owner-audit-full-1280x900.png`
