// Inter stands in for SF Pro off Apple platforms (see theme/metrics.ts).
// Per-weight imports: the package root would bundle all 18 font files.
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
// Hydrates and applies the saved Appearance setting.
import "../store/appearanceStore";
import { useTheme } from "../theme";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { colors } = useTheme();
  // iOS uses SF Pro, the system font, so it has nothing to load.
  const [fontsLoaded, fontError] = useFonts(
    Platform.OS === "ios"
      ? {}
      : { Inter_400Regular, Inter_600SemiBold, Inter_700Bold }
  );
  // If the fonts fail to load, carry on with the system font.
  const ready = fontsLoaded || fontError;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </>
  );
}
