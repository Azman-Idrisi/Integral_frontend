import {
  Platform,
  TouchableOpacity,
} from "react-native";

import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarHeight =
    52 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          height: tabBarHeight,
          paddingTop: 1,
          paddingBottom: insets.bottom,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarButton: ({
          children,
          onPress,
          onLongPress,
          style,
          accessibilityLabel,
          accessibilityRole,
          accessibilityState,
          testID,
        }) => (
          <TouchableOpacity
            onPress={onPress}
            onLongPress={
              onLongPress ?? undefined
            }
            accessibilityLabel={
              accessibilityLabel
            }
            accessibilityRole={
              accessibilityRole
            }
            accessibilityState={
              accessibilityState
            }
            testID={testID}
            activeOpacity={0.65}
            style={style}
          >
            {children}
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Attendance",
          tabBarIcon: ({
            color,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "calendar"
                  : "calendar-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="timetable"
        options={{
          title: "Timetable",
          tabBarIcon: ({
            color,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "time"
                  : "time-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({
            color,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "person"
                  : "person-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
