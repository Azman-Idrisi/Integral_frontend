import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { BlurTargetProvider } from "../../components/Glass";
import GlassTabBar from "../../components/GlassTabBar";
import { useTheme } from "../../theme";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <BlurTargetProvider>
      <Tabs
        tabBar={(props) => <GlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.bg },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Attendance",
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="timetable"
          options={{
            title: "Timetable",
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="seating"
          options={{
            title: "Seating plan",
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </BlurTargetProvider>
  );
}
