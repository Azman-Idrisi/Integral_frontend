import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { createStyles, radius, useTheme } from "../theme";
import { useReduceTransparency } from "./Glass";

// A content card: translucent so the background shows through, with a
// hairline edge but none of the glass rim or sheen. Opaque when Reduce
// Transparency is on.
export default function Card({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const opaque = useReduceTransparency();

  return (
    <View
      style={[
        styles.card,
        elevation.card,
        { backgroundColor: opaque ? colors.surfaceSolid : colors.surface },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.glassStroke,
  },
}));
