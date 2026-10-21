import { BlurTargetView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, type ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { createStyles, useTheme } from "../theme";
import { InsideScreen, useSetBlurTarget } from "./Glass";

// Off-canvas orb positions, as fractions of the window width.
const ORB_PLACEMENT = [
  { top: -0.45, right: -0.45 },
  { top: 0.55, left: -0.6 },
  { bottom: -0.4, right: -0.4 },
];
const ORB_SIZE = 1.3;

function rgba(hex: string, alpha: number) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${alpha})`;
}

// Screen background with faint glows. It is also the blur target for the
// floating tab bar while focused.
export default function Screen({
  children,
  edges = ["top"],
}: {
  children: ReactNode;
  edges?: Edge[];
}) {
  const styles = useStyles();
  const { orbs } = useTheme();
  const { width } = useWindowDimensions();
  const ref = useRef<View>(null);
  const setBlurTarget = useSetBlurTarget();

  useFocusEffect(
    useCallback(() => {
      setBlurTarget?.(ref);
    }, [setBlurTarget])
  );

  return (
    <BlurTargetView ref={ref} style={styles.root}>
      {orbs.map((orb, i) => {
        const place = Object.fromEntries(
          Object.entries(ORB_PLACEMENT[i]).map(([k, v]) => [k, v * width])
        );
        return (
          <View
            key={i}
            pointerEvents="none"
            style={[
              styles.orb,
              place,
              {
                width: width * ORB_SIZE,
                height: width * ORB_SIZE,
                experimental_backgroundImage: `radial-gradient(circle closest-side, ${rgba(orb.color, orb.opacity)}, ${rgba(orb.color, 0)})`,
              },
            ]}
          />
        );
      })}

      <SafeAreaView edges={edges} style={styles.safe}>
        <InsideScreen value>{children}</InsideScreen>
      </SafeAreaView>
    </BlurTargetView>
  );
}

const useStyles = createStyles(({ colors }) => ({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
  },
  safe: {
    flex: 1,
  },
}));
