import {
  useEffect,
  useState,
} from "react";

import { Redirect } from "expo-router";

import LoginScreen from "./login";

import Screen from "../components/Screen";

import { LoadingState } from "../components/StateView";

import { useAuthStore } from "../store/authStore";

import { api } from "../services/api";

export default function Index() {
  const authToken = useAuthStore(
    (state) => state.authToken
  );

  const hasHydrated = useAuthStore(
    (state) => state.hasHydrated
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [sessionValid, setSessionValid] =
    useState<boolean | null>(null);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!authToken) {
      setSessionValid(false);
      return;
    }

    const validateSession =
      async () => {
        try {
          await api.get("/auth/me");
          setSessionValid(true);
        } catch {
          logout();
          setSessionValid(false);
        }
      };

    validateSession();
  }, [hasHydrated, authToken]);

  if (
    !hasHydrated ||
    (authToken &&
      sessionValid === null)
  ) {
    return (
      <Screen
        edges={["top", "bottom"]}
      >
        <LoadingState
          label="Checking your sign-in…"
        />
      </Screen>
    );
  }

  if (authToken && sessionValid) {
    return (
      <Redirect href="/(tabs)" />
    );
  }

  return <LoginScreen />;
}
