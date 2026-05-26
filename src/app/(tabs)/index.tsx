import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AttendanceCard from "../../components/AttendanceCard";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

export default function AttendanceScreen() {
  const authToken = useAuthStore((state) => state.authToken);
  const [attendance, setAttendance] = useState([]);
  const [overall, setOverall] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendance = async () => {
    if (!authToken) { setLoading(false); return; }
    try {
      const response = await api.get("/attendance");
      setAttendance(response.data.attendance);
      setOverall(response.data.cumulativeAttendance);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, [authToken]);

  const onRefresh = () => { setRefreshing(true); fetchAttendance(); };

  // parse % for color logic
  const overallNum = parseFloat(overall) || 0;
  const attendanceColor =
    overallNum >= 75 ? "#1ed760" :
      overallNum >= 60 ? "#ffa42b" :
        "#f3727f";

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#1ed760" />
        <Text style={styles.loadingText}>FETCHING ATTENDANCE</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>

      {/* BG orb */}
      <View style={styles.orbTopRight} />

      <FlatList
        data={attendance}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <AttendanceCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* PAGE TITLE */}
            <Text style={styles.pageTitle}>ATTENDANCE</Text>
            <Text style={styles.pageSubtitle}>Current semester overview</Text>

            {/* OVERALL CARD */}
            <View style={styles.overallCard}>
              <View style={styles.overallLeft}>
                <Text style={styles.overallLabel}>CUMULATIVE</Text>
                <Text style={[styles.overallPercent, { color: attendanceColor }]}>
                  {overall}%
                </Text>
                <Text style={styles.overallStatus}>
                  {overallNum >= 75 ? "✓  You're on track" :
                    overallNum >= 60 ? "⚠  Borderline — attend more" :
                      "✕  Critical — take action"}
                </Text>
              </View>

              {/* ring-like indicator */}
              <View style={styles.overallRight}>
                <View style={[styles.ringOuter, { borderColor: attendanceColor + "33" }]}>
                  <View style={[styles.ringInner, { borderColor: attendanceColor }]}>
                    <Text style={[styles.ringText, { color: attendanceColor }]}>
                      {overallNum >= 75 ? "GOOD" : overallNum >= 60 ? "LOW" : "BAD"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* SUBJECTS HEADER */}
            <Text style={styles.sectionLabel}>SUBJECTS</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1ed760"
            colors={["#1ed760"]}
          />
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
  loadingWrap: {
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

  // PAGE HEADER
  pageTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  pageSubtitle: {
    color: "#b3b3b3",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 2,
    marginBottom: 20,
  },

  // OVERALL CARD
  overallCard: {
    backgroundColor: "#181818",
    borderRadius: 8,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  overallLeft: {
    flex: 1,
  },
  overallLabel: {
    color: "#b3b3b3",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 6,
  },
  overallPercent: {
    fontSize: 52,
    fontWeight: "700",
    lineHeight: 56,
  },
  overallStatus: {
    color: "#b3b3b3",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 8,
  },

  // RING
  overallRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  // SECTION
  sectionLabel: {
    color: "#b3b3b3",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },
});