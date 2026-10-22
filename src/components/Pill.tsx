import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { createStyles, font, radius, type } from "../theme";
import type { Standing } from "../utils/standing";

// Safe and Borderline are filled; Short is an outline in `text`, so the
// three read apart without a third color.
export function StandingPill({ standing }: { standing: Standing }) {
  const styles = useStyles();

  if (standing === "Short") {
    return (
      <View style={[styles.pill, styles.outline]}>
        <Text style={[styles.label, styles.short]}>{standing}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.pill, styles[standing === "Safe" ? "safe" : "borderline"]]}>
      <Text style={[styles.label, styles.onFill]}>{standing}</Text>
    </View>
  );
}

// `mono` for identifiers such as the Enrollment Number.
export function InfoPill({
  children,
  mono,
}: {
  children: ReactNode;
  mono?: boolean;
}) {
  const styles = useStyles();

  return (
    <View style={[styles.pill, styles.info]}>
      <Text style={[styles.label, styles.muted, mono && styles.mono]}>
        {children}
      </Text>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  pill: {
    alignSelf: "flex-start",
    borderRadius: radius.capsule,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  info: {
    backgroundColor: colors.surfaceRaised,
  },
  safe: {
    backgroundColor: colors.safe,
  },
  borderline: {
    backgroundColor: colors.borderline,
  },
  // 1px less padding keeps the outlined pill the same size as a filled one.
  outline: {
    borderWidth: 1,
    borderColor: colors.short,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  short: {
    color: colors.short,
  },
  label: {
    ...type.caption,
  },
  onFill: {
    color: colors.onFill,
  },
  muted: {
    color: colors.textMuted,
  },
  mono: {
    ...font.mono,
  },
}));
