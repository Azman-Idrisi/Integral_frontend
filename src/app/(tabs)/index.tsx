import {
  View,
  Text,
  FlatList,
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

import AttendanceCard from "../../components/AttendanceCard";

export default function AttendanceScreen() {
  const authToken = useAuthStore(
    (state) => state.authToken
  );

  const [attendance, setAttendance] =
    useState([]);

  const [overall, setOverall] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const fetchAttendance =
    async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await api.get("/attendance");

        setAttendance(
          response.data.attendance
        );

        setOverall(
          response.data
            .cumulativeAttendance
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  useEffect(() => {
    fetchAttendance();
  }, [authToken]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
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

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
    >
      <FlatList
        data={attendance}
        keyExtractor={(_, index) =>
          index.toString()
        }
        renderItem={({ item }) => (
          <AttendanceCard item={item} />
        )}
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
              padding: 25,
              borderRadius: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Overall Attendance
            </Text>

            <Text
              style={{
                fontSize: 42,
                fontWeight: "bold",
                marginTop: 10,
                color: "#2563eb",
              }}
            >
              {overall}%
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
}
