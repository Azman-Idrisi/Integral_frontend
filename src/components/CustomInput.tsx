import { TextInput, StyleSheet } from "react-native";

export default function CustomInput(props: any) {
  return (
    <TextInput
      placeholderTextColor="#4d4d4d"
      style={[styles.input, props.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1f1f1f",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#4d4d4d",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "400",
  },
});