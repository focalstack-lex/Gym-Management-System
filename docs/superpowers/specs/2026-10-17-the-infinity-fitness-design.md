# The Infinity Fitness: System Design Specification

Date: 2026-10-17
Status: Design validated, revision 2 (2026-10-17). Typography, navigation and front desk flows approved. No product code written.
Gym: The Infinity Fitness ("Train Beyond Limits")
Logo: C:\Users\User\Pictures\Haraya Files\Haraya Coffee Spots\The Tipsy Butter Digos\516705658_1200138288793767_139619221041624125_n.jpg
UI Vibe Reference: Matte Stealth Dark iOS. Flat hairline surfaces, thin-line telemetry, flush iOS tab bars, zero glows
Design Canvas: https://claude.ai/artifact/Pb66ZQCij6di25GwUD3Fxq (private; source of truth for every screen in Section 8)

---

## 1. Core Architectural Decisions

| Topic | Decision |
| --- | --- |
| Application Model | Cloud web app, installable as a PWA on desktop, tablet, and mobile |
| Hosting | Vercel (Frontend PWA static delivery) and Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| Front Desk Station | Optimized for single front desk attendant with seamless relief staff handover |
| Member Experience | Strava-inspired personal dashboard with activity feed, streaks, workout logging, and digital QR pass |
| Check-in Speed | Sub-2-second check-in by QR camera scan or quick name search, replacing paper attendance sheet |
| Communications | Web dashboard digests and in-app notifications. Zero SMS dependency |
| Offline Resilience | Local outbox queue with idempotent client IDs. Offline check-ins, walk-ins, and renewals sync cleanly on reconnection |
| Payment Handling | Desk cash and e-wallet recording (GCash, Maya) with reference validation. No direct gateway in version 1 |
| Visual Language | Matte Stealth Dark iOS (Section 6). Obsidian canvas (#0C0C0E), flat squircle cards (#17171A, #1F1F23), 1px hairlines, disciplined athletic orange (#FF6A00) |
| House Rules | Strictly zero emojis and zero em-dashes across all code, UI copy, and documentation |

---

## 2. User Roles and Permissions

1. Admin (Owner):
   - Access from any desktop or mobile device.
   - Approves voids, corrections, and backdated freezes.
   - Manages membership plans, versioned prices, staff accounts, and system settings.
   - Views financial summaries, attendance patterns, and append-only audit logs.

2. Front Desk Attendant:
   - Operates from the designated desk device.
   - Replaces the paper attendance sheet: searches member or scans QR pass in under 2 seconds.
   - Logs walk-in visitors with payment mode (cash or e-wallet reference).
   - Enrolls new members, renews existing memberships, and initiates member freeze requests.
   - Opens shift with float, hands over shift to relief staff, and closes shift with blind cash count.

3. Member:
   - Personal mobile web dashboard inspired by Strava.
   - Views iOS Wallet-style digital QR pass with live status and expiration badge.
   - Logs workouts, tracks exercises, views weekly goals, and monitors attendance streaks.
   - Reviews payment history and training session logs.

4. Coach:
   - Operates from mobile phone.
   - Views assigned personal training clients with active package balances.
   - Logs completed PT sessions against same-day gym check-ins.
   - Prepares workout plans from the gym exercise library and writes nutritional guides.

---

## 3. Scope and Release Strategy

### Release 1: The Desk (Eliminating Paper Operations)
- Member Records: Full name, nickname, mobile number, birth month and day (no birth year), emergency contact, optional email, photo taken at desk with consent.
- Plan Catalogue with Versioned Prices: Monthly memberships, multi-month packages, walk-in rate, student/senior rates, training packages.
- Desk Attendance Engine: Rapid QR scan or name lookup, large photo and status display, instant one-tap check-in and renewal on the same screen.
- Walk-ins and Conversions: Walk-in ticket recording, same-day conversion of walk-in fees into membership credit.
- Membership Coverage Engine: Deterministic calendar month rules, grace period calculation, status state machine.
- Shift and Cash Drawer Management: Opening float, staff handover between primary and relief attendants, blind cash count at close.
- Offline Desk Mode: Local outbox queue with IndexedDB, idempotent client IDs, automatic reconnection sync.
- In-Memory Demo Mode: Fully interactive mock backend for zero-database visual testing.
- Expiry Board and Audit Log: Real-time board for expiring soon, grace, and lapsed members. Append-only audit log for all money and status mutations.

### Release 2: Member Portal (Strava-Inspired) and Coaches
- Member Web PWA: Inset grouped card views, activity feed, workout logger, attendance streak counters, and weekly visit goals.
- Digital Membership Pass: iOS Wallet-style high-contrast QR pass.
- Coach Tools: Client assignment roster, PT session deduction linked to same-day check-in, workout plan builder.
- Data Privacy and Receipts: Privacy-compliant export and erasure per RA 10173, acknowledgment slips with manual BIR invoice tracking.

### Release 1.5 and Later
- Gym closure mass-extension (e.g. typhoons or extended utility outages).
- In-app nudges for members with zero visits in 14 days.
- Online renewal via PayMongo QR Ph once formal BIR 2303 registration is ready.

### Explicitly Excluded (Never Build)
- Leaderboards, body weight or measurement tracking, food calorie logging, biometric fingerprint/facial scanning, automated turnstiles, direct credit card processing.

---

## 4. Membership Coverage Rules

All membership dates follow strict deterministic calendar rules in Philippine time (UTC+8):

1. Period Computation:
   - A calendar month runs from start date through day before same date next month (e.g., Oct 15 runs through Nov 14).
   - If that date does not exist in the target month, the period ends on the last day of that target month.
2. Chained vs Fixed Renewals:
   - Renewing while active or within the plan grace period starts the day after the current end date (chained).
   - Renewing after the grace period starts on the renewal date itself (fixed).
3. Status Hierarchy:
   - Frozen: Active freeze in effect.
   - Active: 8 or more days remaining.
   - Expiring soon: 0 to 7 days remaining.
   - Grace: Expired, within plan grace window (default 3 days).
   - Expired: Under 30 days past grace.
   - Inactive: 30 to 89 days past grace.
   - Dormant: 90 or more days past grace.
   - No plan: Registered profile with zero subscriptions.
4. Soft Door Block:
   - Expired members arriving at the desk trigger a soft block: staff can renew on the spot or grant entry with a logged reason.

---

## 5. Offline Desk Architecture

- The desk station maintains an IndexedDB outbox.
- Every mutation (check-in, walk-in, renewal) creates an ordered event with an idempotent UUID generated on the device.
- Allowed offline: Check-ins, walk-ins, renewals, new enrollments, shift handover, shift close counts.
- Prohibited offline: Payment voids, plan price modifications, role changes, backdated freezes.
- Sync Behavior: When internet restores, queued events are dispatched in sequence. Server functions validate business rules and apply mutations without rejecting money transactions.

---

## 6. Visual Design System: Matte Stealth Dark iOS

### Core Aesthetic Principles
- Stealth Matte Surfaces: Pure deep obsidian canvas (#0C0C0E) paired with muted squircle surfaces (#17171A and #1F1F23).
- Zero Glows: Strictly no radial halos, no diffused colored glows, and no blurry drop shadows. Surfaces rely on razor-thin 1px hairline borders (rgba(255, 255, 255, 0.06)) for separation.
- High-Precision Typography: Large, confident metric numerals (pure white #FFFFFF) paired with understated, tracked secondary labels (#71717A and #8E8E93).
- Thin-Line Telemetry: 2px thin circular stroke rings, micro dot-matrix activity grids (GitHub/cadence style), and crisp flat bar charts.
- Restrained Brand Accent: The Infinity Fitness orange (#FF6A00) is used with discipline for active streak highlights, selected tab states, and primary action triggers. Never diffused or glowing.
- Minimalist Vector Icons: Crisp, thin 1.5px stroke Lucide vector icons (no emojis anywhere).
- Inset Grouped Hierarchy: Rounded squircle containers with 16px to 20px radii, fitting naturally into iOS human interface standards.

### Color Tokens
| Token | Value | Purpose |
| --- | --- | --- |
| `bg-canvas` | `#0C0C0E` | Deep matte obsidian background |
| `bg-card` | `#17171A` | Base squircle card surface |
| `bg-card-elevated` | `#1F1F23` | Raised cards, secondary sections |
| `border-hairline` | `rgba(255, 255, 255, 0.06)` | Crisp 1px edge definition, zero glow |
| `color-accent` | `#FF6A00` | Flat athletic orange (streak, active state) |
| `color-accent-dim` | `rgba(255, 106, 0, 0.15)` | Subtle flat container tint for icons |
| `text-primary` | `#FFFFFF` | Bold metric numbers and titles |
| `text-secondary` | `#71717A` | Metadata, timestamps, and subtitles |
| `text-muted` | `#3F3F46` | Inactive dots, background tracks |
| `color-status-active` | `#30D158` | Flat emerald dot for active memberships |
| `text-label` | `#8E8E93` | Small labels and metadata under 24px (contrast rule below) |
| `text-quiet` | `#A1A1AA` | Body copy inside notices and list metadata |
| `color-status-frozen` | `#64D2FF` | Frozen membership tier |
| `color-status-expired` | `#FF453A` (icon), `#FF6961` (text) | Expired soft-block tier |
| `color-status-gray` | `#8E8E93`, `#48484A` | Inactive, Dormant, No plan |
| `color-offline` | `#FF9F0A` | Desk connectivity only: offline with queued outbox |
| `surface-rest-bar` | `#2C2C2E` | Rest days in trained-time bars, empty goal segments |
| `tabbar-bg` | `rgba(12, 12, 14, 0.82)` + 20px backdrop blur | Translucent tab bars and sticky action bars only |
| `tabbar-hairline` | `0.5px rgba(255, 255, 255, 0.08)` | Tab bar and sticky bar top border |

CSS custom properties drop the `color-` prefix for status tiers: `--status-active`, `--status-accent`, `--status-frozen`, `--status-expired`, `--status-expired-text`, `--status-gray`, `--status-gray-dim` (see web/src/styles/tokens.css).

### Contrast Rule
- `#71717A` on `#17171A` measures about 3.7:1. It is reserved for icons, tracks and text 24px and larger. Small labels use `#8E8E93` (about 5.5:1).
- Open decision: inactive tab bar labels currently use `#71717A` at 10px (about 4.0:1, under the 4.5:1 text minimum). Lifting them to `#8E8E93` is recommended.
- Text on orange fills is pure `#000000` (about 7.3:1).

### Accent Discipline
Orange `#FF6A00` appears only on: the active streak, the selected tab, primary action buttons, focused input borders, and the Expiring soon and Grace status tier. Never as a glow, halo or gradient.

### Typography
- Voice: Archivo (variable width and weight). Display and metric numerals at weight 800, width 110 to 125 percent, tabular figures, pure white.
- Machine data: JetBrains Mono for member IDs, times, e-wallet references and outbox counts.
- Scale: metric 80 / title 26 to 28 / headline 18 / body 15 / label 11 uppercase tracked 0.14em / mono 11 to 13.

### Membership Status Component
Four color tiers plus grays, each with a 16px Lucide icon so state never depends on color alone. Rendered as tabular rows or inline icon plus label, never as pill badges. Rows never wrap and fit 320px to 480px.

| Status | Tier color | Icon |
| --- | --- | --- |
| Active | `#30D158` | CheckCircle |
| Expiring soon | `#FF6A00` | Clock |
| Grace | `#FF6A00` | AlertCircle |
| Frozen | `#64D2FF` | PauseCircle |
| Expired | `#FF453A` | XCircle |
| Inactive | `#8E8E93` | MinusCircle |
| Dormant | `#48484A` | Moon |
| No plan | `#48484A` | CircleDashed |

### Navigation
- Native iOS tab bar flush to the screen bottom: 49px of tabs plus safe-area padding (`env(safe-area-inset-bottom)`, 34px on notched phones), translucent `tabbar-bg`, `tabbar-hairline` top border. No floating dock, no indicator lines.
- Active tab tints icon and label `#FF6A00`; inactive tabs are slate.
- The center action is a flat orange 48x32 squircle with a black glyph: Pass (member), Scan (desk), Log (coach).
- Member tabs: Today, Workouts (dumbbell), Pass, Attendance, Profile. Desk tabs: Check-in, Walk-in, Scan, Expiry, Shift. Coach tabs: Clients, Schedule, Log, Plans, Profile.
- Flow screens (shift handover, PT session log, plan builder, live workout) replace the tab bar with a sticky translucent action bar.

### Telemetry Components
- Rings: 2px stroke, butt caps, no hub, no glow. Weekly goals render as one arc segment per target visit.
- Cadence: 7-day row (M to S) plus a 4x7 micro grid of 5px dots for the last 4 weeks. Desk and coach views use an 8-week grid.
- Bars: 3px slim bars. Trained days flat orange, rest days `#2C2C2E`.

---

## 7. Security and Data Protection

- Architecture: Zero direct browser table writes. All data mutations execute through Supabase PostgreSQL RPC functions verifying role, device binding, and business rules.
- Row-Level Security: Active on every table.
- Privacy Compliance (RA 10173): Core data collected for membership contract only. Explicit opt-in for member photo. No collection of birth year or government IDs. Right to erasure preserves financial payment records for tax audit compliance.

---

## 8. Validated Screen Specifications

Each screen below exists on the design canvas. Desk screens ship in Release 1; member and coach screens in Release 2.

### 8.1 Front Desk (Release 1)
Delivered as a fluid desk station (1024px and up) and a three-screen phone layout (320px to 480px): Check-in, Walk-in, Shift Handover.

1. Connectivity Header (all desk screens):
   - Online: solid `#30D158` dot with "Online, {attendant} on shift" in `#8E8E93`.
   - Offline: hollow `#FF9F0A` ring with "Offline" in `#FF9F0A`, followed by "· Outbox: {n}" in `#8E8E93`. The count is the number of queued IndexedDB events (Section 5).
   - The switch is automatic. Check-ins, walk-ins and renewals keep working offline and sync on reconnection.
2. Check-in States (member match card):
   - Active and Expiring soon: primary "Check in" (orange), secondary "Renew".
   - Grace (1 to 3 days past the end date; the end date itself is the last covered day and counts as Expiring soon): status shows AlertCircle and "Grace Period" in orange. A notice states the grace end date and that renewing now chains from the day after the old end date (Section 4.2), so no days are lost. Primary "Check in (In Grace)" (orange), with a prominent "Renew" carrying an orange 1px border.
   - Expired: status shows XCircle and "Expired" in coral `#FF6961`. A soft-block notice states the end date and the fixed renewal window starting today. Primary "Renew Now" (orange), secondary "Allow Entry (Log Reason)".
   - Allow Entry (Log Reason) opens a bottom sheet: member name and end date, a single-choice reason (Will pay before leaving, Owner approved, E-wallet payment pending, Other), a note required when the reason is Other, then "Log and allow entry". The entry, reason, note, attendant and time write to the append-only audit log. Allowed offline; it queues like any other mutation.
   - Every match shows the 8-week visit grid, visits in 8 weeks and last visit, so the attendant sees attendance context in the same glance.
3. Walk-in Register: visitor name, payment mode (Cash, GCash, Maya), e-wallet reference (numeric) when not cash, walk-in rate from the versioned price list, "Record walk-in". A "Convert to membership" entry credits today's walk-in fee toward a new plan.
4. Shift Handover (blind count):
   - Denomination rows run 1,000, 500, 200, 100, 50, 20, then Coins (whole pesos). Every field uses `inputmode="numeric"` with `pattern="[0-9]*"`, so the number pad opens directly.
   - Quick advance: `enterkeyhint="next"` on each row and Return moves focus to the next denomination down; the coins row uses `enterkeyhint="done"`.
   - Blind guarantee: the expected system total is never sent to the client while counting. The server reveals it only after both the outgoing and the incoming attendant have locked their counts. Locked counts are immutable; corrections go through admin-approved adjustments.
   - Steps: 1 outgoing counts, 2 incoming counts after signing in with their own PIN, 3 reconcile. Shift activity shows counts only (check-ins, walk-ins, renewals, enrollments, e-wallet references), never peso amounts, until reconciliation.

### 8.2 Member App (Release 2)
- Today: greeting, "Today's session" card (dark button, orange arrow), merged streak card (streak weeks, weekly target, 7-day row, 4-week micro grid), membership and trained-time tiles, last workout.
- Wallet Pass: dark pass card, white QR panel, member ID, status icon, 2px coverage line. Pass is the center tab.
- Workout Log: session totals with set progress segments, current exercise with set rows, rest ring, sticky "Add exercise" and "Finish workout".

### 8.3 Coach App (Release 2)
- Clients: sessions logged today, clients in gym (from desk check-ins), up-next card, PT roster with package balance bars; a balance of 2 or fewer turns orange.
- Log PT Session: logging is enabled only when the client has a same-day desk check-in. Without one the action is disabled with an explanation. Shows the package balance after deduction.
- Plan Builder: day tabs, exercise rows with sets, reps and rest, exercise library search.
- Open decision: content scope for nutritional guides, given that food calorie logging is excluded (Section 3).

### 8.4 Accounts and Sign-in (Design, 2026-10-18)
- No open sign-up. A member account exists only after the desk enrolls the member and records payment.
- Activation: at enrollment the desk issues a one-time 8-character code (letters and numbers, shown as a QR and on the printed slip), valid 48 hours. The member enters it with their mobile number or member ID, then sets a password (at least 10 characters, includes a number, not the mobile number or member ID) and accepts the privacy notice (RA 10173). A new code cancels the old one; codes are stored hashed and every issue is audit-logged.
- Sign-in: member ID or mobile number plus password. Email (for password reset) and Google sign-in are optional, linked after activation. Lost slip or expired code: the desk issues a new code. No SMS.
- Staff: 6-digit PIN on a registered desk device only; 5 wrong tries lock the device for 5 minutes; the owner resets PINs. The owner signs in on the web with email and password.

### 8.5 Workout Share Card (Design, 2026-10-18)
- After "Finish workout", the member can make a 9:16 story image (1080 x 1920): their own photo (camera or library) with an overlay in one of three styles: Stats (workout name, date, time, volume, sets), Minimal (large duration), Streak (weeks, this week's visit dots). Gym wordmark top left.
- The image is composed on the device; the photo is never uploaded. Save image writes to the phone; Share opens the system share sheet. No public feed and no leaderboards (Section 3 exclusions stand).
