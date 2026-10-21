import { StyleSheet, useColorScheme } from "react-native";
import { palettes } from "./tokens";

export { font, radius, space, spring, tabBar, type, minTouch } from "./metrics";
export type { Colors } from "./tokens";

const themes = {
  dark: { name: "dark" as const, ...palettes.dark },
  light: { name: "light" as const, ...palettes.light },
};

export type Theme = (typeof themes)[keyof typeof themes];

// Follows the Appearance setting, which overrides the system scheme
// through Appearance.setColorScheme (see store/appearanceStore.ts).
export function useTheme(): Theme {
  return useColorScheme() === "dark" ? themes.dark : themes.light;
}

// Builds a stylesheet for both themes once, then picks the active one.
export function createStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T
) {
  const sheets = {
    dark: StyleSheet.create(factory(themes.dark)),
    light: StyleSheet.create(factory(themes.light)),
  };

  return () => sheets[useTheme().name];
}
