// Visible copy this app renders from computed data instead of a literal, keyed by artboard.
// Each string must still render exactly like this for the demo seed data. Every entry is reviewed.
export const coachParityAllow: Record<string, string[]> = {
  // Saturday draws "2 of 4 done"; the counts come from the selected day, so the literal is split.
  'Coach-Schedule.dc.html': ['of 4 done'],
};
