import { create } from "zustand";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import { persist } from
  "zustand/middleware";

import { Appearance } from "react-native";

export type AppearanceSetting =
  | "system"
  | "light"
  | "dark";

interface AppearanceState {
  appearance: AppearanceSetting;

  setAppearance: (
    value: AppearanceSetting
  ) => void;
}

const apply = (
  value: AppearanceSetting
) =>
  Appearance.setColorScheme(
    value === "system"
      ? "unspecified"
      : value
  );

export const useAppearanceStore =
  create<AppearanceState>()(
    persist(
      (set) => ({
        appearance: "system",

        setAppearance: (value) => {
          apply(value);
          set({ appearance: value });
        },
      }),

      {
        name: "appearance-storage",

        onRehydrateStorage:
          () => (state) => {
            if (state) {
              apply(state.appearance);
            }
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
