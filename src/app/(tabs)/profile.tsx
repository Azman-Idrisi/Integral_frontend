import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

export default function ProfileScreen() {
  const authToken = useAuthStore((state) => state.authToken);
  const logout = useAuthStore((state) => state.logout);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try { await api.post("/auth/logout"); } catch { }
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const fetchProfile = async () => {
    if (!authToken) { setLoading(false); return; }
    try {
      setError("");
      const response = await api.get("/profile");
      setProfile(response.data.profile);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [authToken]);

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.centerWrap}>
        <ActivityIndicator size="large" color="#1ed760" />
        <Text style={styles.loadingText}>LOADING PROFILE</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView edges={["top"]} style={styles.centerWrap}>
        <Text style={styles.errorText}>{error || "Failed to load profile"}</Text>
        <LogoutButton onPress={handleLogout} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.orbTopRight} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* PAGE TITLE */}
        <Text style={styles.pageTitle}>PROFILE</Text>
        <Text style={styles.pageSubtitle}>Student information</Text>

        {/* HERO CARD */}
        <View style={styles.heroCard}>
          {/* Photo */}
          {profile.image ? (
            <Image
              source={{ uri: profile.image }}
              style={styles.photo}
              contentFit="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {profile.txtStudentName?.[0] || "S"}
              </Text>
            </View>
          )}

          {/* Info */}
          <View style={styles.heroInfo}>
            <Text style={styles.studentName} numberOfLines={2}>
              {profile.txtStudentName || "Student"}
            </Text>
            <View style={styles.enrollPill}>
              <Text style={styles.enrollText}>{profile.txtEnrollNo}</Text>
            </View>
            {profile.lblABC_ID ? (
              <Text style={styles.abcText}>ABC · {profile.lblABC_ID}</Text>
            ) : null}
          </View>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionLabel}>PERSONAL DETAILS</Text>

          <ProfileItem label="DATE OF BIRTH" value={profile.txtDOB} />
          <ProfileItem label="BRANCH" value={profile.txtBranch} />
          <ProfileItem label="SEMESTER" value={profile.txtSemester} />
          <ProfileItem label="FATHER'S NAME" value={profile.txtFatherName} />
          <ProfileItem label="MOTHER'S NAME" value={profile.txtMotherName} />
          <ProfileItem label="CATEGORY" value={profile.txtCategory} />
          <ProfileItem label="ANNUAL INCOME" value={profile.txtIncome} last />
        </View>

        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileItem({
  label,
  value,
  last,
}: {
  label: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.item, !last && styles.itemBorder]}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value || "N/A"}</Text>
    </View>
  );
}

function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.logoutBtn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.logoutText}>LOG OUT</Text>
    </TouchableOpacity>
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
  errorText: {
    color: "#f3727f",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 16,
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

  scroll: {
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

  // HERO CARD
  heroCard: {
    backgroundColor: "#181818",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  photo: {
    width: 80,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#1f1f1f",
  },
  photoPlaceholder: {
    width: 80,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4d4d4d",
  },
  photoPlaceholderText: {
    color: "#1ed760",
    fontSize: 32,
    fontWeight: "700",
  },
  heroInfo: {
    flex: 1,
    gap: 8,
  },
  studentName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  enrollPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#4d4d4d",
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  enrollText: {
    color: "#b3b3b3",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  abcText: {
    color: "#b3b3b3",
    fontSize: 11,
    fontWeight: "400",
    letterSpacing: 0.5,
  },

  // DETAILS CARD
  detailsCard: {
    backgroundColor: "#181818",
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  sectionLabel: {
    color: "#b3b3b3",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 16,
  },

  // PROFILE ITEM
  item: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  itemLabel: {
    color: "#b3b3b3",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    flex: 1,
  },
  itemValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    flex: 2,
    textAlign: "right",
  },

  // LOGOUT
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#f3727f",
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: {
    color: "#f3727f",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
});