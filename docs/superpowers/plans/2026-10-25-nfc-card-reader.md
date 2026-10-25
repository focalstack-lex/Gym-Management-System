# NFC card reader integration, keyboard-wedge mode

Status: demo mode implemented. Production storage and RPC are specified below for the Supabase plan.

## Reader

The reader is a 13.56 MHz USB Mifare card reader that enumerates as a USB keyboard. Tapping a card types the card UID and normally presses Enter. No driver and no local service are required, so the deployed PWA can read it directly.

Some units are configured without the Enter suffix. The reader hook also emits when keystrokes stop for 180ms, so both configurations work.

Supported readings:

| Reader output | Example | Handling |
| --- | --- | --- |
| 4-byte UID as hex | `04A1B2C3` | Used directly |
| 7-byte UID as hex | `04A1B2C3D4E5F6` | Used directly |
| 4-byte UID as decimal | `77705923` | Also checked as `04A1B2C3` |
| 7-byte UID as decimal | up to 20 digits | Converted to 14 hex characters |

Separators such as spaces, colons, dots and hyphens are stripped, and a leading `0x` is ignored.

## Demo behavior

- `web/src/apps/desk/_card.ts` normalizes card readings, resolves a member, stores locally assigned cards and captures keyboard-wedge input.
- `web/src/demo/seed.ts` holds `SEED_CARDS`, a demo UID to member registry.
- `web/src/apps/desk/Scan.tsx` listens for card taps on the Scan screen only. No text input is in use there, so a card read cannot leak into the search field.
- A known, allowed member is checked in immediately and the success card shows the name, time, plan and member code.
- An allowed member who is already checked in today gets an `already checked in` notice instead of a duplicate row.
- An expired, frozen or otherwise soft-blocked member is sent to `/desk/checkin?member=<id>` so staff can renew or log a reason.
- An unknown card writes an `Unknown card tapped` audit row and displays the normalized UID so it can be assigned.
- Undo on the success card removes the new check-in as before.

## Assigning a real card in the demo

1. Open `/desk/scan?assign=<member id or member code>` on the desk browser, for example `/desk/scan?assign=mika` or `/desk/scan?assign=INF-00482`.
2. Tap the physical card.
3. The screen confirms `Card <uid> assigned to <name>`.
4. Tap the same card again to check in.

Assignments live in `localStorage` under `infinity.cards.v1` for that browser. The demo registry is not a server source of truth, so a different browser or a cleared profile needs the card assigned again.

## Hardware test

1. Open Notepad on the desk computer.
2. Tap a card.
3. Confirm text appears and note whether it ends with a new line.
4. Open `/desk/scan` in the app and tap the same card.

If the UID shown in the app does not match the assignment, check whether the reader is in decimal or hex mode. The parser accepts both, but the displayed value is the normalized form written to the registry.

## Production design

### Table

```sql
create table member_cards (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  uid_hmac text not null unique,
  label text,
  active boolean not null default true,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  issued_by uuid references staff(id)
);

create unique index member_cards_active_member
  on member_cards(member_id)
  where active;
```

The raw UID is never stored. The server computes an HMAC with a secret held in Supabase Vault and stores only the digest. Lookup uses the same HMAC.

### RPC

```sql
check_in_by_card(p_uid text, p_client_id uuid)
  returns table (member_id uuid, display_name text, status text, check_in_id uuid, new boolean)
```

Rules:

- Validate the UID format server-side, not only in the browser.
- Recompute the HMAC and look up an active card.
- Reuse the existing check-in rules for status, grace and soft blocks.
- Treat a repeated `p_client_id` as the same event.
- Rate limit per device and per card.
- Write `check_in` or `check_in_refused` to the audit log.
- Return a soft-block result instead of checking in for expired or frozen members.

### Security and operations

- A UID is an identifier, not a secret. MIFARE Classic UIDs can be cloned. That is acceptable for gym check-in convenience; use DESFire EV2/EV3 or NTAG 424 DNA with cryptographic authentication if the card will authorize payments or door access.
- Revoke a lost card by setting `active = false` and `revoked_at`; the next tap is refused and audited.
- One active card per member, enforced by the partial unique index.
- Do not write the visible member code to the card. Use the UID or a random token in an NDEF record.
- Keep the reader on the desk station. Do not expose a card lookup endpoint to the member app.
- Treat keyboard-wedge input as untrusted text. The demo limits reads to 32 alphanumeric characters, requires at least 8, and accepts only formats that normalize to a valid UID.

### Migration from the demo

1. Add `member_cards` and the HMAC helper in the Supabase migration.
2. Replace `loadCardMap` and `assignCard` with RPC calls.
3. Keep the Scan screen contract: a card read resolves to one member and one check-in result.
4. Import the physical cards by tapping each one in an owner-only assignment screen and writing the HMAC server-side.
5. Move card assignment out of the URL flow and into the owner console.

## Tests

`web/src/apps/desk/_card.test.ts` covers hex and decimal normalization, ambiguous 8-digit readings, invalid values, seeded lookup and unknown cards. `design-parity.test.ts` still passes because the Scan screen keeps its canvas style strings and only adds behavior and a status line.
