import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import Card from "../../components/Card";
import { useTabBarClearance } from "../../components/GlassTabBar";
import { InfoPill } from "../../components/Pill";
import Screen from "../../components/Screen";
import { ErrorState, LoadingState } from "../../components/StateView";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { createStyles, font, radius, space, type, useTheme } from "../../theme";
import type { SeatPlan } from "../../types/seatplan";

export default function SeatingScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const clearance = useTabBarClearance();
  const authToken = useAuthStore((state) => state.authToken);
  const [seatPlan, setSeatPlan] = useState<SeatPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchSeatPlan = async () => {
    if (!authToken) { setLoading(false); return; }
    try {
      setError(false);
      const response = await api.get("/seatplan");
      setSeatPlan(response.data.seatPlan ?? null);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchSeatPlan(); }, [authToken]);

  const onRefresh = () => { setRefreshing(true); fetchSeatPlan(); };

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading seating plan…" />
      </Screen>
    );
  }

  if (error && !seatPlan) {
    return (
      <Screen>
        <ErrorState
          message="Couldn't load your seating plan."
          onRetry={() => { setLoading(true); fetchSeatPlan(); }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: clearance }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accentInk}
            colors={[colors.accentInk]}
            progressBackgroundColor={colors.surfaceSolid}
          />
        }
      >
        {/* PAGE TITLE */}
        <Text style={styles.pageTitle}>Seating plan</Text>
        <Text style={styles.pageSubtitle}>Your seat for the next exam</Text>

        {seatPlan ? (
          <>
            {/* EXAM CARD */}
            <Card style={styles.card}>
              <Text style={styles.sectionLabel}>Exam</Text>
              <Text style={styles.courseName}>
                {seatPlan.courseName || "Course"}
              </Text>
              {seatPlan.courseCode ? (
                <InfoPill mono>{seatPlan.courseCode}</InfoPill>
              ) : null}

              <View style={styles.when}>
                <WhenRow icon="calendar-outline" value={seatPlan.examDate} />
                <WhenRow icon="time-outline" value={seatPlan.timing} />
              </View>
            </Card>

            {/* SEAT CARD */}
            <Card style={styles.card}>
              <Text style={styles.sectionLabel}>Where to sit</Text>
              <View style={styles.grid}>
                <Spot label="Block" value={seatPlan.block} />
                <Spot label="Floor" value={seatPlan.floor} />
                <Spot label="Room" value={seatPlan.room} />
              </View>
              <View style={styles.colourRow}>
                <Text style={styles.colourLabel}>Seat colour</Text>
                <Text style={styles.colourValue}>
                  {seatPlan.seatColour || "N/A"}
                </Text>
              </View>
            </Card>
          </>
        ) : (
          <Card style={[styles.card, styles.emptyCard]}>
            <Ionicons name="grid-outline" size={32} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No seating plan available yet.</Text>
            <Text style={styles.emptyHint}>
              The university hasn't published a seating plan for you. Pull down
              to check again.
            </Text>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

function WhenRow({
  icon,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
}) {
  const styles = useStyles();

  return (
    <View style={styles.whenRow}>
      <Ionicons name={icon} size={18} style={styles.whenIcon} />
      <Text style={styles.whenValue}>{value || "N/A"}</Text>
    </View>
  );
}

function Spot({ label, value }: { label: string; value: string }) {
  const styles = useStyles();

  return (
    <View style={styles.spot}>
      <Text style={styles.spotLabel}>{label}</Text>
      <Text
        style={styles.spotValue}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value || "N/A"}
      </Text>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  scroll: {
    paddingHorizontal: space.gutter,
    paddingTop: space.gutter,
  },

  // PAGE HEADER
  pageTitle: {
    ...type.largeTitle,
    color: colors.text,
  },
  pageSubtitle: {
    ...type.footnote,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 20,
  },

  card: {
    padding: space.card,
    marginBottom: space.cardGap,
  },
  sectionLabel: {
    ...type.overline,
    color: colors.textMuted,
    marginBottom: 8,
  },

  // EXAM CARD
  courseName: {
    ...type.headline,
    color: colors.text,
    marginBottom: 8,
  },
  when: {
    marginTop: 16,
    gap: 10,
  },
  whenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  whenIcon: {
    color: colors.textMuted,
  },
  whenValue: {
    ...type.callout,
    ...font.semibold,
    color: colors.text,
    flex: 1,
  },

  // SEAT CARD
  grid: {
    flexDirection: "row",
    gap: 8,
  },
  spot: {
    flex: 1,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.nested,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  spotLabel: {
    ...type.overline,
    color: colors.textMuted,
  },
  spotValue: {
    ...type.title,
    color: colors.text,
    textAlign: "center",
  },
  colourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  colourLabel: {
    ...type.callout,
    color: colors.textMuted,
  },
  colourValue: {
    ...type.callout,
    ...font.semibold,
    color: colors.text,
    flexShrink: 1,
    textAlign: "right",
  },

  // EMPTY
  emptyCard: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 32,
  },
  emptyIcon: {
    color: colors.textMuted,
  },
  emptyTitle: {
    ...type.headline,
    color: colors.text,
    textAlign: "center",
  },
  emptyHint: {
    ...type.footnote,
    color: colors.textSubtle,
    textAlign: "center",
  },
}));
