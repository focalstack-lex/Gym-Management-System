// Visible copy this app renders from computed data instead of a literal, keyed by artboard.
// Each string must still render exactly like this for the demo seed data. Every entry is reviewed.
export const deskMoreParityAllow: Record<string, string[]> = {
  // Dates come from Mika's coverage end (Nov 14) plus the chosen freeze length (14 days), formatted by fmt().
  'Desk-Mobile-Freeze.dc.html': ['to Nov 14', 'Coverage moves from Nov 14 to Nov 28', 'Oct 31', 'Nov 28'],
};
