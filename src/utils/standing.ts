// Attendance Standing (GLOSSARY.md). The app always assigns it and ignores
// any status text from SMS.
export type Standing = "Safe" | "Borderline" | "Short";

export function getStanding(percentage: number): Standing {
  if (percentage >= 75) return "Safe";
  if (percentage >= 70) return "Borderline";
  return "Short";
}

// The theme color token for each Standing: `colors[standingToken[s]]`.
export const standingToken = {
  Safe: "safe",
  Borderline: "borderline",
  Short: "short",
} as const;
