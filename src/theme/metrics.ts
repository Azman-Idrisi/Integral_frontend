import { Platform, type TextStyle } from "react-native";

// iOS uses the system font, SF Pro, picked by weight. SF Pro may only ship
// on Apple platforms, so Android (and web) use Inter, loaded in
// app/_layout.tsx, where each weight is its own family. Spread these
// (`...font.semibold`) instead of setting fontWeight or fontFamily.
const weight = (value: "400" | "600" | "700", inter: string): TextStyle =>
  Platform.OS === "ios" ? { fontWeight: value } : { fontFamily: inter };

export const font = {
  regular: weight("400", "Inter_400Regular"),
  semibold: weight("600", "Inter_600SemiBold"),
  bold: weight("700", "Inter_700Bold"),
  // IDs and times: SF Mono on iOS, Inter's tabular figures elsewhere.
  mono: (Platform.OS === "ios"
    ? { fontFamily: "ui-monospace" }
    : { fontVariant: ["tabular-nums"] }) as TextStyle,
};

// Apple's text styles, one step smaller.
export const type = {
  display: { fontSize: 44, lineHeight: 52, ...font.bold },
  largeTitle: { fontSize: 28, lineHeight: 34, ...font.bold },
  title: { fontSize: 20, lineHeight: 25, ...font.bold },
  headline: { fontSize: 17, lineHeight: 22, ...font.semibold },
  bodyStrong: { fontSize: 15, lineHeight: 20, ...font.semibold },
  body: { fontSize: 15, lineHeight: 20, ...font.regular },
  callout: { fontSize: 14, lineHeight: 19, ...font.regular },
  footnote: { fontSize: 12, lineHeight: 16, ...font.regular },
  caption: { fontSize: 11, lineHeight: 13, ...font.semibold },
  tabLabel: { fontSize: 10, lineHeight: 12, ...font.semibold },
  overline: {
    fontSize: 11,
    lineHeight: 13,
    ...font.semibold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;

export const radius = {
  capsule: 9999,
  card: 24,
  nested: 16,
  photo: 20,
  input: 14,
} as const;

export const space = {
  gutter: 20,
  card: 20,
  listCard: 16,
  cardGap: 12,
  sectionGap: 24,
} as const;

export const tabBar = {
  height: 64,
  inset: 16,
  offset: 8,
} as const;

export const minTouch = 44;

// Shared by the tab selector and the segmented control thumb.
export const spring = {
  damping: 18,
  stiffness: 220,
  mass: 0.9,
} as const;
