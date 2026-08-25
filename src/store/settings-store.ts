import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PresetId } from "@/ffmpeg/types";

export type ThemeMode = "dark" | "light" | "system";

export interface AppSettings {
  theme: ThemeMode;
  defaultPreset: PresetId;
  keepOriginal: boolean;
  autoOpenOutput: boolean;
  showDetailedLogs: boolean;
}

const DEFAULTS: AppSettings = {
  theme: "dark",
  defaultPreset: "small-file",
  keepOriginal: true,
  autoOpenOutput: false,
  showDetailedLogs: false,
};

interface SettingsState extends AppSettings {
  setTheme: (theme: ThemeMode) => void;
  setDefaultPreset: (id: PresetId) => void;
  setKeepOriginal: (v: boolean) => void;
  setAutoOpenOutput: (v: boolean) => void;
  setShowDetailedLogs: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setTheme: (theme) => set({ theme }),
      setDefaultPreset: (defaultPreset) => set({ defaultPreset }),
      setKeepOriginal: (keepOriginal) => set({ keepOriginal }),
      setAutoOpenOutput: (autoOpenOutput) => set({ autoOpenOutput }),
      setShowDetailedLogs: (showDetailedLogs) => set({ showDetailedLogs }),
    }),
    { name: "ffvc-settings" },
  ),
);

export function resolvedTheme(theme: ThemeMode, prefersDark: boolean): "dark" | "light" {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}
