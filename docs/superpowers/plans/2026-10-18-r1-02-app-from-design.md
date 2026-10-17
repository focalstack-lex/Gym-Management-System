# Release 1, Plan 02: Build the App From the Design Canvas

Goal: every artboard in `design/canvas/*.dc.html` becomes a working React screen in `web/`, identical in look and copy, running on the in-memory demo store. Supabase (Plan 03) replaces the demo store later behind the same screens.

Binding rule from the owner: do not change any detail of the design that could change the brand or what the design shows.

## Foundation (done, do not modify)

| File | Purpose |
| --- | --- |
| `design/canvas/*.dc.html` | Source of truth, one artboard per screen |
| `web/src/lib/css.ts` | `css("<declaration string>")` returns a React style object; paste canvas style strings verbatim |
| `web/src/components/PhoneScreen.tsx` | Replaces a phone artboard's 390 x 844 root frame (the only sanctioned adaptation) |
| `web/src/design-map.ts` | Artboard to source files; the parity test reads it |
| `web/src/design-parity.test.ts` | Fails unless every style string, SVG path and visible copy of an artboard is in its source files |
| `web/src/apps/<app>/parity-allow.ts` | Per-app list of copy rendered from data instead of literals (reviewed) |
| `web/src/demo/seed.ts`, `state.ts`, `store.tsx` | Demo data (canvas clock Sat Oct 17, 2026, 6:42 PM), reducer, `useDemo()` |
| `web/src/apps/<app>/routes.tsx` | Each app exports its `RouteObject[]` |
| `web/public/brand/logo.jpg`, `gym-floor.jpg` | Replace `/_blob/294886e6b2eee6dab4e99c3eb05f0d84` (logo) and `/_blob/b0d0e3470188dffa23e7b812cf89f23f` (gym floor) |

## Porting rules

1. One component per artboard at the path in `design-map.ts`. Read the whole `.dc.html` first.
2. Markup: same elements, same nesting, same attributes (aria, roles, inputmode, autocomplete). `class` becomes `className`, `for` becomes `htmlFor`, `stroke-width` style SVG attributes become camelCase JSX props (`strokeWidth`, `strokeLinecap`, `strokeLinejoin`, `viewBox` stays). SVG `d`, `points`, `x`, `y`, `rx` values are copied byte for byte.
3. Styles: every `style="..."` becomes `style={css("...")}` with the identical string (use double quotes, or backticks when the string contains a double quote). A `{{hole}}` inside a style becomes a template literal `css(\`... ${value} ...\`)`. Never restate a style as an object, never reorder or reformat declarations, never add declarations to a canvas style. If a screen needs an extra style (for example a hover or disabled state that the canvas does not show), put it in a separate wrapper or a second `style` merge only for that state, and keep the canvas string intact.
4. Phone artboards: the root `<div style="width: 390px; height: 844px; ...; padding: P">` becomes `<PhoneScreen padding="P" bars={...}>`. Tab bars and sticky bottom bars (the elements styled `position: absolute; left: 0; right: 0; bottom: 0; ...`) go in the `bars` prop with their style string unchanged. Pass `bottomInset` so the last content clears the bar (tab bar 120, sticky bars 150 to 170).
5. Desktop artboards (`Desk-Checkin`, `Desk-Shift`, `Owner-*`): the fluid root is kept verbatim; no PhoneScreen.
6. `sc-for` becomes `.map` with stable keys; `sc-if` becomes conditional rendering; `renderVals()` logic becomes component state or `useDemo()` selectors. Tweak enums (`scan`, `network`, `state`, `overlay`, `checkin`, `bucket`) become real state: from data where the data decides it (member status, online flag), otherwise from local state or a URL query (`?style=Minimal`, `?member=paolo`) so every canvas state is reachable.
7. Links: `<a href="X.dc.html">` becomes `<Link to="/route">` with the same style string. Route table: Member-Login `/login`, Member-Activate `/activate`, Member-Set-Password `/activate/password`, Member-Home `/m/today`, Member-Pass `/m/pass`, Member-Workout `/m/workout`, Member-Share* `/m/share` (`?style=`), Member-Attendance `/m/attendance`, Member-History `/m/history`, Member-Notices `/m/notices`, Member-Receipt `/m/receipt`, Member-Busy `/m/busy`, Member-Profile `/m/profile`, Staff-PIN `/staff/pin`, Desk-Mobile-Checkin and Desk-Checkin `/desk/checkin` (station layout at 1024px and wider), Desk-Mobile-Walkin `/desk/walkin`, Desk-Mobile-Scan `/desk/scan`, Desk-Mobile-Expiry `/desk/expiry`, Desk-Mobile-Shift and Desk-Shift `/desk/shift` (station at 1024px and wider), Desk-Mobile-Enroll `/desk/enroll`, Desk-Mobile-Activation `/desk/enroll/activation`, Desk-Mobile-Freeze `/desk/freeze`, Desk-Mobile-Convert `/desk/convert`, Coach-Clients `/coach/clients`, Coach-Schedule `/coach/schedule`, Coach-Log `/coach/log`, Coach-Plan `/coach/plan`, Owner-Dashboard `/owner`, Owner-Plans `/owner/plans`, Owner-Approvals `/owner/approvals`, Owner-Staff `/owner/staff`, Owner-Audit `/owner/audit`. `href="#"` stays a non-navigating control (use a `<button type="button">` only if the canvas element is a button; otherwise `<a href="#">` with `onClick` preventDefault).
8. Behavior: wire every control the design implies to the demo store or local state (check in, renew, allow entry with reason, record walk-in, lock count, PIN keypad, segmented controls, share style picker, mark all read). Validate input before dispatch; never swallow errors. Do not add UI the canvas does not show.
9. Copy: identical text, punctuation and casing. No emojis, no en or em dashes. The middle dot `·` is allowed where the canvas has it.
10. Never edit files outside the files you were assigned. Frozen: `design-map.ts`, `demo/*`, `PhoneScreen.tsx`, `css.ts`, `App.tsx`, the parity test, and the shared tab bars (`MemberTabBar.tsx`, `DeskTabBar.tsx`, `CoachTabBar.tsx`). If you need a change there, report it instead.
11. A data-driven value inside a style (for example `color: ${accent}`) matches the canvas literal in the parity test; everything else must match character for character.

## Done means

- `npx vitest run src/design-parity.test.ts -t "<your artboard prefix>"` passes for every artboard you own.
- `npm test` and `npm run build` pass in `web/`.
- Every route you own renders without console errors.
