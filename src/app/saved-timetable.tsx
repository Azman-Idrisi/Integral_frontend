import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Card from "../components/Card";
import CustomButton from "../components/CustomButton";
import Screen from "../components/Screen";
import { EmptyState } from "../components/StateView";
import TimetableList from "../components/TimetableList";
import { formatSavedAt, useTimetableStore } from "../store/timetableStore";
import { createStyles, space, type } from "../theme";

// The timetable from the last Sign-in, viewable without signing in.
export default function SavedTimetableScreen() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const saved = useTimetableStore((state) => state.saved);

  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace("/");

  return (
    <Screen>
      <View style={styles.topBar}>
        <CustomButton
          variant="icon"
          icon="chevron-back"
          title="Back to sign in"
          onPress={goBack}
        />
      </View>

      {saved ? (
        <TimetableList
          days={saved.days}
          session={saved.session}
          paddingBottom={insets.bottom + space.sectionGap}
        >
          <Card style={styles.notice}>
            <Ionicons name="information-circle-outline" size={20} style={styles.noticeIcon} />
            <Text style={styles.noticeText}>
              Saved {formatSavedAt(saved.savedAt)}. Sign in to check for
              updates to your timetable.
            </Text>
          </Card>
        </TimetableList>
      ) : (
        <EmptyState label="Sign in once to keep your timetable on this device." />
      )}
    </Screen>
  );
}

const useStyles = createStyles(({ colors }) => ({
  topBar: {
    paddingHorizontal: space.gutter,
    paddingTop: 8,
    alignItems: "flex-start",
  },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: space.listCard,
    marginTop: 4,
  },
  noticeIcon: {
    color: colors.textMuted,
  },
  noticeText: {
    ...type.footnote,
    color: colors.textMuted,
    flex: 1,
  },
}));
