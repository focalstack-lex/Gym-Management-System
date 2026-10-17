# Release 1 (The Desk) Implementation Overview

Source spec: `docs/superpowers/specs/2026-10-17-the-infinity-fitness-design.md`, revision 2.
Design canvas: https://claude.ai/artifact/Pb66ZQCij6di25GwUD3Fxq (desk rows: "Front desk station" and "Front desk on phone").

Release 1 covers several independent subsystems (domain engine, data layer, offline sync, desk UI, cash drawer, admin, release gate). Following the writing-plans scope rule, it is split into eight plans. Each plan produces working, tested software on its own and is written in full, task by task, just before it is executed, because each one consumes concrete outputs (file names, types, schema) from the plans before it. Plan 01 is written in full now: `2026-10-17-r1-01-foundation-and-domain.md`.

## Goal

Replace the paper sign-in clipboard, walk-in ledger and hand-computed expiry with a desk PWA that checks a member in under 2 seconds, keeps working offline, and makes cash handover accountable through blind counts.

## Stack Decisions

| Area | Choice | Reason |
| --- | --- | --- |
| App | Vite 5 + React 18 + TypeScript (strict), single-page PWA in `web/` | Spec section 1: static delivery on Vercel, installable PWA |
| PWA | `vite-plugin-pwa` | Service worker and install manifest without hand-written caching |
| Backend | Supabase: PostgreSQL, Auth, Storage, Edge Functions, in `supabase/` | Spec section 1 |
| Writes | PostgreSQL RPC functions only, RLS on every table | Spec section 7: zero direct browser table writes |
| Offline store | IndexedDB through `idb` | Spec section 5 outbox; `idb` is a thin promise wrapper |
| Dates | Pure TypeScript date-only arithmetic on `YYYY-MM-DD` strings, `Intl` for Asia/Manila | Spec section 4 is calendar-date logic; no date library needed |
| Money | Integer centavos | No floating point on money |
| Routing | `react-router-dom` 6 | One SPA serves the member, desk, staff, coach and owner routes |
| Icons | Inline Lucide SVG paths copied from the design canvas | Spec section 6; keeps icons byte-identical to the design without a runtime icon package |
| Fonts | Archivo and JetBrains Mono variable woff2, self-hosted in `web/public/fonts` (copied from `@fontsource-variable`, OFL licenses included) | Spec section 6 typography; no runtime call to a font CDN |
| QR scanning | Native `BarcodeDetector` where available, `@zxing/browser` fallback | iOS Safari lacks `BarcodeDetector` |
| Share image export | `html2canvas` 1.4.1, loaded on demand | Rasterizes the on-screen 9:16 share card to a 1080 x 1920 PNG; Chromium taints every canvas drawn from an SVG `foreignObject`, so the dependency-free route cannot export |
| Unit tests | Vitest 2 | Native to Vite |
| Database tests | pgTAP through `supabase test db` | Tests RLS and RPC rules inside PostgreSQL |
| End-to-end | Playwright | Viewport matrix 320 to 1920, offline simulation |

Every dependency above is the documented reason required by the house rules. Adding anything else needs its own row here first.

## Desk API Contract

All UI code talks to one port. Plan 02 implements it in memory (demo mode), Plan 03 implements it over Supabase RPC, Plan 04 wraps either one with the offline outbox.

```ts
// web/src/api/desk-api.ts (created in Plan 02)
import type { IsoDate } from '../domain/dates';
import type { MembershipStatus } from '../domain/status';
import type { DrawerCount } from '../domain/drawer';
import type { Centavos } from '../domain/money';

export type Payment =
  | { mode: 'cash' }
  | { mode: 'gcash'; reference: string }
  | { mode: 'maya'; reference: string };

export type AllowReason = 'will_pay_before_leaving' | 'owner_approved' | 'ewallet_pending' | 'other';

export interface MemberSummary { memberId: string; displayName: string; nickname: string | null; status: MembershipStatus; }

export interface MemberCard extends MemberSummary {
  memberCode: string;            // INF-00482
  planName: string | null;
  coverageEnd: IsoDate | null;
  graceDays: number;
  visitDays: IsoDate[];          // check-in dates in the last 8 weeks; the UI builds the Monday-first grid with today
  lastVisitAt: string | null;    // ISO timestamp
  photoUrl: string | null;       // only with photo consent
}

export interface CheckInResult { checkInId: string; at: string; status: MembershipStatus; }

export interface DeskApi {
  searchMembers(query: string): Promise<MemberSummary[]>;
  memberCard(memberId: string): Promise<MemberCard>;
  checkIn(cmd: { clientId: string; memberId: string }): Promise<CheckInResult>;
  allowEntry(cmd: { clientId: string; memberId: string; reason: AllowReason; note: string | null }): Promise<CheckInResult>;
  renew(cmd: { clientId: string; memberId: string; priceVersionId: string; payment: Payment }): Promise<{ newCoverageEnd: IsoDate }>;
  recordWalkIn(cmd: { clientId: string; visitorName: string; priceVersionId: string; payment: Payment }): Promise<{ walkInId: string }>;
  convertWalkIn(cmd: { clientId: string; walkInId: string; memberId: string; priceVersionId: string; payment: Payment }): Promise<{ newCoverageEnd: IsoDate; creditApplied: Centavos }>;
  openShift(cmd: { clientId: string; attendantId: string; float: Centavos }): Promise<{ shiftId: string }>;
  lockCount(cmd: { clientId: string; shiftId: string; role: 'outgoing' | 'incoming'; count: DrawerCount }): Promise<{ locked: true }>;
  reconcile(shiftId: string): Promise<{ expected: Centavos; outgoing: Centavos; incoming: Centavos }>;
}
```

`clientId` is a UUID generated on the device for every mutation; the server treats a repeated `clientId` as the same event (spec section 5). `reconcile` fails until both counts are locked (spec section 8.1.4).

## Plan Sequence

| Plan | Scope | Depends on | Exit criteria |
| --- | --- | --- | --- |
| 01 Foundation and domain core | Repo, `web/` scaffold, test runner, date primitives, coverage engine, status machine, money, drawer totals, design tokens, house-rule guard | None | `npm test` and `npm run build` pass in `web/`; every spec section 4 rule has a passing test |
| 02 Desk API contract and demo backend | `desk-api.ts` types, in-memory implementation seeded with the canvas sample members (Mika, Paolo, Bea, Rhea, Carlo, Den), demo mode switch | 01 | Contract tests pass against the in-memory backend; the app boots in demo mode with no network |
| 03 Supabase schema, RLS and RPC | Migrations for staff, devices, members, plans and versioned prices, subscriptions, freezes, check-ins, walk-ins, payments, shifts, drawer counts, audit log (append-only), idempotency keys; one RPC per DeskApi mutation; rate limits on auth and write RPCs | 01, 02 | pgTAP suite passes: RLS denies direct table writes, duplicate `clientId` is idempotent, `reconcile` refuses before both locks, audit rows written for every money and status mutation |
| 04 Offline outbox and sync | IndexedDB outbox, ordered dispatch with backoff, connectivity state for the header ("Online, {attendant} on shift" or "Offline · Outbox: {n}"), allowed versus prohibited offline matrix, cached member index for offline search | 02, 03 | Tests prove queued events replay in order exactly once after reconnection, prohibited actions are blocked offline, money events are never dropped |
| 05 Desk check-in, walk-in and enrollment UI | Desktop station and phone layouts, search and QR scan, member match card, status component, Active, Grace and Expired flows, Allow Entry reason sheet, walk-in register, same-day conversion, enrollment with photo consent | 02, 04 | Playwright: scan-to-checked-in under 2 seconds on the desk profile; every status renders its icon, label and actions from spec 8.1.2; no horizontal scroll from 320px to 1920px |
| 06 Shift and cash drawer | Open shift with float, blind count screen (numeric pad, quick advance, coins in whole pesos), handover with incoming PIN, reconciliation reveal | 03, 04, 05 | The expected total never appears in any client payload before both locks (asserted in network tests); locked counts are immutable |
| 07 Admin essentials, expiry board, audit log | Plan catalogue and versioned prices, staff accounts and device binding, void approvals, expiry board (Expiring soon, Grace, lapsed), audit log viewer | 03 | Admin-only RPCs refuse non-admin roles; expiry board matches the status engine for a seeded calendar |
| 08 Release gate | Full Playwright matrix, accessibility pass, `deploy-checklist` and `secure` skills, RA 10173 privacy review, Vercel and Supabase production setup, post-deploy checks | 01 to 07 | Every Security-First Deployment Gate item verified with command output and journaled |

Plans 05 and 07 can run in parallel once 04 and 03 are done; everything else is sequential.

## Cross-Cutting Gates (every plan)

- Test first: each task starts with a failing test and ends with it passing.
- `npm test` and `npm run build` in `web/` pass before every commit; from Plan 03 on, `npx supabase test db` passes too.
- From Plan 05 on, UI changes are verified in the running app at 320, 390, 768, 1024, 1440 and 1920px before they are called done.
- Every task ends with a commit and a journal line in `journal/YYYY-MM-DD.md`: what changed and how it was verified.
- No emojis and no en or em dashes in code, copy, comments, commits or docs. Plan 01 Task 6 adds a test that fails the build if either appears in `web/src`.

## Open Decisions

| Decision | Needed by | Current default |
| --- | --- | --- |
| Inactive tab bar label color (`#71717A` measures about 4.0:1, under 4.5:1) | Plan 05 | Lift to `#8E8E93` unless the owner rejects |
| Walk-in rate and plan prices | Plan 02 seed data | Placeholder `[RATE]` on the canvas; real values entered by the admin in Plan 07 |
| Maya reference number format | Plan 03 validation | Digits only, non-empty, until the format is confirmed (GCash: 13 digits) |
| Desk device: phone, tablet or desktop at launch | Plan 05 | Both layouts ship; the desk profile in tests is the phone layout |
| Nutritional guide content (Release 2) | Not in Release 1 | Excluded until scoped against the "no food calorie logging" rule |
