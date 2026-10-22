import type { ReactElement, ReactNode } from "react";
import { SectionList, Text, View, type RefreshControlProps } from "react-native";
import { createStyles, font, radius, space, type } from "../theme";
import type { TimetableDay } from "../types/timetable";
import Card from "./Card";
import Glass from "./Glass";
import { InfoPill } from "./Pill";
import { EmptyState } from "./StateView";

// The day-by-day timetable, shared by the Timetable tab and the saved
// timetable opened from the login screen. `children` go under the title.
export default function TimetableList({
  days,
  session,
  paddingBottom,
  refreshControl,
  children,
}: {
  days: TimetableDay[];
  session: string;
  paddingBottom: number;
  refreshControl?: ReactElement<RefreshControlProps>;
  children?: ReactNode;
}) {
  const styles = useStyles();

  const sections = days
    .filter((d) => d.slots.length > 0)
    .map((d) => ({ title: d.day, data: d.slots }));

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => `${item.period}-${index}`}
      stickySectionHeadersEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.listContent, { paddingBottom }]}

      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Timetable</Text>
          {session ? (
            <InfoPill>Academic Session {session}</InfoPill>
          ) : (
            <Text style={styles.pageSubtitle}>Current semester schedule</Text>
          )}
          {children}
        </View>
      }

      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Glass style={styles.sectionHeaderGlass}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </Glass>
        </View>
      )}

      renderItem={({ item }) => (
        <Card style={styles.slotCard}>
          {/* LEFT — period indicator */}
          <View style={styles.slotLeft}>
            <Text style={styles.periodNum}>{item.period}</Text>
            <Text style={styles.periodLabel}>Period</Text>
          </View>

          {/* RIGHT — time + subjects */}
          <View style={styles.slotRight}>
            {item.time ? (
              <Text style={styles.slotTime}>
                {/* SMS gives "09:50 AM -10:40 AM". */}
                {item.time.replace(/\s*-\s*/, " – ")}
              </Text>
            ) : null}
            {item.subjects.map((subject, i) => (
              <Text key={i} style={styles.subjectText}>
                {subject}
              </Text>
            ))}
          </View>
        </Card>
      )}

      refreshControl={refreshControl}

      ListEmptyComponent={<EmptyState label="No timetable to show yet." />}
    />
  );
}

const useStyles = createStyles(({ colors }) => ({
  listContent: {
    paddingHorizontal: space.gutter,
    paddingTop: space.gutter,
  },

  // HEADER
  header: {
    gap: 8,
    marginBottom: 12,
  },
  pageTitle: {
    ...type.largeTitle,
    color: colors.text,
  },
  pageSubtitle: {
    ...type.footnote,
    color: colors.textMuted,
  },

  // SECTION HEADER
  sectionHeader: {
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  sectionHeaderGlass: {
    borderRadius: radius.capsule,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    ...type.headline,
    color: colors.text,
  },

  // SLOT CARD
  slotCard: {
    marginBottom: space.cardGap,
    flexDirection: "row",
    overflow: "hidden",
  },
  slotLeft: {
    width: 72,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.listCard,
    gap: 2,
  },
  periodNum: {
    ...type.headline,
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
  periodLabel: {
    ...type.overline,
    color: colors.textMuted,
  },
  slotRight: {
    flex: 1,
    padding: space.listCard,
    gap: 4,
  },
  slotTime: {
    ...type.footnote,
    ...font.mono,
    color: colors.textMuted,
  },
  subjectText: {
    ...type.bodyStrong,
    color: colors.text,
  },
}));
