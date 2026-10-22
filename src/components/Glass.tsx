import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme";

type BlurTarget = RefObject<View | null>;

// The focused screen's BlurTargetView, which Android blurs behind glass
// drawn outside it (the tab bar).
const BlurTargetContext = createContext<{
  target: BlurTarget | null;
  setTarget: (target: BlurTarget) => void;
} | null>(null);

// True for glass drawn inside a screen. Android can't blur the screen target
// from within it (and a nested backdrop target rendered washed-out gray on a
// device), so that glass uses the plain fill.
export const InsideScreen = createContext(false);

export function BlurTargetProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<BlurTarget | null>(null);

  return (
    <BlurTargetContext value={{ target, setTarget }}>
      {children}
    </BlurTargetContext>
  );
}

export function useSetBlurTarget() {
  return useContext(BlurTargetContext)?.setTarget;
}

export function useReduceTransparency() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled().then(setEnabled);
    const sub = AccessibilityInfo.addEventListener(
      "reduceTransparencyChanged",
      setEnabled
    );
    return () => sub.remove();
  }, []);

  return enabled;
}

const canBlur = Platform.OS === "android" && Number(Platform.Version) >= 31;
const hasLiquidGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

// Floating-layer material (DESIGN.md › Materials). Children render above it.
export default function Glass({
  style,
  control,
  tint,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  // A control inside content (button, segmented track): no shadow. Without a
  // tint it has no fill at all, only a ring and edge highlight.
  control?: boolean;
  // Colored glass (accentGlass).
  tint?: string;
  children?: ReactNode;
}) {
  const theme = useTheme();
  const { colors } = theme;
  const insideScreen = useContext(InsideScreen);
  const focusedScreen = useContext(BlurTargetContext)?.target;
  const reduceTransparency = useReduceTransparency();
  const borderRadius = StyleSheet.flatten(style)?.borderRadius;
  const layer = [StyleSheet.absoluteFill, { borderRadius }];
  const bare = control && !tint;

  let material: ReactNode = null;

  if (bare) {
    // Transparent: the label sits straight on the background.
  } else if (reduceTransparency && tint) {
    // Opaque version of the same color: the tint over a solid bg.
    material = (
      <View style={[layer, styles.clip, { backgroundColor: colors.bg }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} />
      </View>
    );
  } else if (reduceTransparency) {
    material = <View style={[layer, { backgroundColor: colors.surfaceSolid }]} />;
  } else if (hasLiquidGlass) {
    material = (
      <GlassView
        glassEffectStyle="regular"
        colorScheme={theme.name}
        isInteractive={control}
        tintColor={tint}
        style={layer}
      />
    );
  } else if (canBlur && focusedScreen && !insideScreen) {
    const fill = tint ?? colors.glassFillBlur;
    material = (
      <BlurView
        blurTarget={focusedScreen}
        blurMethod="dimezisBlurViewSdk31Plus"
        tint={theme.name}
        intensity={40}
        style={[layer, styles.clip]}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />
      </BlurView>
    );
  } else {
    material = (
      <View style={[layer, { backgroundColor: tint ?? colors.glassFill }]} />
    );
  }

  return (
    <View style={[!control && theme.elevation.floating, style]}>
      {material}
      {(bare || !hasLiquidGlass) && (
        <GlassEdge borderRadius={borderRadius} tinted={!!tint} control={bare} />
      )}
      {children}
    </View>
  );
}

// The light on a glass shape: hairline stroke, top sheen and specular rim.
// `ring` adds a full inner ring, for thumbs that mark the selected option.
// `tinted` uses the subtler light that colored glass needs in both themes.
// `control` is the bare edge of a fill-less control: ring and highlight only.
export function GlassEdge({
  borderRadius,
  ring,
  tinted,
  control,
}: {
  borderRadius?: ViewStyle["borderRadius"];
  ring?: boolean;
  tinted?: boolean;
  control?: boolean;
}) {
  const { colors } = useTheme();
  const sheen = tinted ? colors.glassTintSheen : colors.glassSheen;
  const rim = tinted ? colors.glassTintRim : colors.glassRim;

  if (control) {
    return (
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, boxShadow: colors.glassControlEdge },
        ]}
      />
    );
  }

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.stroke,
        {
          borderRadius,
          borderColor: colors.glassStroke,
          experimental_backgroundImage: sheen,
          boxShadow: ring ? `${colors.glassRing}, ${rim}` : rim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
  },
  stroke: {
    borderWidth: 1,
  },
});
