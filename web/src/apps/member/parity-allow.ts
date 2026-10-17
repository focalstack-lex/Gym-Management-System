// Visible copy this app renders from computed data instead of a literal, keyed by artboard.
// Each string must still render exactly like this for the demo seed data. Every entry is reviewed.
export const memberParityAllow: Record<string, string[]> = {
  // Greeting uses the demo member's nickname; status label comes from statusOf(); date from coverageEnd.
  'Member-Home.dc.html': ['Good evening, Mika', 'Active', 'to Nov 14'],
  // Status label comes from statusOf().
  'Member-Pass.dc.html': ['Active'],
  // The done-set count and set count are live state.
  'Member-Workout.dc.html': ['Barbell, 3 of 4 sets'],
};
