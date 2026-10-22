import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TimetableDay } from "../types/timetable";

export interface SavedTimetable {
  userId: string | null;
  session: string;
  days: TimetableDay[];
  // Epoch ms of the last successful fetch.
  savedAt: number;
}

interface TimetableState {
  saved: SavedTimetable | null;
  save: (timetable: SavedTimetable) => void;
  clear: () => void;
}

// e.g. "22 Oct 2026, 9:41 am", in the phone's locale.
export const formatSavedAt = (savedAt: number) =>
  new Date(savedAt).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

// The last timetable fetched while signed in. It outlives log out so the
// login screen can show it without a Sign-in.
export const useTimetableStore = create<TimetableState>()(
  persist(
    (set) => ({
      saved: null,
      save: (timetable) => set({ saved: timetable }),
      clear: () => set({ saved: null }),
    }),
    {
      name: "timetable-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ saved: state.saved }),
    }
  )
);
