import { Text, type StyleProp, type TextStyle } from "react-native";
import { createStyles, type } from "../theme";

// Required on Login and Profile (ADR 0002).
export default function IndependenceLine({
  style,
}: {
  style?: StyleProp<TextStyle>;
}) {
  const styles = useStyles();

  return (
    <Text style={[styles.line, style]}>
      Independent app · Not affiliated with Integral University
    </Text>
  );
}

const useStyles = createStyles(({ colors }) => ({
  line: {
    ...type.footnote,
    color: colors.textMuted,
    textAlign: "center",
  },
}));
