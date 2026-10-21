import { Text, View } from "react-native";
import { createStyles, radius, space, type, useTheme } from "../theme";
import type { AttendanceItem } from "../types/attendance";
import { getStanding, standingToken } from "../utils/standing";
import Card from "./Card";
import { StandingPill } from "./Pill";

export default function AttendanceCard({ item }: { item: AttendanceItem }) {
  const styles = useStyles();
  const { name, colors } = useTheme();
  const pct = parseFloat(item.percentage) || 0;
  const standing = getStanding(pct);
  const accentColor = colors[standingToken[standing]];

  // Dark: status color as text. Light: `text` plus a status dot,
  // because the blues are too light for text on white.
  const colorAsText = name === "dark";

  const barWidth = `${Math.min(pct, 100)}%`;

  return (
    <Card style={styles.card}>

      {/* TOP ROW */}
      <View style={styles.topRow}>
        <Text style={styles.course} numberOfLines={2}>
          {/* SMS pads some course codes with runs of spaces. */}
          {item.course.replace(/\s+/g, " ")}
        </Text>
        <View style={styles.percentageWrap}>
          {!colorAsText && (
            <View style={[styles.dot, { backgroundColor: accentColor }]} />
          )}
          <Text
            style={[styles.percentage, colorAsText && { color: accentColor }]}
          >
            {item.percentage}%
          </Text>
        </View>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: barWidth as `${number}%`,
              backgroundColor: accentColor,
            },
          ]}
        />
      </View>

      {/* BOTTOM ROW */}
      <View style={styles.bottomRow}>
        <Stat label="Held" value={item.held} />
        <View style={styles.divider} />
        <Stat label="Present" value={item.present} />
        <View style={styles.divider} />
        <Stat label="Absent" value={Number(item.held) - Number(item.present)} />
        <View style={styles.pill}>
          <StandingPill standing={standing} />
        </View>
      </View>

    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  const styles = useStyles();

  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  card: {
    padding: space.listCard,
    marginBottom: space.cardGap,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  course: {
    ...type.bodyStrong,
    flex: 1,
    color: colors.text,
  },
  percentageWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.capsule,
  },
  percentage: {
    ...type.title,
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },

  // PROGRESS BAR
  barTrack: {
    height: 6,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.capsule,
    marginBottom: 14,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: radius.capsule,
  },

  // STATS
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stat: {
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    ...type.caption,
    color: colors.textMuted,
  },
  statValue: {
    ...type.bodyStrong,
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  pill: {
    marginLeft: "auto",
  },
}));
