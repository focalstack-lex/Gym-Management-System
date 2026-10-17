// Visible copy this app renders from computed data instead of a literal, keyed by artboard.
// Each string must still render exactly like this for the demo seed data. Every entry is reviewed.
export const deskParityAllow: Record<string, string[]> = {
  'Desk-Mobile-Checkin.dc.html': [
    // planLine: plan name and coverage end come from the member record
    'Monthly plan, valid through Nov 14, 2026',
    'Monthly plan, ended Oct 15, 2026',
    'Monthly plan, ended Oct 1, 2026',
    // last visit note: the seed stores "Wed, 6:10 PM", the card shows "last visit, 6:10 PM"
    'last visit, 6:10 PM',
    'last visit, 7:05 AM',
    // grace and soft block banners: dates come from the coverage rules (renewalStart, periodEnd, grace days)
    'In grace until Oct 18.',
    'Renewing now continues from Oct 16 to Nov 15, so no days are lost.',
    'Ended Oct 1, past grace. Renewal today runs Oct 17 to Nov 16.',
    // reason sheet subtitle: member name and end date
    'Paolo Reyes, expired Oct 1. The reason is written to the audit log.',
    // outbox size comes from state.outbox
    '· Outbox: 3',
  ],
  'Desk-Checkin.dc.html': [
    // header outbox size comes from state.outbox
    'outbox 0',
    // soft block banner: dates and grace days from the coverage rules
    'Soft block: membership ended Oct 1',
    'Past the 3-day grace window, so a renewal today runs Oct 17 to Nov 16.',
    // sign-in sheet row and entry total computed from state.signIns and sheetCounts()
    'Walk-in, GCash',
    'See all 56 entries',
    // reference label follows the selected payment mode
    'GCash reference no.',
  ],
  'Desk-Mobile-Walkin.dc.html': [
    // reference label follows the selected payment mode; payment text is mode plus the stored last 4 digits
    'GCash reference no.',
    'GCash 4402',
  ],
  'Desk-Mobile-Expiry.dc.html': [
    // remaining lapsed members beyond the four listed
    'Show 5 more lapsed',
  ],
  'Desk-Mobile-Shift.dc.html': [
    // handover subtitle uses the live sign-in sheet counts
    'Ana R. to Joel M., 47 in, 9 walk-ins',
  ],
  'Desk-Shift.dc.html': [
    // cents of the live draft total
    '.00 PHP',
  ],
};
