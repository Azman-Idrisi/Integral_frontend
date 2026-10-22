// Values come from DESIGN.md. Change them there first, then here.

export const palette = {
  sky: "#23C9FF",
  ice: "#7CC6FE",
  ink: "#051014",
  slate: "#2E4052",
  white: "#FFFFFF",
};

const shared = {
  // Attendance Standing. Palette only: Safe and Borderline are the two blues;
  // Short is `text` (per theme, below) shown as an outline.
  safe: palette.sky,
  borderline: palette.ice,
  accent: palette.sky,
  // Text on sky and ice fills.
  onFill: palette.ink,
  // Tinted glass for the primary button, ink label 7.4:1 at worst.
  accentGlass: "rgba(35,201,255,0.85)",
  onAccentGlass: palette.ink,
  // Tinted glass uses the subtler dark-theme light in both themes; the light
  // theme's strong white sheen would wash the color out.
  glassTintSheen:
    "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 40%)",
  glassTintRim:
    "inset 0px 0px 0px 1px rgba(255,255,255,0.14), inset 1.5px 1.5px 1px rgba(255,255,255,0.55), inset -1px -1px 1px rgba(255,255,255,0.28), inset 0px 0px 14px rgba(255,255,255,0.10)",
};

const dark = {
  ...shared,
  bg: palette.ink,
  // Cards are translucent so the glows show through; nested blocks lighten
  // the card a little. The solid versions are for Reduce Transparency.
  surface: "rgba(46,64,82,0.45)",
  surfaceRaised: "rgba(255,255,255,0.06)",
  surfaceSolid: "#13212A",
  text: palette.white,
  textMuted: "rgba(255,255,255,0.70)",
  textSubtle: "rgba(255,255,255,0.65)",
  border: "rgba(255,255,255,0.12)",
  borderControl: "rgba(255,255,255,0.50)",
  short: palette.white,
  // Error icons.
  danger: palette.white,
  // Spinners, focus ring, pull-to-refresh.
  accentInk: palette.sky,
  glassFillBlur: "rgba(19,33,42,0.80)",
  glassFill: "rgba(19,33,42,0.85)",
  glassStroke: "rgba(255,255,255,0.10)",
  // Top sheen; fades out by 40% so tab labels keep 4.5:1.
  glassSheen:
    "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 40%)",
  // Rim light all round, brightest top-left, plus a soft inner glow.
  glassRim:
    "inset 0px 0px 0px 1px rgba(255,255,255,0.14), inset 1.5px 1.5px 1px rgba(255,255,255,0.55), inset -1px -1px 1px rgba(255,255,255,0.28), inset 0px 0px 14px rgba(255,255,255,0.10)",
  // Full ring on thumbs, 4.1:1 against the track.
  glassRing: "inset 0px 0px 0px 1px rgba(255,255,255,0.35)",
  // Neutral buttons and the segmented track have no fill at all: just this
  // ring and a top-left highlight.
  glassControlEdge:
    "inset 0px 0px 0px 1px rgba(255,255,255,0.35), inset 1.5px 1.5px 1px rgba(255,255,255,0.35)",
  selectorFill: "rgba(255,255,255,0.14)",
  thumbFill: "rgba(255,255,255,0.14)",
};

const light: typeof dark = {
  ...shared,
  // Ice at 0.10 over white; cards are white at 0.65.
  bg: "#F2F9FF",
  surface: "rgba(255,255,255,0.65)",
  surfaceRaised: "rgba(46,64,82,0.06)",
  surfaceSolid: palette.white,
  short: palette.ink,
  danger: palette.ink,
  text: palette.ink,
  textMuted: palette.slate,
  textSubtle: "rgba(46,64,82,0.85)",
  border: "rgba(46,64,82,0.15)",
  borderControl: "rgba(46,64,82,0.65)",
  // Sky is only 1.9:1 on white, so small accent graphics use ink.
  accentInk: palette.ink,
  glassFillBlur: "rgba(255,255,255,0.80)",
  glassFill: "rgba(255,255,255,0.85)",
  glassStroke: "rgba(5,16,20,0.08)",
  glassSheen:
    "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%)",
  glassRim:
    "inset 0px 0px 0px 1px rgba(255,255,255,0.7), inset 1.5px 1.5px 1px rgba(255,255,255,1), inset -1px -1px 1px rgba(5,16,20,0.08), inset 0px 0px 14px rgba(255,255,255,0.6)",
  // 3.6:1 against the track.
  glassRing: "inset 0px 0px 0px 1px rgba(5,16,20,0.55)",
  glassControlEdge:
    "inset 0px 0px 0px 1px rgba(5,16,20,0.50), inset 1.5px 1.5px 1px rgba(255,255,255,0.9)",
  selectorFill: "rgba(35,201,255,0.18)",
  thumbFill: palette.white,
};

export type Colors = typeof dark;

type Orb = { color: string; opacity: number };

// Kept faint on purpose: just enough color for the glass to pick up.
const orbs: Record<"dark" | "light", Orb[]> = {
  dark: [
    { color: palette.ice, opacity: 0.1 },
    { color: palette.sky, opacity: 0.08 },
    { color: palette.slate, opacity: 0.35 },
  ],
  light: [
    { color: palette.sky, opacity: 0.06 },
    { color: palette.ice, opacity: 0.08 },
  ],
};

// boxShadow is drawn only outside the shape. Android `elevation` would show
// through translucent cards and glass and darken them.
const elevation = {
  dark: {
    card: {},
    floating: {
      boxShadow: "0px 8px 24px rgba(0,0,0,0.45)",
    },
  },
  light: {
    card: {
      boxShadow: "0px 2px 8px rgba(5,16,20,0.06)",
    },
    floating: {
      boxShadow: "0px 8px 24px rgba(5,16,20,0.12)",
    },
  },
};

export const palettes = {
  dark: { colors: dark, orbs: orbs.dark, elevation: elevation.dark },
  light: { colors: light, orbs: orbs.light, elevation: elevation.light },
};
