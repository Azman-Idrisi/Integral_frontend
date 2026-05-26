import { TouchableOpacity, Text } from "react-native";
import { COLORS } from "../styles/colors";

export default function CustomButton({
  title,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}