import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { createStyles, type } from "../theme";
import CustomButton from "./CustomButton";

export function LoadingState({ label }: { label: string }) {
  const styles = useStyles();

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={styles.accent.color} />
      <Text style={styles.footnote}>{label}</Text>
    </View>
  );
}

// Extra actions (children) go under "Try again".
export function ErrorState({
  message,
  onRetry,
  children,
}: {
  message: string;
  onRetry: () => void;
  children?: ReactNode;
}) {
  const styles = useStyles();

  return (
    <View style={styles.center}>
      <Ionicons name="alert-circle" size={40} style={styles.danger} />
      <Text style={styles.message}>{message}</Text>
      <CustomButton title="Try again" variant="secondary" onPress={onRetry} />
      {children}
    </View>
  );
}

export function EmptyState({ label }: { label: string }) {
  const styles = useStyles();

  return <Text style={styles.empty}>{label}</Text>;
}

const useStyles = createStyles(({ colors }) => ({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  accent: {
    color: colors.accentInk,
  },
  danger: {
    color: colors.danger,
  },
  footnote: {
    ...type.footnote,
    color: colors.textMuted,
  },
  message: {
    ...type.callout,
    color: colors.text,
    textAlign: "center",
  },
  empty: {
    ...type.callout,
    color: colors.textSubtle,
    textAlign: "center",
    marginTop: 48,
  },
}));
