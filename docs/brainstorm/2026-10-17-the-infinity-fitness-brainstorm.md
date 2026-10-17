# The Infinity Fitness: System Brainstorm

Date: 2026-10-17
Status: Brainstorm specification for review. No product code written.
Gym: The Infinity Fitness ("Train Beyond Limits")
Logo: C:\Users\User\Pictures\Haraya Files\Haraya Coffee Spots\The Tipsy Butter Digos\516705658_1200138288793767_139619221041624125_n.jpg

## 1. The Problem Today

The gym runs attendance, walk-ins, and membership checks on paper clipboards and handwritten ledgers. 

| Manual Task | Operational Problem | Impact |
| --- | --- | --- |
| Member sign-in | Attendant manually hands paper clipboard sheet to members and walk-ins before entry. Names are illegible or ambiguous. No instant verification of paid status. | Free workouts, undetected membership lapses, desk bottlenecks |
| Walk-in logging | Walk-in payments (cash or e-wallets) are jotted down on paper. Receipt numbers are often skipped or duplicate. | Shortages, lost revenue tracking |
| Membership expiry | Computed by hand. Late renewals start from today instead of the old end date, giving away free days. | Revenue leakage of 6 to 12 percent monthly |
| Shift transitions | 1 primary attendant, occasionally relieved by a replacement. Cash count is not blinded, leading to unverified discrepancies. | Handover friction, lack of clear cash accountability |
| Member engagement | Members have no digital portal to see their status, expiry, workouts, or attendance streaks. | Low retention, frequent desk questions |

## 2. User Roles and Workflows

- Admin (Owner): Full system oversight from mobile or desktop. Approves voids and adjustments, configures plans and prices, reviews reports and audit trails.
- Front Desk Attendant: Works from the desk station. Replaces paper sign-in with 2-second QR scan or name lookup, handles walk-ins, executes renewals, and manages cash drawer shifts.
- Relief Attendant: Seamless shift handover with blinded drawer counts.
- Member: Personal mobile dashboard inspired by Strava. Tracks workouts, attendance streaks, weekly visit targets, and displays a digital iOS Wallet-style QR pass.
- Coach: Personal training management from mobile. Logs sessions against same-day check-ins and assigns workout plans.

## 3. Core Decisions

- Visual Aesthetics: Tactile iOS dark surface. Deep matte graphite (#121214, #0E0E10), squircle cards (#1C1C1E, #242428) with soft top highlights, high-energy orange accents (#FF6A00, #FF5500), glowing circular progress rings, clean segmented controls, and floating bottom navigation docks.
- Hosting: Vercel for frontend PWA, Supabase for PostgreSQL, Auth, Storage, and Edge Functions.
- Communication: In-app notices and dashboard cards. Zero SMS dependency.
- Deterministic Membership Engine: Inclusive calendar dates, deterministic coverage computation, strict status definitions (Frozen, Active, Expiring soon, Grace, Expired, Inactive, Dormant, No plan).
- Offline Desk Resilience: Local outbox queue with idempotent client IDs. Offline check-ins, walk-ins, and renewals sync automatically upon reconnection.
- Strict House Standards: Zero emojis and zero em-dashes across all code, UI copy, and documentation.
