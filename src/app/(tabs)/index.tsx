import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import AttendanceCard from "../../components/AttendanceCard";
import Card from "../../components/Card";
import { useTabBarClearance } from "../../components/GlassTabBar";
import Screen from "../../components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateView";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { createStyles, radius, space, type, useTheme } from "../../theme";
import type { AttendanceItem } from "../../types/attendance";
import { getStanding, standingToken } from "../../utils/standing";

const STANDING_ICON = {
  Safe: "checkmark",
  Borderline: "alert",
  Short: "close",
} as const;

export default function AttendanceScreen() {
  const styles = useStyles();
  const { name, colors } = useTheme();
  const clearance = useTabBarClearance();
  const authToken = useAuthStore((state) => state.authToken);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [overall, setOverall] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchAttendance = async () => {
    if (!authToken) { setLoading(false); return; }
    try {
      setError(false);
      const response = await api.get("/attendance");
      setAttendance(response.data.attendance);
      setOverall(response.data.cumulativeAttendance);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, [authToken]);

  const onRefresh = () => { setRefreshing(true); fetchAttendance(); };

  const overallNum = parseFloat(overall) || 0;
  const standing = getStanding(overallNum);
  const attendanceColor = colors[standingToken[standing]];
  // Like the subject cards: the Standing color is text in dark only. In light
  // the blues are too pale for text or icons on white, so the percentage and
  // icon use `text` and only the ring carries the color.
  const colorAsText = name === "dark";
  const valueColor = colorAsText ? attendanceColor : colors.text;

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading attendance…" />
      </Screen>
    );
  }

  if (error && attendance.length === 0) {
    return (
      <Screen>
        <ErrorState
          message="Couldn't load your attendance."
          onRetry={() => { setLoading(true); fetchAttendance(); }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={attendance}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <AttendanceCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: clearance }]}
        ListHeaderComponent={
          <View>
            {/* PAGE TITLE */}
            <Text style={styles.pageTitle}>Attendance</Text>
            <Text style={styles.pageSubtitle}>Current semester overview</Text>

            {/* OVERALL CARD */}
            <Card style={styles.overallCard}>
              <View style={styles.overallLeft}>
                <Text style={styles.overallLabel}>Cumulative</Text>
                <Text
                  style={[styles.overallPercent, { color: valueColor }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.6}
                >
                  {overall}%
                </Text>
                <Text style={styles.overallStatus}>{standing}</Text>
              </View>

              {/* ring indicator */}
              <View style={[styles.ring, { borderColor: attendanceColor }]}>
                <Ionicons
                  name={STANDING_ICON[standing]}
                  size={32}
                  color={valueColor}
                />
              </View>
            </Card>

            {/* SUBJECTS HEADER */}
            <Text style={styles.sectionLabel}>Subjects</Text>
          </View>
        }
        ListEmptyComponent={<EmptyState label="No subjects to show yet." />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accentInk}
            colors={[colors.accentInk]}
            progressBackgroundColor={colors.surfaceSolid}
          />
        }
      />
    </Screen>
  );
}

const useStyles = createStyles(({ colors }) => ({
  listContent: {
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

  // OVERALL CARD
  overallCard: {
    padding: space.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: space.sectionGap,
  },
  overallLeft: {
    flex: 1,
  },
  overallLabel: {
    ...type.overline,
    color: colors.textMuted,
    marginBottom: 6,
  },
  overallPercent: {
    ...type.display,
    fontVariant: ["tabular-nums"],
  },
  overallStatus: {
    ...type.headline,
    color: colors.text,
    marginTop: 4,
  },

  // RING
  ring: {
    width: 76,
    height: 76,
    borderRadius: radius.capsule,
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  // SECTION
  sectionLabel: {
    ...type.overline,
    color: colors.textMuted,
    marginBottom: 12,
  },
}));
