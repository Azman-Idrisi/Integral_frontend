import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createStyles, font, minTouch, radius, type, useTheme } from "../theme";
import Glass from "./Glass";

// "icon" is a round glass button with no visible label; `title` becomes
// its accessibility label.
type Variant = "primary" | "secondary" | "icon";

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  icon,
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: ComponentProps<typeof Ionicons>["name"];
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const iconOnly = variant === "icon";
  // Every button is glass; only the primary one is tinted.
  const tint = variant === "primary" ? colors.accentGlass : undefined;
  const labelStyle = styles[`${variant}Label`];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        iconOnly ? styles.round : styles.full,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      <Glass control tint={tint} style={styles.glass} />
      {loading ? (
        <ActivityIndicator color={labelStyle.color} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} style={labelStyle} />}
          {!iconOnly && <Text style={[styles.label, labelStyle]}>{title}</Text>}
        </>
      )}
    </Pressable>
  );
}

const useStyles = createStyles(({ colors }) => ({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radius.capsule,
  },
  full: {
    minHeight: 52,
    paddingHorizontal: 24,
  },
  round: {
    width: minTouch,
    height: minTouch,
  },
  // Glass swells slightly under the finger instead of dimming.
  pressed: {
    transform: [{ scale: 1.04 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...type.callout,
    ...font.semibold,
  },
  primaryLabel: { color: colors.onAccentGlass },
  secondaryLabel: { color: colors.text },
  iconLabel: { color: colors.text },
  glass: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.capsule,
  },
}));
