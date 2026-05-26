import {
  useEffect,
  useState,
} from "react";

import {
  Text,
  Alert,
  View,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import CaptchaImage from "../components/CaptchaImage";

import { useAuthStore } from "../store/authStore";

import { api } from "../services/api";

export default function LoginScreen() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [captcha, setCaptcha] =
    useState("");

  const [sessionId, setSessionId] =
    useState("");

  const [captchaUrl, setCaptchaUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // NEW AUTH STORE
  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  const authToken = useAuthStore(
    (state) => state.authToken
  );

  const hasHydrated = useAuthStore(
    (state) => state.hasHydrated
  );

  // ======================
  // FETCH CAPTCHA
  // ======================

  const fetchCaptcha =
    async () => {
      try {
        const response =
          await api.get(
            "/auth/captcha"
          );

        setSessionId(
          response.data.sessionId
        );

        setCaptchaUrl(
          response.data.captcha
        );

        setCaptcha("");
      } catch (err) {
        Alert.alert(
          "Error",
          "Captcha fetch failed"
        );
      }
    };

  useEffect(() => {
    if (hasHydrated && authToken) {
      router.replace("/(tabs)");
      return;
    }

    fetchCaptcha();
  }, [hasHydrated, authToken]);

  // ======================
  // LOGIN
  // ======================

  const handleLogin =
    async () => {
      // BASIC VALIDATION
      if (
        !username ||
        !password ||
        !captcha
      ) {
        return Alert.alert(
          "Error",
          "Please fill all fields"
        );
      }

      try {
        setLoading(true);

        const response =
          await api.post(
            "/auth/login",
            {
              username,
              password,
              captcha,
              sessionId,
            }
          );

        // LOGIN FAILED
        if (
          !response.data.success
        ) {
          Alert.alert(
            "Login Failed",
            response.data.error ||
            "Invalid credentials"
          );

          fetchCaptcha();

          return;
        }

        // SAVE AUTH
        setAuth(
          response.data.userId,
          response.data.authToken
        );

        // NAVIGATE
        router.replace(
          "/(tabs)"
        );
      } catch (err: any) {
        console.log(err);

        Alert.alert(
          "Error",
          err?.response?.data
            ?.error ||
          "Login failed"
        );

        fetchCaptcha();
      } finally {
        setLoading(false);
      }
    };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent:
          "center",

        padding: 20,

        backgroundColor:
          "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 32,

          fontWeight: "bold",

          textAlign: "center",

          marginBottom: 30,
        }}
      >
        Integral Login
      </Text>

      <View
        style={{
          gap: 18,
        }}
      >
        <CustomInput
          placeholder="Enrollment Number"
          value={username}
          onChangeText={
            setUsername
          }
        />

        <CustomInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={
            setPassword
          }
        />

        {/* CAPTCHA */}
        <View
          style={{
            alignItems:
              "center",

            gap: 10,
          }}
        >
          {captchaUrl ? (
            <CaptchaImage captchaUrl={captchaUrl} />
          ) : null}

          <TouchableOpacity
            onPress={
              fetchCaptcha
            }
          >
            <Text
              style={{
                color:
                  "#2563eb",

                fontWeight:
                  "600",
              }}
            >
              Refresh Captcha
            </Text>
          </TouchableOpacity>
        </View>

        <CustomInput
          placeholder="Enter Captcha"
          value={captcha}
          onChangeText={
            setCaptcha
          }
        />

        <CustomButton
          title={
            loading
              ? "LOGGING IN..."
              : "LOGIN"
          }
          onPress={
            handleLogin
          }
        />
      </View>
    </SafeAreaView>
  );
}