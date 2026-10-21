import { useEffect, useState } from "react";
import {
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import Card from "../../components/Card";
import Glass from "../../components/Glass";
import { useTabBarClearance } from "../../components/GlassTabBar";
import { InfoPill } from "../../components/Pill";
import Screen from "../../components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateView";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { createStyles, font, radius, space, type, useTheme } from "../../theme";

type TimetableSlot = {
  period: number;
  time: string;
  subjects: string[];
};

type TimetableDay = {
  day: string;
  slots: TimetableSlot[];
};

export default function TimetableScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const clearance = useTabBarClearance();
  const authToken = useAuthStore((state) => state.authToken);
  const [session, setSession] = useState("");
  const [days, setDays] = useState<TimetableDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchTimetable = async () => {
    if (!authToken) { setLoading(false); return; }
    try {
      setError(false);
      const response = await api.get("/timetable");
      setSession(response.data.timetable?.session || "");
      setDays(response.data.timetable?.days || []);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchTimetable(); }, [authToken]);

  const onRefresh = () => { setRefreshing(true); fetchTimetable(); };

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading timetable…" />
      </Screen>
    );
  }

  if (error && days.length === 0) {
    return (
      <Screen>
        <ErrorState
          message="Couldn't load your timetable."
          onRetry={() => { setLoading(true); fetchTimetable(); }}
        />
      </Screen>
    );
  }

  const sections = days
    .filter((d) => d.slots.length > 0)
    .map((d) => ({ title: d.day, data: d.slots }));

  return (
    <Screen>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.period}-${index}`}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: clearance }]}

        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Timetable</Text>
            {session ? (
              <InfoPill>Academic Session {session}</InfoPill>
            ) : (
              <Text style={styles.pageSubtitle}>Current semester schedule</Text>
            )}
          </View>
        }

        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Glass style={styles.sectionHeaderGlass}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </Glass>
          </View>
        )}

        renderItem={({ item }) => (
          <Card style={styles.slotCard}>
            {/* LEFT — period indicator */}
            <View style={styles.slotLeft}>
              <Text style={styles.periodNum}>{item.period}</Text>
              <Text style={styles.periodLabel}>Period</Text>
            </View>

            {/* RIGHT — time + subjects */}
            <View style={styles.slotRight}>
              {item.time ? (
                <Text style={styles.slotTime}>
                  {/* SMS gives "09:50 AM -10:40 AM". */}
                  {item.time.replace(/\s*-\s*/, " – ")}
                </Text>
              ) : null}
              {item.subjects.map((subject, i) => (
                <Text key={i} style={styles.subjectText}>
                  {subject}
                </Text>
              ))}
            </View>
          </Card>
        )}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accentInk}
            colors={[colors.accentInk]}
            progressBackgroundColor={colors.surfaceSolid}
          />
        }

        ListEmptyComponent={<EmptyState label="No timetable to show yet." />}
      />
    </Screen>
  );
}

const useStyles = createStyles(({ colors }) => ({
  listContent: {
    paddingHorizontal: space.gutter,
    paddingTop: space.gutter,
  },

  // HEADER
  header: {
    gap: 8,
    marginBottom: 12,
  },
  pageTitle: {
    ...type.largeTitle,
    color: colors.text,
  },
  pageSubtitle: {
    ...type.footnote,
    color: colors.textMuted,
  },

  // SECTION HEADER
  sectionHeader: {
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  sectionHeaderGlass: {
    borderRadius: radius.capsule,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    ...type.headline,
    color: colors.text,
  },

  // SLOT CARD
  slotCard: {
    marginBottom: space.cardGap,
    flexDirection: "row",
    overflow: "hidden",
  },
  slotLeft: {
    width: 72,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.listCard,
    gap: 2,
  },
  periodNum: {
    ...type.headline,
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
  periodLabel: {
    ...type.overline,
    color: colors.textMuted,
  },
  slotRight: {
    flex: 1,
    padding: space.listCard,
    gap: 4,
  },
  slotTime: {
    ...type.footnote,
    ...font.mono,
    color: colors.textMuted,
  },
  subjectText: {
    ...type.bodyStrong,
    color: colors.text,
  },
}));
