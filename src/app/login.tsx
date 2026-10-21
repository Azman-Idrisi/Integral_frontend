import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  saveCredentials,
  getCredentials,
} from "../store/savedCredentials";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import CaptchaImage from "../components/CaptchaImage";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import IndependenceLine from "../components/IndependenceLine";
import Screen from "../components/Screen";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { createStyles, radius, space, type, useTheme } from "../theme";

export default function LoginScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedUser, setSavedUser] =
    useState<string | null>(null);

  const [savedPassword, setSavedPassword] =
    useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);
  const authToken = useAuthStore((state) => state.authToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const fetchCaptcha = async () => {
    try {
      const response = await api.get("/auth/captcha");
      setSessionId(response.data.sessionId);
      setCaptchaUrl(response.data.captcha);
      setCaptcha(
        response.data.prediction || ""
      );
    } catch (err) {
      Alert.alert("Error", "Couldn't load the captcha");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (hasHydrated && authToken) {
        router.replace("/(tabs)");
        return;
      }

      const saved =
        await getCredentials();

      if (saved) {
        setSavedUser(saved.username);
        setSavedPassword(saved.password);
      }

      fetchCaptcha();
    };

    init();
  }, [hasHydrated, authToken]);

  const handleLogin = async () => {
    if (!username || !password || !captcha) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      setLoading(true);
      const response = await api.post("/auth/login", {
        username,
        password,
        captcha,
        sessionId,
      });
      if (!response.data.success) {
        Alert.alert("Sign-in failed", response.data.error || "Invalid credentials");
        fetchCaptcha();
        return;
      }
      await saveCredentials(
        username,
        password
      );
      setAuth(response.data.userId, response.data.authToken);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.error || "Sign-in failed");
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.main}>

            {/* HEADER */}
            <View style={styles.header}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.appIcon}
                accessibilityIgnoresInvertColors
              />
              <Text style={styles.appName}>Integral Student Portal</Text>
            </View>

            {/* FORM */}
            <View>

              <Text style={styles.formTitle}>Sign in</Text>
              <Text style={styles.formSubtitle}>
                Use your Enrollment Number and password
              </Text>

              {savedUser && (
                <CustomButton
                  variant="secondary"
                  title={`Continue as ${savedUser}`}
                  onPress={() => {
                    setUsername(savedUser);
                    setPassword(savedPassword || "");
                  }}
                  style={styles.savedAccountBtn}
                />
              )}

              <View style={styles.fields}>
                <CustomInput
                  label="Enrollment Number"
                  placeholder="e.g. 2200000000"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <CustomInput
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                {/* Captcha */}
                <View style={styles.fieldWrap}>
                  <View style={styles.captchaHeader}>
                    <Text style={styles.fieldLabel}>Captcha</Text>
                    <CustomButton
                      variant="icon"
                      icon="refresh"
                      title="Refresh captcha"
                      onPress={fetchCaptcha}
                    />
                  </View>

                  <View style={styles.captchaBox}>
                    {captchaUrl ? (
                      <CaptchaImage captchaUrl={captchaUrl} />
                    ) : (
                      <ActivityIndicator color={colors.accentInk} />
                    )}
                  </View>

                  <CustomInput
                    placeholder="Enter the characters above"
                    accessibilityLabel="Captcha"
                    value={captcha}
                    onChangeText={setCaptcha}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <CustomButton
                title="Sign in"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginBtn}
              />

            </View>

          </View>

          <IndependenceLine style={styles.independence} />

        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const useStyles = createStyles(({ colors }) => ({
  flex: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: space.gutter,
    paddingVertical: space.sectionGap,
  },

  // Header and form centered; the independence line sits at the bottom.
  main: {
    flex: 1,
    justifyContent: "center",
  },

  // HEADER
  header: {
    alignItems: "center",
    gap: 12,
    marginBottom: space.sectionGap,
  },
  appIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.photo,
  },
  appName: {
    ...type.headline,
    color: colors.text,
    textAlign: "center",
  },

  // FORM
  formTitle: {
    ...type.title,
    color: colors.text,
  },
  formSubtitle: {
    ...type.footnote,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  savedAccountBtn: {
    marginBottom: 20,
  },

  fields: {
    gap: 16,
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    ...type.overline,
    color: colors.textMuted,
  },

  // CAPTCHA
  captchaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  captchaBox: {
    minHeight: 86,
    borderRadius: radius.input,
    overflow: "hidden",
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  loginBtn: {
    marginTop: space.sectionGap,
  },

  independence: {
    marginTop: space.sectionGap,
  },
}));
