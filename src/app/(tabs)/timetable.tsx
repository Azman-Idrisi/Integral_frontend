import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { useTabBarClearance } from "../../components/GlassTabBar";
import Screen from "../../components/Screen";
import { ErrorState, LoadingState } from "../../components/StateView";
import TimetableList from "../../components/TimetableList";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useTimetableStore } from "../../store/timetableStore";
import { useTheme } from "../../theme";
import type { TimetableDay } from "../../types/timetable";

export default function TimetableScreen() {
  const { colors } = useTheme();
  const clearance = useTabBarClearance();
  const authToken = useAuthStore((state) => state.authToken);
  const userId = useAuthStore((state) => state.userId);
  const saveTimetable = useTimetableStore((state) => state.save);
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
      const nextSession = response.data.timetable?.session || "";
      const nextDays = response.data.timetable?.days || [];
      setSession(nextSession);
      setDays(nextDays);
      // Keep the saved copy for the login screen current.
      saveTimetable({ userId, session: nextSession, days: nextDays, savedAt: Date.now() });
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

  return (
    <Screen>
      <TimetableList
        days={days}
        session={session}
        paddingBottom={clearance}
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
