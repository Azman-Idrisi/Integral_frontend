import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

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
  const authToken = useAuthStore((state) => state.authToken);
  const [session, setSession] = useState("");
  const [days, setDays] = useState<TimetableDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTimetable = async () => {
    if (!authToken) { setLoading(false); return; }
    try {
      const response = await api.get("/timetable");
      setSession(response.data.timetable?.session || "");
      setDays(response.data.timetable?.days || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchTimetable(); }, [authToken]);

  const onRefresh = () => { setRefreshing(true); fetchTimetable(); };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.centerWrap}>
        <ActivityIndicator size="large" color="#1ed760" />
        <Text style={styles.loadingText}>LOADING TIMETABLE</Text>
      </SafeAreaView>
    );
  }

  const sections = days
    .filter((d) => d.slots.length > 0)
    .map((d) => ({ title: d.day, data: d.slots }));

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.orbTopRight} />

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.period}-${index}`}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}

        ListHeaderComponent={
          <View>
            <Text style={styles.pageTitle}>TIMETABLE</Text>
            {session ? (
              <View style={styles.sessionPill}>
                <Text style={styles.sessionText}>{session}</Text>
              </View>
            ) : (
              <Text style={styles.pageSubtitle}>Current semester schedule</Text>
            )}
          </View>
        }

        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title.toUpperCase()}</Text>
            <View style={styles.sectionHeaderLine} />
          </View>
        )}

        renderItem={({ item }) => (
          <View style={styles.slotCard}>
            {/* LEFT — period indicator */}
            <View style={styles.slotLeft}>
              <Text style={styles.periodNum}>{item.period}</Text>
              <Text style={styles.periodLabel}>PER</Text>
            </View>

            {/* DIVIDER */}
            <View style={styles.slotDivider} />

            {/* RIGHT — time + subjects */}
            <View style={styles.slotRight}>
              {item.time ? (
                <Text style={styles.slotTime}>{item.time}</Text>
              ) : null}
              {item.subjects.map((subject, i) => (
                <Text key={i} style={styles.subjectText}>
                  {subject}
                </Text>
              ))}
            </View>
          </View>
        )}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1ed760"
            colors={["#1ed760"]}
          />
        }

        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>NO TIMETABLE DATA</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#121212",
  },
  centerWrap: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#b3b3b3",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },

  orbTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#1ed760",
    opacity: 0.05,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  // HEADER
  pageTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  pageSubtitle: {
    color: "#b3b3b3",
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 20,
  },
  sessionPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#1ed760",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 20,
    backgroundColor: "rgba(30,215,96,0.06)",
  },
  sessionText: {
    color: "#1ed760",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  // SECTION HEADER
  sectionHeader: {
    backgroundColor: "#121212",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionHeaderText: {
    color: "#b3b3b3",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 2,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1f1f1f",
  },

  // SLOT CARD
  slotCard: {
    backgroundColor: "#181818",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  slotLeft: {
    width: 52,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 2,
  },
  periodNum: {
    color: "#1ed760",
    fontSize: 18,
    fontWeight: "700",
  },
  periodLabel: {
    color: "#b3b3b3",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  slotDivider: {
    width: 1,
    backgroundColor: "#4d4d4d",
  },
  slotRight: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  slotTime: {
    color: "#b3b3b3",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  subjectText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },

  // EMPTY
  emptyWrap: {
    alignItems: "center",
    marginTop: 48,
  },
  emptyText: {
    color: "#4d4d4d",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
});