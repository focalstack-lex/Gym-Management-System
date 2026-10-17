# Code Map

| Path | What lives there |
| --- | --- |
| `design/canvas/` | Design canvas artboards, the visual source of truth |
| `docs/superpowers/specs/` | Approved design specification (source of truth) |
| `docs/superpowers/plans/` | Implementation plans, one per Release 1 subsystem |
| `journal/` | Daily development journal |
| `reports/ui-verification/` | Screenshots, exported files and the browser verification report |
| `web/` | Desk PWA (Vite, React, TypeScript) |
| `web/src/domain/` | Pure business rules: dates, coverage, status, money, drawer |
| `web/src/demo/` | In-memory demo seed, reducer, provider and tests |
| `web/src/apps/member/` | Member screens and routes |
| `web/src/apps/desk/` | Desk phone and station screens, routes and shared desk logic |
| `web/src/apps/coach/` | Coach screens and routes |
| `web/src/apps/owner/` | Owner admin screens and routes |
| `web/src/apps/staff/` | Staff PIN screen and route |
| `web/src/components/` | Phone frame and shared tab bar |
| `web/src/styles/tokens.css` | Design tokens from spec section 6 |

Staleness gate: update this file in the same commit as any new top-level folder or domain module.
