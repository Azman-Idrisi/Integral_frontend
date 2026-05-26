import { TextInput } from "react-native";
import { COLORS } from "../styles/colors";

export default function CustomInput(props: any) {
  return (
    <TextInput
      placeholderTextColor="#888"
      style={{
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 15,
        borderRadius: 12,
        backgroundColor: COLORS.white,
      }}
      {...props}
    />
  );
}