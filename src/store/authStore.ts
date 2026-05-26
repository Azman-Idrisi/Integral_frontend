import { create } from "zustand";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import { persist } from
  "zustand/middleware";

interface AuthState {
  userId: string | null;

  authToken: string | null;

  hasHydrated: boolean;

  setAuth: (
    userId: string,
    authToken: string
  ) => void;

  logout: () => void;

  setHasHydrated: (
    value: boolean
  ) => void;
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        userId: null,

        authToken: null,

        hasHydrated: false,

        setAuth: (
          userId,
          authToken
        ) =>
          set({
            userId,
            authToken,
          }),

        logout: () =>
          set({
            userId: null,
            authToken: null,
          }),

        setHasHydrated: (
          value
        ) =>
          set({
            hasHydrated: value,
          }),
      }),

      {
        name: "auth-storage",

        partialize: (state) => ({
          userId: state.userId,
          authToken: state.authToken,
        }),

        onRehydrateStorage:
          () => () => {
            useAuthStore
              .getState()
              .setHasHydrated(true);
          },

        storage: {
          getItem: async (
            name
          ) => {
            const value =
              await AsyncStorage.getItem(
                name
              );

            return value
              ? JSON.parse(
                value
              )
              : null;
          },

          setItem: async (
            name,
            value
          ) => {
            await AsyncStorage.setItem(
              name,
              JSON.stringify(value)
            );
          },

          removeItem:
            AsyncStorage.removeItem,
        },
      }
    )
  );
