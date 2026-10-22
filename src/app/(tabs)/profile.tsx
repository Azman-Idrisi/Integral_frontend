import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";
import Card from "../../components/Card";
import CustomButton from "../../components/CustomButton";
import { useTabBarClearance } from "../../components/GlassTabBar";
import IndependenceLine from "../../components/IndependenceLine";
import { InfoPill } from "../../components/Pill";
import Screen from "../../components/Screen";
import SegmentedControl, {
  type SegmentOption,
} from "../../components/SegmentedControl";
import { ErrorState, LoadingState } from "../../components/StateView";
import { api } from "../../services/api";
import {
  useAppearanceStore,
  type AppearanceSetting,
} from "../../store/appearanceStore";
import { useAuthStore } from "../../store/authStore";
import { createStyles, font, radius, space, type } from "../../theme";

const APPEARANCE_OPTIONS: SegmentOption<AppearanceSetting>[] = [
  { value: "system", label: "System", icon: "phone-portrait-outline" },
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
];

export default function ProfileScreen() {
  const styles = useStyles();
  const clearance = useTabBarClearance();
  const authToken = useAuthStore((state) => state.authToken);
  const logout = useAuthStore((state) => state.logout);
  const appearance = useAppearanceStore((state) => state.appearance);
  const setAppearance = useAppearanceStore((state) => state.setAppearance);
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
      setError("Couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [authToken]);

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Loading profile…" />
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen>
        <ErrorState
          message={error || "Couldn't load your profile."}
          onRetry={() => { setLoading(true); fetchProfile(); }}
        >
          <CustomButton
            title="Log out"
            variant="secondary"
            icon="log-out-outline"
            onPress={handleLogout}
          />
        </ErrorState>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: clearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* PAGE TITLE */}
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.pageSubtitle}>Student information</Text>

        {/* HERO CARD */}
        <Card style={styles.heroCard}>
          {/* Photo */}
          {profile.image ? (
            <Image
              source={{ uri: profile.image }}
              style={styles.photo}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]}>
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
            <InfoPill mono>{profile.txtEnrollNo}</InfoPill>
            {profile.lblABC_ID ? (
              <Text style={styles.abcText}>ABC ID · {profile.lblABC_ID}</Text>
            ) : null}
          </View>
        </Card>

        {/* DETAILS CARD */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionLabel}>Personal details</Text>

          <ProfileItem label="Date of birth" value={profile.txtDOB} />
          <ProfileItem label="Branch" value={profile.txtBranch} />
          <ProfileItem label="Semester" value={profile.txtSemester} last />
        </Card>

        {/* APPEARANCE */}
        <View style={styles.appearance}>
          <Text style={styles.sectionLabel}>Appearance</Text>
          <SegmentedControl
            label="Appearance"
            options={APPEARANCE_OPTIONS}
            value={appearance}
            onChange={setAppearance}
          />
        </View>

        <CustomButton
          title="Log out"
          variant="secondary"
          icon="log-out-outline"
          onPress={handleLogout}
        />

        <IndependenceLine style={styles.independence} />
      </ScrollView>
    </Screen>
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
  const styles = useStyles();

  return (
    <View style={[styles.item, !last && styles.itemBorder]}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value || "N/A"}</Text>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  scroll: {
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

  // HERO CARD
  heroCard: {
    padding: space.card,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: space.cardGap,
  },
  photo: {
    width: 80,
    height: 100,
    borderRadius: radius.photo,
    backgroundColor: colors.surfaceRaised,
  },
  photoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: {
    ...type.largeTitle,
    color: colors.text,
  },
  heroInfo: {
    flex: 1,
    gap: 8,
  },
  studentName: {
    ...type.headline,
    color: colors.text,
  },
  abcText: {
    ...type.footnote,
    ...font.mono,
    color: colors.textMuted,
  },

  // DETAILS CARD
  detailsCard: {
    padding: space.card,
    paddingBottom: 6,
    marginBottom: space.sectionGap,
  },
  sectionLabel: {
    ...type.overline,
    color: colors.textMuted,
    marginBottom: 8,
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
    borderBottomColor: colors.border,
  },
  itemLabel: {
    ...type.callout,
    color: colors.textMuted,
    flex: 1,
  },
  itemValue: {
    ...type.callout,
    ...font.semibold,
    color: colors.text,
    flex: 2,
    textAlign: "right",
  },

  // APPEARANCE
  appearance: {
    marginBottom: space.sectionGap,
  },

  independence: {
    marginTop: space.sectionGap,
  },
}));
