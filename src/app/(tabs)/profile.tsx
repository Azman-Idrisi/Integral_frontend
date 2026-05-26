import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";

import { router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "expo-image";

import {
  useEffect,
  useState,
} from "react";

import { api } from "../../services/api";

import { useAuthStore } from "../../store/authStore";

export default function ProfileScreen() {
  const authToken = useAuthStore(
    (state) => state.authToken
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              await api.post(
                "/auth/logout"
              );
            } catch {
              // still clear local auth
            }

            logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  const [profile, setProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchProfile =
    async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        setError("");

        const response =
          await api.get("/profile");

        setProfile(
          response.data.profile
        );
      } catch {
        setError(
          "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfile();
  }, [authToken]);

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

  if (!profile) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>
          {error ||
            "Failed to load profile"}
        </Text>

        <LogoutButton
          onPress={handleLogout}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: "#f3f4f6",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#2563eb",
            padding: 20,
            borderRadius: 20,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          {profile.image ? (
            <Image
              source={{
                uri: profile.image,
              }}
              style={{
                width: 96,
                height: 120,
                borderRadius: 12,
                backgroundColor: "#dbeafe",
                borderWidth: 2,
                borderColor: "#fff",
              }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                width: 96,
                height: 120,
                borderRadius: 12,
                backgroundColor: "#dbeafe",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#2563eb",
                  fontWeight: "bold",
                }}
              >
                No Photo
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: "bold",
              }}
            >
              {profile.txtStudentName ||
                "Student"}
            </Text>

            <Text
              style={{
                color: "#dbeafe",
                marginTop: 8,
                fontSize: 14,
              }}
            >
              {profile.txtEnrollNo}
            </Text>

            {profile.lblABC_ID ? (
              <Text
                style={{
                  color: "#dbeafe",
                  marginTop: 4,
                  fontSize: 14,
                }}
              >
                ABC: {profile.lblABC_ID}
              </Text>
            ) : null}
          </View>
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 18,
          }}
        >
          <SectionTitle title="Personal Details" />

          <ProfileItem
            label="Date of Birth"
            value={profile.txtDOB}
          />

          <ProfileItem
            label="Branch"
            value={profile.txtBranch}
          />

          <ProfileItem
            label="Semester"
            value={profile.txtSemester}
          />

          <ProfileItem
            label="Father Name"
            value={profile.txtFatherName}
          />

          <ProfileItem
            label="Mother Name"
            value={profile.txtMotherName}
          />

          <ProfileItem
            label="Category"
            value={profile.txtCategory}
          />

          <ProfileItem
            label="Annual Income"
            value={profile.txtIncome}
          />
        </View>

        <LogoutButton
          onPress={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text
      style={{
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#111827",
      }}
    >
      {title}
    </Text>
  );
}

function LogoutButton({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#fee2e2",
        padding: 16,
        borderRadius: 14,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#fecaca",
      }}
    >
      <Text
        style={{
          color: "#dc2626",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        Log out
      </Text>
    </TouchableOpacity>
  );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: "#6b7280",
          marginBottom: 6,
          fontSize: 13,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          backgroundColor: "#f9fafb",
          padding: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "#111827",
            fontWeight: "600",
          }}
        >
          {value || "N/A"}
        </Text>
      </View>
    </View>
  );
}
