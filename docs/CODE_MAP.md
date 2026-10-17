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
