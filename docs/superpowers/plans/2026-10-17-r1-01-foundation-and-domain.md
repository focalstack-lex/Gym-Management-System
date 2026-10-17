# Release 1, Plan 01: Foundation and Domain Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the `web/` app with a test runner, and implement the pure TypeScript domain core (calendar dates, membership coverage, status machine, money, drawer totals, design tokens) that every later Release 1 plan builds on.

**Architecture:** A Vite + React + TypeScript single-page app lives in `web/`. Business rules live in `web/src/domain/` as pure functions with no I/O, no React and no date library, so they run identically in the browser, in the demo backend and in tests. Dates are `YYYY-MM-DD` strings handled with UTC arithmetic; "today" is computed in Asia/Manila (UTC+8). Money is integer centavos.

**Tech Stack:** Node 20 or later (this machine: Node 24.15, npm 11.12), Vite 5, React 18, TypeScript 5 (strict), Vitest 2.

**Pre-verified:** every domain and test code block in Tasks 2 to 6 was extracted and run with Vitest 2.1.9 on 2026-10-17: 7 files, 38 tests passed.

Overview and later plans: `docs/superpowers/plans/2026-10-17-release-1-overview.md`.

## Global Constraints

- Philippine time (UTC+8, IANA `Asia/Manila`) for every "today" (spec section 4).
- A calendar month runs from the start date through the day before the same date next month; if that date does not exist in the target month, the period ends on the last day of that target month (spec 4.1).
- Renewing while active or within the grace window starts the day after the current end date (chained); renewing after grace starts on the renewal date (fixed) (spec 4.2).
- Default grace window: 3 days (spec 4.3).
- Status thresholds: Active 8 or more days remaining; Expiring soon 0 to 7; Grace within the grace window; Expired under 30 days past grace; Inactive 30 to 89; Dormant 90 or more; Frozen when a freeze is in effect; No plan with zero subscriptions (spec 4.3).
- Money is integer centavos; display format `PHP 5,445.00`.
- Denominations counted at the drawer: PHP 1,000, 500, 200, 100, 50, 20, then coins as whole pesos (spec 8.1.4).
- Color tokens exactly as spec section 6; old tokens `#0E0E10`, `#121214`, `#1C1C1E`, `#242428` must not appear.
- No emojis and no en dashes (U+2013) or em dashes (U+2014) anywhere in code, comments, copy, commits or docs.
- Every new dependency must already be listed in the overview's Stack Decisions table.
- Every task ends with a journal line in `journal/YYYY-MM-DD.md` stating what changed and the verification command output, staged in the same commit (`git add journal`).
- Working directories: every `npm` and `npx` command runs inside `web/`; every `git` command runs from the repo root.

## File Structure

| Path | Responsibility |
| --- | --- |
| `.gitignore` | Ignore `node_modules`, build output, `.env*` except `.env.example` |
| `docs/CODE_MAP.md` | Agent navigation map of folders and entry points |
| `web/` | Vite app (scaffolded from the `react-ts` template) |
| `web/vitest.config.ts` | Test runner config: node environment, `src/**/*.test.ts` |
| `web/src/domain/dates.ts` | `IsoDate` type, parsing, day arithmetic, Manila "today" |
| `web/src/domain/coverage.ts` | Period end, renewal start, freeze extension |
| `web/src/domain/status.ts` | Membership status machine and door decision |
| `web/src/domain/money.ts` | Centavos type, peso conversion, PHP formatting |
| `web/src/domain/drawer.ts` | Denominations and drawer count total |
| `web/src/styles/tokens.css` | Design tokens from spec section 6 as CSS custom properties |
| `web/src/house-rules.test.ts` | Fails if `web/src` contains en or em dashes or emoji |

Each domain file has a sibling `*.test.ts`.

---

### Task 1: Repository and web app scaffold

**Files:**
- Create: `.gitignore`, `docs/CODE_MAP.md`, `web/` (template), `web/vitest.config.ts`
- Modify: `web/package.json` (scripts), `web/tsconfig.app.json` (exclude tests)

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test` (Vitest, runs `src/**/*.test.ts` once) and `npm run build` inside `web/`.

- [ ] **Step 1: Run the project-scaffolding pre-flight**

Load the `project-scaffolding` skill and follow its interview and registration steps for this repo (journal entry, Second Brain registration, `docs/CODE_MAP.md`). Keep the existing `docs/` and `journal/` folders as they are.

- [ ] **Step 2: Initialise git and the ignore file**

Run from the repo root (`E:\PROJECTS\Gym Management System`):

```bash
git init
git branch -M main
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
coverage/
.env
.env.*
!.env.example
.vercel/
supabase/.temp/
*.log
```

- [ ] **Step 3: Scaffold the app**

```bash
npm create vite@5 web -- --template react-ts
cd web
npm install
npm install -D vitest@2 @types/node@20
```

Expected: `web/package.json` exists and `npm install` ends with `found 0 vulnerabilities` or a list to triage. Any audit finding is surfaced to the user before continuing (Security-First Deployment Gate item 2).

- [ ] **Step 4: Configure Vitest**

Create `web/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

Add the script:

```bash
npm pkg set scripts.test="vitest run"
```

In `web/tsconfig.app.json`, add this top-level key next to `"include"` so test files (which use `node:fs`) are type-checked by Vitest only, not by the browser build:

```json
"exclude": ["src/**/*.test.ts"]
```

- [ ] **Step 5: Verify the empty toolchain**

```bash
npx vitest run --passWithNoTests
npm run build
```

Expected: Vitest prints `No test files found, exiting with code 0`; the build ends with `built in` and writes `web/dist/`.

- [ ] **Step 6: Write the code map**

Create `docs/CODE_MAP.md`:

```markdown
# Code Map

| Path | What lives there |
| --- | --- |
| `docs/superpowers/specs/` | Approved design specification (source of truth) |
| `docs/superpowers/plans/` | Implementation plans, one per Release 1 subsystem |
| `journal/` | Daily development journal |
| `web/` | Desk PWA (Vite, React, TypeScript) |
| `web/src/domain/` | Pure business rules: dates, coverage, status, money, drawer |
| `web/src/styles/tokens.css` | Design tokens from spec section 6 |

Staleness gate: update this file in the same commit as any new top-level folder or domain module.
```

- [ ] **Step 7: Commit and journal**

```bash
cd ..
git add .gitignore docs web journal
git commit -m "chore: scaffold web app with Vitest and code map"
```

Append to `journal/YYYY-MM-DD.md`: `- [HH:MM] Scaffolded web/ (Vite 5, React 18, TS, Vitest 2). Verified: vitest exit 0, npm run build ok.`

---

### Task 2: Calendar date primitives

**Files:**
- Create: `web/src/domain/dates.ts`
- Test: `web/src/domain/dates.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type IsoDate` (branded `string`, format `YYYY-MM-DD`)
  - `isoDate(value: string): IsoDate` (throws `RangeError` on bad format or impossible date)
  - `parts(date: IsoDate): { year: number; month: number; day: number }` (month 1 to 12)
  - `fromParts(year: number, month: number, day: number): IsoDate`
  - `daysInMonth(year: number, month: number): number`
  - `addDays(date: IsoDate, days: number): IsoDate`
  - `diffDays(from: IsoDate, to: IsoDate): number` (positive when `to` is later)
  - `manilaToday(now: Date): IsoDate`

- [ ] **Step 1: Write the failing tests**

Create `web/src/domain/dates.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { addDays, daysInMonth, diffDays, fromParts, isoDate, manilaToday, parts } from './dates';

describe('isoDate', () => {
  it('accepts real calendar dates', () => {
    expect(isoDate('2026-10-17')).toBe('2026-10-17');
    expect(isoDate('2028-02-29')).toBe('2028-02-29');
  });

  it('rejects bad formats and impossible dates', () => {
    expect(() => isoDate('2026-2-1')).toThrow(RangeError);
    expect(() => isoDate('2026-13-01')).toThrow(RangeError);
    expect(() => isoDate('2026-02-29')).toThrow(RangeError);
    expect(() => isoDate('2026-04-31')).toThrow(RangeError);
  });
});

describe('parts and fromParts', () => {
  it('round-trips', () => {
    expect(parts(isoDate('2026-01-05'))).toEqual({ year: 2026, month: 1, day: 5 });
    expect(fromParts(2026, 1, 5)).toBe('2026-01-05');
  });
});

describe('daysInMonth', () => {
  it('handles month lengths and leap years', () => {
    expect(daysInMonth(2026, 1)).toBe(31);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
  });
});

describe('addDays and diffDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays(isoDate('2026-12-31'), 1)).toBe('2027-01-01');
    expect(addDays(isoDate('2026-03-01'), -1)).toBe('2026-02-28');
    expect(addDays(isoDate('2026-10-15'), 3)).toBe('2026-10-18');
  });

  it('rejects fractional days', () => {
    expect(() => addDays(isoDate('2026-10-15'), 1.5)).toThrow(RangeError);
  });

  it('counts calendar days between dates', () => {
    expect(diffDays(isoDate('2026-10-17'), isoDate('2026-11-14'))).toBe(28);
    expect(diffDays(isoDate('2026-10-17'), isoDate('2026-10-01'))).toBe(-16);
    expect(diffDays(isoDate('2026-10-17'), isoDate('2026-10-17'))).toBe(0);
  });
});

describe('manilaToday', () => {
  it('uses UTC+8 for the calendar day', () => {
    expect(manilaToday(new Date('2026-10-16T16:30:00Z'))).toBe('2026-10-17');
    expect(manilaToday(new Date('2026-10-17T15:59:59Z'))).toBe('2026-10-17');
    expect(manilaToday(new Date('2026-10-17T16:00:00Z'))).toBe('2026-10-18');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run (in `web/`): `npx vitest run src/domain/dates.test.ts`
Expected: FAIL, `Failed to resolve import "./dates"`.

- [ ] **Step 3: Implement**

Create `web/src/domain/dates.ts`:

```ts
// Calendar dates as YYYY-MM-DD strings. All arithmetic runs in UTC so a
// date never shifts with the device timezone; "today" is taken in Manila.

export type IsoDate = string & { readonly __brand: 'IsoDate' };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isoDate(value: string): IsoDate {
  const match = ISO_DATE.exec(value);
  if (!match) throw new RangeError(`Not a YYYY-MM-DD date: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new RangeError(`Not a real calendar date: ${value}`);
  }
  return value as IsoDate;
}

export function parts(date: IsoDate): { year: number; month: number; day: number } {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

export function fromParts(year: number, month: number, day: number): IsoDate {
  const yyyy = String(year).padStart(4, '0');
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return isoDate(`${yyyy}-${mm}-${dd}`);
}

function toUtcMs(date: IsoDate): number {
  const p = parts(date);
  return Date.UTC(p.year, p.month - 1, p.day);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  if (!Number.isInteger(days)) throw new RangeError(`days must be an integer: ${days}`);
  const shifted = new Date(toUtcMs(date) + days * DAY_MS);
  return fromParts(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate());
}

export function diffDays(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

const MANILA_DAY = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function manilaToday(now: Date): IsoDate {
  return isoDate(MANILA_DAY.format(now));
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/domain/dates.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit and journal**

```bash
git add web/src/domain/dates.ts web/src/domain/dates.test.ts journal
git commit -m "feat(domain): add calendar date primitives with Manila today"
```

Journal: `- [HH:MM] Added domain/dates.ts. Verified: vitest dates.test.ts 8 passed.`

---

### Task 3: Coverage periods and renewal start

**Files:**
- Create: `web/src/domain/coverage.ts`
- Test: `web/src/domain/coverage.test.ts`

**Interfaces:**
- Consumes: `IsoDate`, `isoDate`, `addDays`, `daysInMonth`, `fromParts`, `parts` from Task 2.
- Produces:
  - `periodEnd(start: IsoDate, months: number): IsoDate`
  - `renewalStart(currentEnd: IsoDate | null, renewedOn: IsoDate, graceDays: number): IsoDate`
  - `extendForFreeze(end: IsoDate, frozenDays: number): IsoDate`
  - `DEFAULT_GRACE_DAYS = 3`

- [ ] **Step 1: Write the failing tests**

Create `web/src/domain/coverage.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isoDate } from './dates';
import { DEFAULT_GRACE_DAYS, extendForFreeze, periodEnd, renewalStart } from './coverage';

const d = isoDate;

describe('periodEnd', () => {
  it('ends the day before the same date next month', () => {
    expect(periodEnd(d('2026-10-15'), 1)).toBe('2026-11-14');
    expect(periodEnd(d('2026-10-16'), 1)).toBe('2026-11-15');
    expect(periodEnd(d('2026-10-17'), 1)).toBe('2026-11-16');
    expect(periodEnd(d('2026-03-01'), 1)).toBe('2026-03-31');
    expect(periodEnd(d('2026-01-28'), 1)).toBe('2026-02-27');
  });

  it('ends on the last day when the same date does not exist in the target month', () => {
    expect(periodEnd(d('2026-01-31'), 1)).toBe('2026-02-28');
    expect(periodEnd(d('2026-01-29'), 1)).toBe('2026-02-28');
    expect(periodEnd(d('2028-01-31'), 1)).toBe('2028-02-29');
    expect(periodEnd(d('2026-08-31'), 6)).toBe('2027-02-28');
  });

  it('crosses the year boundary for multi-month packages', () => {
    expect(periodEnd(d('2026-12-15'), 1)).toBe('2027-01-14');
    expect(periodEnd(d('2026-10-15'), 3)).toBe('2027-01-14');
    expect(periodEnd(d('2026-10-15'), 12)).toBe('2027-10-14');
  });

  it('rejects non-positive or fractional month counts', () => {
    expect(() => periodEnd(d('2026-10-15'), 0)).toThrow(RangeError);
    expect(() => periodEnd(d('2026-10-15'), 1.5)).toThrow(RangeError);
  });
});

describe('renewalStart', () => {
  it('uses the renewal date for a first plan', () => {
    expect(renewalStart(null, d('2026-10-17'), DEFAULT_GRACE_DAYS)).toBe('2026-10-17');
  });

  it('chains from the old end while active', () => {
    expect(renewalStart(d('2026-11-14'), d('2026-10-17'), 3)).toBe('2026-11-15');
  });

  it('chains from the old end inside the grace window, last grace day included', () => {
    expect(renewalStart(d('2026-10-15'), d('2026-10-17'), 3)).toBe('2026-10-16');
    expect(renewalStart(d('2026-10-15'), d('2026-10-18'), 3)).toBe('2026-10-16');
  });

  it('starts on the renewal date after grace', () => {
    expect(renewalStart(d('2026-10-15'), d('2026-10-19'), 3)).toBe('2026-10-19');
    expect(renewalStart(d('2026-10-01'), d('2026-10-17'), 3)).toBe('2026-10-17');
  });

  it('matches the canvas examples end to end', () => {
    // Bea: ended Oct 15, renews in grace on Oct 17, keeps Oct 16 to Nov 15.
    expect(periodEnd(renewalStart(d('2026-10-15'), d('2026-10-17'), 3), 1)).toBe('2026-11-15');
    // Paolo: ended Oct 1, renews after grace on Oct 17, gets Oct 17 to Nov 16.
    expect(periodEnd(renewalStart(d('2026-10-01'), d('2026-10-17'), 3), 1)).toBe('2026-11-16');
  });
});

describe('extendForFreeze', () => {
  it('pushes the end date by the frozen days', () => {
    expect(extendForFreeze(d('2026-11-14'), 7)).toBe('2026-11-21');
    expect(extendForFreeze(d('2026-11-14'), 0)).toBe('2026-11-14');
  });

  it('rejects negative or fractional days', () => {
    expect(() => extendForFreeze(d('2026-11-14'), -1)).toThrow(RangeError);
    expect(() => extendForFreeze(d('2026-11-14'), 2.5)).toThrow(RangeError);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run (in `web/`): `npx vitest run src/domain/coverage.test.ts`
Expected: FAIL, `Failed to resolve import "./coverage"`.

- [ ] **Step 3: Implement**

Create `web/src/domain/coverage.ts`:

```ts
// Membership coverage rules, spec section 4.1 and 4.2.

import type { IsoDate } from './dates';
import { addDays, daysInMonth, fromParts, parts } from './dates';

export const DEFAULT_GRACE_DAYS = 3;

export function periodEnd(start: IsoDate, months: number): IsoDate {
  if (!Number.isInteger(months) || months < 1) {
    throw new RangeError(`months must be a positive integer: ${months}`);
  }
  const s = parts(start);
  const monthIndex = s.month - 1 + months;
  const year = s.year + Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  const lastDay = daysInMonth(year, month);
  if (s.day > lastDay) return fromParts(year, month, lastDay);
  return addDays(fromParts(year, month, s.day), -1);
}

export function renewalStart(currentEnd: IsoDate | null, renewedOn: IsoDate, graceDays: number): IsoDate {
  if (currentEnd === null) return renewedOn;
  const graceEnd = addDays(currentEnd, graceDays);
  // ISO dates compare correctly as strings.
  return renewedOn <= graceEnd ? addDays(currentEnd, 1) : renewedOn;
}

export function extendForFreeze(end: IsoDate, frozenDays: number): IsoDate {
  if (!Number.isInteger(frozenDays) || frozenDays < 0) {
    throw new RangeError(`frozenDays must be a non-negative integer: ${frozenDays}`);
  }
  return addDays(end, frozenDays);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/domain/coverage.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit and journal**

```bash
git add web/src/domain/coverage.ts web/src/domain/coverage.test.ts journal
git commit -m "feat(domain): add coverage period, renewal start and freeze extension"
```

Journal: `- [HH:MM] Added domain/coverage.ts (spec 4.1, 4.2). Verified: vitest coverage.test.ts 11 passed.`

---

### Task 4: Membership status machine and door decision

**Files:**
- Create: `web/src/domain/status.ts`
- Test: `web/src/domain/status.test.ts`

**Interfaces:**
- Consumes: `IsoDate`, `isoDate`, `addDays`, `diffDays` from Task 2.
- Produces:
  - `type MembershipStatus = 'frozen' | 'active' | 'expiring_soon' | 'grace' | 'expired' | 'inactive' | 'dormant' | 'no_plan'`
  - `interface StatusInput { today: IsoDate; coverageEnd: IsoDate | null; graceDays: number; frozen: boolean }`
  - `membershipStatus(input: StatusInput): MembershipStatus`
  - `type DoorDecision = 'allow' | 'soft_block'`
  - `doorDecision(status: MembershipStatus): DoorDecision`

- [ ] **Step 1: Write the failing tests**

Create `web/src/domain/status.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { addDays, isoDate } from './dates';
import type { MembershipStatus } from './status';
import { doorDecision, membershipStatus } from './status';

const today = isoDate('2026-10-17');
const status = (endOffsetDays: number | null, frozen = false) =>
  membershipStatus({
    today,
    coverageEnd: endOffsetDays === null ? null : addDays(today, endOffsetDays),
    graceDays: 3,
    frozen,
  });

describe('membershipStatus', () => {
  it('reports no plan and frozen before any date logic', () => {
    expect(status(null)).toBe('no_plan');
    expect(status(28, true)).toBe('frozen');
    expect(status(-200, true)).toBe('frozen');
  });

  it('splits active and expiring soon at 8 days remaining', () => {
    expect(status(28)).toBe('active');
    expect(status(8)).toBe('active');
    expect(status(7)).toBe('expiring_soon');
    expect(status(0)).toBe('expiring_soon');
  });

  it('keeps the grace window at 1 to 3 days past the end', () => {
    expect(status(-1)).toBe('grace');
    expect(status(-3)).toBe('grace');
    expect(status(-4)).toBe('expired');
  });

  it('measures expired, inactive and dormant from the end of grace', () => {
    expect(status(-(3 + 29))).toBe('expired');
    expect(status(-(3 + 30))).toBe('inactive');
    expect(status(-(3 + 89))).toBe('inactive');
    expect(status(-(3 + 90))).toBe('dormant');
  });

  it('matches the canvas members on Oct 17', () => {
    const at = (end: string) => membershipStatus({ today, coverageEnd: isoDate(end), graceDays: 3, frozen: false });
    expect(at('2026-11-14')).toBe('active');   // Mika, 28 days left
    expect(at('2026-10-15')).toBe('grace');    // Bea, grace until Oct 18
    expect(at('2026-10-01')).toBe('expired');  // Paolo, 16 days past end
  });
});

describe('doorDecision', () => {
  it('allows entry for active, expiring soon and grace', () => {
    const allowed: MembershipStatus[] = ['active', 'expiring_soon', 'grace'];
    for (const s of allowed) expect(doorDecision(s)).toBe('allow');
  });

  it('soft-blocks every other status', () => {
    const blocked: MembershipStatus[] = ['expired', 'inactive', 'dormant', 'no_plan', 'frozen'];
    for (const s of blocked) expect(doorDecision(s)).toBe('soft_block');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run (in `web/`): `npx vitest run src/domain/status.test.ts`
Expected: FAIL, `Failed to resolve import "./status"`.

- [ ] **Step 3: Implement**

Create `web/src/domain/status.ts`:

```ts
// Membership status hierarchy, spec section 4.3, and the soft door block, spec 4.4.

import type { IsoDate } from './dates';
import { diffDays } from './dates';

export type MembershipStatus =
  | 'frozen'
  | 'active'
  | 'expiring_soon'
  | 'grace'
  | 'expired'
  | 'inactive'
  | 'dormant'
  | 'no_plan';

export interface StatusInput {
  today: IsoDate;
  coverageEnd: IsoDate | null;
  graceDays: number;
  frozen: boolean;
}

export function membershipStatus(input: StatusInput): MembershipStatus {
  if (input.frozen) return 'frozen';
  if (input.coverageEnd === null) return 'no_plan';

  const remaining = diffDays(input.today, input.coverageEnd);
  if (remaining >= 8) return 'active';
  if (remaining >= 0) return 'expiring_soon';

  const pastEnd = -remaining;
  if (pastEnd <= input.graceDays) return 'grace';

  const pastGrace = pastEnd - input.graceDays;
  if (pastGrace < 30) return 'expired';
  if (pastGrace < 90) return 'inactive';
  return 'dormant';
}

export type DoorDecision = 'allow' | 'soft_block';

// A soft block never locks anyone out: the desk can renew on the spot or
// allow entry with a logged reason (spec 4.4, 8.1.2).
export function doorDecision(status: MembershipStatus): DoorDecision {
  return status === 'active' || status === 'expiring_soon' || status === 'grace' ? 'allow' : 'soft_block';
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/domain/status.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit and journal**

```bash
git add web/src/domain/status.ts web/src/domain/status.test.ts journal
git commit -m "feat(domain): add membership status machine and door decision"
```

Journal: `- [HH:MM] Added domain/status.ts (spec 4.3, 4.4). Verified: vitest status.test.ts 7 passed.`

---

### Task 5: Money and drawer count total

**Files:**
- Create: `web/src/domain/money.ts`, `web/src/domain/drawer.ts`
- Test: `web/src/domain/money.test.ts`, `web/src/domain/drawer.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `type Centavos = number` (integer)
  - `pesos(amount: number): Centavos` (whole pesos to centavos)
  - `formatPhp(amount: Centavos): string` (for example `PHP 5,445.00`)
  - `BILL_DENOMINATIONS = [1000, 500, 200, 100, 50, 20] as const`
  - `type Bill = 1000 | 500 | 200 | 100 | 50 | 20`
  - `interface DrawerCount { bills: Record<Bill, number>; coinsPesos: number }`
  - `drawerTotal(count: DrawerCount): Centavos`

- [ ] **Step 1: Write the failing tests**

Create `web/src/domain/money.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatPhp, pesos } from './money';

describe('money', () => {
  it('converts whole pesos to centavos', () => {
    expect(pesos(5445)).toBe(544500);
    expect(() => pesos(10.5)).toThrow(RangeError);
  });

  it('formats centavos as PHP with grouping and two decimals', () => {
    expect(formatPhp(544500)).toBe('PHP 5,445.00');
    expect(formatPhp(5)).toBe('PHP 0.05');
    expect(formatPhp(0)).toBe('PHP 0.00');
    expect(formatPhp(-12050)).toBe('-PHP 120.50');
    expect(formatPhp(123456789)).toBe('PHP 1,234,567.89');
  });

  it('rejects fractional centavos', () => {
    expect(() => formatPhp(1.5)).toThrow(RangeError);
  });
});
```

Create `web/src/domain/drawer.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { DrawerCount } from './drawer';
import { BILL_DENOMINATIONS, drawerTotal } from './drawer';
import { formatPhp } from './money';

const canvasCount: DrawerCount = {
  bills: { 1000: 2, 500: 3, 200: 4, 100: 6, 50: 5, 20: 8 },
  coinsPesos: 135,
};

describe('drawerTotal', () => {
  it('lists denominations from 1,000 down to 20', () => {
    expect([...BILL_DENOMINATIONS]).toEqual([1000, 500, 200, 100, 50, 20]);
  });

  it('matches the canvas handover count of PHP 5,445.00', () => {
    expect(formatPhp(drawerTotal(canvasCount))).toBe('PHP 5,445.00');
  });

  it('accepts an empty drawer', () => {
    expect(drawerTotal({ bills: { 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0 }, coinsPesos: 0 })).toBe(0);
  });

  it('rejects negative or fractional counts', () => {
    expect(() => drawerTotal({ ...canvasCount, bills: { ...canvasCount.bills, 500: -1 } })).toThrow(RangeError);
    expect(() => drawerTotal({ ...canvasCount, bills: { ...canvasCount.bills, 20: 1.5 } })).toThrow(RangeError);
    expect(() => drawerTotal({ ...canvasCount, coinsPesos: -5 })).toThrow(RangeError);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run (in `web/`): `npx vitest run src/domain/money.test.ts src/domain/drawer.test.ts`
Expected: FAIL, `Failed to resolve import "./money"` and `"./drawer"`.

- [ ] **Step 3: Implement**

Create `web/src/domain/money.ts`:

```ts
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
```

Create `web/src/domain/drawer.ts`:

```ts
// Blind drawer count, spec section 8.1.4. Coins are counted as whole pesos.

import type { Centavos } from './money';
import { pesos } from './money';

export const BILL_DENOMINATIONS = [1000, 500, 200, 100, 50, 20] as const;

export type Bill = (typeof BILL_DENOMINATIONS)[number];

export interface DrawerCount {
  bills: Record<Bill, number>;
  coinsPesos: number;
}

function assertCount(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${label} must be a non-negative whole number: ${value}`);
  }
}

export function drawerTotal(count: DrawerCount): Centavos {
  let totalPesos = 0;
  for (const bill of BILL_DENOMINATIONS) {
    const n = count.bills[bill];
    assertCount(n, `Count of PHP ${bill} bills`);
    totalPesos += n * bill;
  }
  assertCount(count.coinsPesos, 'Coins');
  return pesos(totalPesos + count.coinsPesos);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/domain/money.test.ts src/domain/drawer.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit and journal**

```bash
git add web/src/domain/money.ts web/src/domain/money.test.ts web/src/domain/drawer.ts web/src/domain/drawer.test.ts journal
git commit -m "feat(domain): add centavo money formatting and drawer count total"
```

Journal: `- [HH:MM] Added domain/money.ts and domain/drawer.ts. Verified: vitest 7 passed, canvas count equals PHP 5,445.00.`

---

### Task 6: Design tokens and house-rule guard

**Files:**
- Create: `web/src/styles/tokens.css`, `web/src/styles/tokens.test.ts`, `web/src/house-rules.test.ts`
- Modify: `web/src/main.tsx` (import tokens), `docs/CODE_MAP.md` (no change needed if Task 1 rows exist)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties used by every UI plan: `--bg-canvas`, `--bg-card`, `--bg-card-elevated`, `--border-hairline`, `--color-accent`, `--color-accent-dim`, `--text-primary`, `--text-secondary`, `--text-label`, `--text-quiet`, `--text-muted`, `--status-active`, `--status-accent`, `--status-frozen`, `--status-expired`, `--status-expired-text`, `--status-gray`, `--status-gray-dim`, `--color-offline`, `--surface-rest-bar`, `--tabbar-bg`, `--tabbar-hairline`, `--font-voice`, `--font-mono`.

- [ ] **Step 1: Write the failing tests**

Create `web/src/styles/tokens.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(fileURLToPath(new URL('./tokens.css', import.meta.url)), 'utf8');

const expected: Record<string, string> = {
  '--bg-canvas': '#0C0C0E',
  '--bg-card': '#17171A',
  '--bg-card-elevated': '#1F1F23',
  '--border-hairline': 'rgba(255, 255, 255, 0.06)',
  '--color-accent': '#FF6A00',
  '--color-accent-dim': 'rgba(255, 106, 0, 0.15)',
  '--text-primary': '#FFFFFF',
  '--text-secondary': '#71717A',
  '--text-label': '#8E8E93',
  '--text-quiet': '#A1A1AA',
  '--text-muted': '#3F3F46',
  '--status-active': '#30D158',
  '--status-accent': '#FF6A00',
  '--status-frozen': '#64D2FF',
  '--status-expired': '#FF453A',
  '--status-expired-text': '#FF6961',
  '--status-gray': '#8E8E93',
  '--status-gray-dim': '#48484A',
  '--color-offline': '#FF9F0A',
  '--surface-rest-bar': '#2C2C2E',
  '--tabbar-bg': 'rgba(12, 12, 14, 0.82)',
  '--tabbar-hairline': 'rgba(255, 255, 255, 0.08)',
};

describe('design tokens', () => {
  it('declares every spec section 6 token with its exact value', () => {
    for (const [name, value] of Object.entries(expected)) {
      expect(css).toContain(`${name}: ${value};`);
    }
  });

  it('carries none of the retired tactile tokens', () => {
    for (const retired of ['#0E0E10', '#121214', '#1C1C1E', '#242428']) {
      expect(css.toUpperCase()).not.toContain(retired);
    }
  });
});
```

Create `web/src/house-rules.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('.', import.meta.url));
const DASHES = /[\u2013\u2014]/;
const EMOJI = /\p{Extended_Pictographic}/u;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css|html|json|md)$/.test(name) ? [path] : [];
  });
}

describe('house rules', () => {
  const files = sourceFiles(SRC);

  it('finds source files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('has no en dashes or em dashes', () => {
    const offenders = files.filter((f) => DASHES.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('has no emoji', () => {
    const offenders = files.filter((f) => EMOJI.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run (in `web/`): `npx vitest run src/styles/tokens.test.ts src/house-rules.test.ts`
Expected: tokens test FAILS with `ENOENT` for `tokens.css`. The house-rules test may also FAIL if the Vite template files contain an emoji or dash; if so, the offending template files are listed and Step 3 removes them.

- [ ] **Step 3: Implement**

Create `web/src/styles/tokens.css`:

```css
/* Matte Stealth Dark iOS tokens, spec section 6. Do not add colors here
   without adding them to the spec table first. */
:root {
  --bg-canvas: #0C0C0E;
  --bg-card: #17171A;
  --bg-card-elevated: #1F1F23;
  --border-hairline: rgba(255, 255, 255, 0.06);

  --color-accent: #FF6A00;
  --color-accent-dim: rgba(255, 106, 0, 0.15);

  --text-primary: #FFFFFF;
  --text-secondary: #71717A;
  --text-label: #8E8E93;
  --text-quiet: #A1A1AA;
  --text-muted: #3F3F46;

  --status-active: #30D158;
  --status-accent: #FF6A00;
  --status-frozen: #64D2FF;
  --status-expired: #FF453A;
  --status-expired-text: #FF6961;
  --status-gray: #8E8E93;
  --status-gray-dim: #48484A;

  --color-offline: #FF9F0A;
  --surface-rest-bar: #2C2C2E;

  --tabbar-bg: rgba(12, 12, 14, 0.82);
  --tabbar-hairline: rgba(255, 255, 255, 0.08);

  --font-voice: 'Archivo Variable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, monospace;

  color-scheme: dark;
}

body {
  margin: 0;
  background: var(--bg-canvas);
  color: var(--text-primary);
  font-family: var(--font-voice);
}
```

In `web/src/main.tsx`, replace the template's `import './index.css'` line with:

```ts
import './styles/tokens.css'
```

Delete the template stylesheets the app no longer imports, and any template file the house-rules test listed:

```bash
rm src/index.css src/App.css   # inside web/
```

Replace `web/src/App.tsx` with a minimal shell so the build no longer references the deleted stylesheet:

```tsx
export default function App() {
  return <main aria-label="The Infinity Fitness desk">The Infinity Fitness</main>;
}
```

- [ ] **Step 4: Run the full suite and the build**

```bash
npm test
npm run build
```

Expected: Vitest reports 7 test files passed (dates, coverage, status, money, drawer, tokens, house-rules) with 0 failures; the build ends with `built in`.

- [ ] **Step 5: Commit and journal**

```bash
git add -A web/src journal
git commit -m "feat(web): add spec section 6 design tokens and house-rule guard test"
```

Journal: `- [HH:MM] Added styles/tokens.css and house-rules guard. Verified: npm test all files passed, npm run build ok.`

---

## Plan 01 Exit Check

- [ ] `cd web && npm test` passes with 7 test files and 0 failures.
- [ ] `npm run build` succeeds.
- [ ] `npm audit` findings, if any, have been shown to the user with a triage note.
- [ ] `docs/CODE_MAP.md` lists `web/src/domain/` and `web/src/styles/tokens.css`.
- [ ] Journal has one line per task with the verification output.
- [ ] Next: write Plan 02 (Desk API contract and demo backend) from the overview, consuming `IsoDate`, `MembershipStatus`, `membershipStatus`, `doorDecision`, `renewalStart`, `periodEnd`, `DrawerCount`, `drawerTotal`, `Centavos` exactly as named here.
