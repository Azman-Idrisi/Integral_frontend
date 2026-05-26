import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CustomButton({ title, onPress, disabled }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.btn, disabled && styles.btnDisabled]}
    >
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#1ed760",
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: "center",
    shadowColor: "#1ed760",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  label: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
});