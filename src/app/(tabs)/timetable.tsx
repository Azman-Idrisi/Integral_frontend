import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useEffect,
  useState,
} from "react";

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
  const authToken = useAuthStore(
    (state) => state.authToken
  );

  const [session, setSession] =
    useState("");

  const [days, setDays] = useState<
    TimetableDay[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const fetchTimetable =
    async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await api.get("/timetable");

        setSession(
          response.data.timetable
            ?.session || ""
        );

        setDays(
          response.data.timetable
            ?.days || []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  useEffect(() => {
    fetchTimetable();
  }, [authToken]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTimetable();
  };

  if (loading) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const sections = days
    .filter((day) => day.slots.length > 0)
    .map((day) => ({
      title: day.day,
      data: day.slots,
    }));

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
    >
      <SectionList
        sections={sections}
        keyExtractor={(item, index) =>
          `${item.period}-${index}`
        }
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 8,
        }}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Time Table
            </Text>

            {session ? (
              <Text
                style={{
                  marginTop: 6,
                  color: "#2563eb",
                  fontWeight: "600",
                }}
              >
                {session}
              </Text>
            ) : null}
          </View>
        }
        renderSectionHeader={({
          section: { title },
        }) => (
          <View
            style={{
              backgroundColor: "#f5f5f5",
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 16,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "#2563eb",
                marginBottom: 4,
              }}
            >
              Period {item.period}
              {item.time
                ? ` · ${item.time}`
                : ""}
            </Text>

            {item.subjects.map(
              (subject) => (
                <Text
                  key={subject}
                  style={{
                    marginTop: 6,
                    color: "#111827",
                    lineHeight: 20,
                  }}
                >
                  {subject}
                </Text>
              )
            )}
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginTop: 24,
            }}
          >
            No timetable data found
          </Text>
        }
      />
    </SafeAreaView>
  );
}
