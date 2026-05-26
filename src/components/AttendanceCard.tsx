import { StyleSheet, Text, View } from "react-native";

export default function AttendanceCard({ item }: any) {
  const pct = parseFloat(item.percentage) || 0;

  const accentColor =
    pct >= 75 ? "#1ed760" :
      pct >= 60 ? "#ffa42b" :
        "#f3727f";

  const barWidth = `${Math.min(pct, 100)}%`;

  return (
    <View style={styles.card}>

      {/* TOP ROW */}
      <View style={styles.topRow}>
        <Text style={styles.course} numberOfLines={2}>
          {item.course}
        </Text>
        <Text style={[styles.percentage, { color: accentColor }]}>
          {item.percentage}%
        </Text>
      </View>

      {/* PROGRESS BAR */}
      <View
        style={[
          styles.barFill,
          {
            width: barWidth as `${number}%`,
            backgroundColor: accentColor,
          },
        ]}
      />

      {/* BOTTOM ROW */}
      <View style={styles.bottomRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>HELD</Text>
          <Text style={styles.statValue}>{item.held}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>PRESENT</Text>
          <Text style={styles.statValue}>{item.present}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>ABSENT</Text>
          <Text style={styles.statValue}>{item.held - item.present}</Text>
        </View>
        <View style={styles.divider} />
        {/* STATUS PILL */}
        <View style={[styles.statusPill, { borderColor: accentColor }]}>
          <Text style={[styles.statusText, { color: accentColor }]}>
            {item.status?.toUpperCase() || (pct >= 75 ? "SAFE" : pct >= 60 ? "LOW" : "SHORT")}
          </Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#181818",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  course: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  percentage: {
    fontSize: 22,
    fontWeight: "700",
  },

  // PROGRESS BAR
  barTrack: {
    height: 3,
    backgroundColor: "#1f1f1f",
    borderRadius: 9999,
    marginBottom: 14,
    overflow: "hidden",
  },
  barFill: {
    height: 3,
    borderRadius: 9999,
  },

  // STATS
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stat: {
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    color: "#b3b3b3",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#4d4d4d",
  },

  // STATUS PILL
  statusPill: {
    marginLeft: "auto",
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
});