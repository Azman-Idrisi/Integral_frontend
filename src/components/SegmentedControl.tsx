import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, type ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { createStyles, font, radius, spring, type, useTheme } from "../theme";
import Glass, { GlassEdge } from "./Glass";

const INSET = 4;
// The thumb grows slightly while pressed, like a system slider knob.
const LIFT = 0.06;

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
};

export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const styles = useStyles();
  const { elevation } = useTheme();
  const [width, setWidth] = useState(0);
  const index = options.findIndex((o) => o.value === value);
  const segment = (width - INSET * 2) / options.length;
  const position = useSharedValue(index);
  const lift = useSharedValue(0);

  useEffect(() => {
    position.set(withSpring(index, spring));
  }, [index, position]);

  const thumbStyle = useAnimatedStyle(() => ({
    width: segment,
    transform: [
      { translateX: position.get() * segment },
      { scale: 1 + LIFT * lift.get() },
    ],
  }));

  return (
    <Glass control style={styles.track}>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        style={styles.row}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {width > 0 && (
          <Animated.View style={[styles.thumb, elevation.card, thumbStyle]}>
            <GlassEdge borderRadius={radius.capsule} ring />
          </Animated.View>
        )}
        {options.map((option) => {
          const selected = option.value === value;
          const color = selected ? styles.selected.color : styles.label.color;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(option.value)}
              onPressIn={() => lift.set(withSpring(1, spring))}
              onPressOut={() => lift.set(withSpring(0, spring))}
              style={styles.segment}
            >
              {option.icon && (
                <Ionicons name={option.icon} size={18} color={color} />
              )}
              <Text style={[styles.label, selected && styles.selected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Glass>
  );
}

const useStyles = createStyles(({ colors }) => ({
  track: {
    borderRadius: radius.capsule,
  },
  row: {
    flexDirection: "row",
    minHeight: 52,
    padding: INSET,
  },
  // A lighter glass capsule. The ring keeps it at 3:1 or more against the
  // track in both themes.
  thumb: {
    position: "absolute",
    top: INSET,
    bottom: INSET,
    left: INSET,
    borderRadius: radius.capsule,
    backgroundColor: colors.thumbFill,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    ...type.callout,
    color: colors.textMuted,
  },
  selected: {
    color: colors.text,
    ...font.semibold,
  },
}));
