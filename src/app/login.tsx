import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  saveCredentials,
  getCredentials,
} from "../store/savedCredentials";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CaptchaImage from "../components/CaptchaImage";
import CustomInput from "../components/CustomInput";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
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
      Alert.alert("Error", "Captcha fetch failed");
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
        Alert.alert("Login Failed", response.data.error || "Invalid credentials");
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
      Alert.alert("Error", err?.response?.data?.error || "Login failed");
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* BG gradient layers */}
      <LinearGradient
        colors={["#121212", "#181818", "#121212"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Accent orb top-right */}
      <View style={styles.orbTopRight} />
      {/* Accent orb bottom-left */}
      <View style={styles.orbBottomLeft} />



      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoMark}>
              <Text style={styles.logoLetter}>I</Text>
            </View>
            <Text style={styles.institution}>INTEGRAL UNIVERSITY</Text>
            <Text style={styles.portalLabel}>STUDENT PORTAL</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>

            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>Use your enrollment credentials</Text>

            {savedUser && (
              <TouchableOpacity
                style={styles.savedAccountBtn}
                onPress={() => {
                  setUsername(savedUser);
                  setPassword(savedPassword || "");
                }}
              >
                <Text style={styles.savedAccountText}>
                  Continue as {savedUser}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.fields}>

              {/* Enrollment */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>ENROLLMENT NUMBER</Text>
                <CustomInput
                  placeholder="e.g. 2200000000"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  placeholderTextColor="#4d4d4d"
                />
              </View>

              {/* Password */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <CustomInput
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholderTextColor="#4d4d4d"
                />
              </View>

              {/* Captcha */}
              <View style={styles.fieldWrap}>
                <View style={styles.captchaHeader}>
                  <Text style={styles.fieldLabel}>CAPTCHA</Text>
                  <TouchableOpacity onPress={fetchCaptcha} style={styles.refreshBtn}>
                    <Text style={styles.refreshText}>↻  REFRESH</Text>
                  </TouchableOpacity>
                </View>

                {captchaUrl ? (
                  <View style={styles.captchaImageWrap}>
                    <CaptchaImage captchaUrl={captchaUrl} />
                  </View>
                ) : (
                  <View style={styles.captchaPlaceholder}>
                    <ActivityIndicator color="#1ed760" size="small" />
                  </View>
                )}

                <CustomInput
                  placeholder="Enter characters above"
                  value={captcha}
                  onChangeText={setCaptcha}
                  style={styles.input}
                  placeholderTextColor="#4d4d4d"
                />
              </View>

            </View>

            {/* LOGIN BTN */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Text style={styles.loginBtnText}>LOGIN</Text>
              )}
            </TouchableOpacity>

          </View>

          {/* FOOTER */}
          <Text style={styles.footer}>
            Having trouble?{" "}
            <Text style={styles.footerLink}>Contact IT Support</Text>
          </Text>


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#121212",
  },

  savedAccountBtn: {
    marginBottom: 16,
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1ed760",
  },

  savedAccountText: {
    color: "#1ed760",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 13,
  },

  // BG orbs
  orbTopRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#1ed760",
    opacity: 0.06,
  },
  orbBottomLeft: {
    position: "absolute",
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#1ed760",
    opacity: 0.04,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  // HEADER
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1ed760",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    // shadow
    shadowColor: "#1ed760",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoLetter: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "700",
  },
  institution: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  portalLabel: {
    color: "#b3b3b3",
    fontSize: 11,
    fontWeight: "400",
    letterSpacing: 1.4,
    marginTop: 2,
  },

  // CARD
  card: {
    backgroundColor: "#181818",
    borderRadius: 8,
    padding: 24,
    // heavy shadow per DESIGN.md
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#b3b3b3",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 20,
  },

  fields: {
    gap: 16,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: "#b3b3b3",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  input: {
    backgroundColor: "#1f1f1f",
    color: "#ffffff",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "400",
    // inset border per DESIGN.md
    borderWidth: 1,
    borderColor: "#4d4d4d",
  },

  // CAPTCHA
  captchaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refreshBtn: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#4d4d4d",
  },
  refreshText: {
    color: "#1ed760",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  captchaImageWrap: {
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    paddingVertical: 8,
  },
  captchaPlaceholder: {
    height: 60,
    backgroundColor: "#1f1f1f",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  // LOGIN BUTTON — Spotify green pill
  loginBtn: {
    backgroundColor: "#1ed760",
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#1ed760",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },

  // FOOTER
  footer: {
    color: "#b3b3b3",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
  footerLink: {
    color: "#1ed760",
    fontWeight: "600",
  },
});