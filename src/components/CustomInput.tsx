import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { createStyles, radius, type } from "../theme";

export default function CustomInput({
  label,
  style,
  onFocus,
  onBlur,
  ...props
}: TextInputProps & { label?: string }) {
  const styles = useStyles();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={styles.placeholder.color}
        selectionColor={styles.focused.borderColor}
        cursorColor={styles.focused.borderColor}
        accessibilityLabel={label}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, focused && styles.focused, style]}
      />
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  wrap: {
    gap: 8,
  },
  label: {
    ...type.overline,
    color: colors.textMuted,
  },
  input: {
    ...type.body,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderControl,
    backgroundColor: colors.surfaceRaised,
    color: colors.text,
  },
  // 2px border; padding shrinks by 1 so the text doesn't shift.
  focused: {
    borderWidth: 2,
    paddingHorizontal: 15,
    borderColor: colors.accentInk,
  },
  placeholder: {
    color: colors.textSubtle,
  },
}));
