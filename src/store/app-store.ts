import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FFmpegCommandBuilder } from "@/ffmpeg/command-builder";
import { CompressorError, toCompressorError } from "@/ffmpeg/errors";
import { estimateOutputSize, type SizeEstimate } from "@/ffmpeg/estimate";
import { enrichWithFFmpeg, extractBrowserMetadata } from "@/ffmpeg/metadata";
import { openBlob, saveOutput } from "@/ffmpeg/output-manager";
import { processManager } from "@/ffmpeg/process-manager";
import { settingsFromPreset } from "@/ffmpeg/profiles";
import type {
  CompressionResult,
  CompressionSettings,
  EngineCapabilities,
  JobRecord,
  PresetId,
  ProcessingProgress,
  VideoInfo,
} from "@/ffmpeg/types";

type Screen = "editor" | "processing" | "result";

interface AppState {
  file: File | null;
  info: VideoInfo | null;
  settings: CompressionSettings;
  progress: ProcessingProgress | null;
  result: CompressionResult | null;
  error: { user: string; diagnostic: string | null } | null;
  screen: Screen;
  probing: boolean;
  engineCaps: EngineCapabilities | null;
  recent: JobRecord[];
  advancedOpen: boolean;
  setAdvancedOpen: (v: boolean) => void;
  selectFile: (file: File) => Promise<void>;
  clearFile: () => void;
  applyPreset: (id: PresetId) => void;
  patchSettings: (patch: Partial<CompressionSettings>) => void;
  compress: () => Promise<void>;
  cancel: () => Promise<void>;
  saveResult: () => Promise<void>;
  resetToEditor: () => void;
  estimate: () => SizeEstimate | null;
  commandPreview: () => string | null;
  hydrateEngine: () => Promise<void>;
}

const builder = new FFmpegCommandBuilder();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      file: null,
      info: null,
      settings: settingsFromPreset("small-file", null),
      progress: null,
      result: null,
      error: null,
      screen: "editor",
      probing: false,
      engineCaps: null,
      recent: [],
      advancedOpen: false,
      setAdvancedOpen: (advancedOpen) => set({ advancedOpen }),

      selectFile: async (file) => {
        get().result?.blob && URL.revokeObjectURL("");
        set({
          file,
          probing: true,
          error: null,
          result: null,
          screen: "editor",
          info: {
            filename: file.name,
            sizeBytes: file.size,
            mimeType: file.type,
            container: null,
            durationSec: null,
            width: null,
            height: null,
            fps: null,
            videoCodec: null,
            audioCodec: null,
            bitrateBps: null,
            videoBitrateBps: null,
            audioBitrateBps: null,
            audioSampleRate: null,
            audioChannels: null,
            rotation: null,
            pixelFormat: null,
            thumbnailUrl: null,
          },
        });
        try {
          const browser = await extractBrowserMetadata(file);
          set({ info: browser });
          const { settings } = get();
          if (settings.presetId !== "custom") {
            set({ settings: settingsFromPreset(settings.presetId, browser.fps) });
          }
          const rich = await enrichWithFFmpeg(file, browser);
          set({ info: rich, probing: false, engineCaps: processManager.capabilities() });
        } catch (error) {
          const err = toCompressorError(error);
          set({
            probing: false,
            error: { user: err.userMessage, diagnostic: err.diagnostic },
          });
        }
      },

      clearFile: () => {
        const { info } = get();
        if (info?.thumbnailUrl?.startsWith("blob:")) URL.revokeObjectURL(info.thumbnailUrl);
        set({ file: null, info: null, result: null, error: null, screen: "editor", progress: null });
      },

      applyPreset: (id) => {
        const fps = get().info?.fps ?? null;
        set({ settings: settingsFromPreset(id, fps), error: null });
      },

      patchSettings: (patch) => {
        set((s) => ({
          settings: { ...s.settings, ...patch, presetId: "custom" },
          error: null,
        }));
      },

      compress: async () => {
        const { file, info, settings } = get();
        if (!file || !info) {
          set({ error: { user: "Select a video first.", diagnostic: null } });
          return;
        }
        set({
          screen: "processing",
          error: null,
          result: null,
          progress: {
            stage: "loading-engine",
            ratio: 0,
            frameTimeSec: null,
            elapsedMs: 0,
            remainingMs: null,
            message: "Starting…",
            logLine: null,
          },
        });
        try {
          const result = await processManager.compress(file, info, settings, (progress) => {
            set({ progress });
          });
          const record: JobRecord = {
            id: crypto.randomUUID(),
            filename: file.name,
            originalSizeBytes: info.sizeBytes,
            outputSizeBytes: result.sizeBytes,
            status: "completed",
            presetId: settings.presetId,
            createdAt: Date.now(),
            durationMs: result.durationMs,
            errorMessage: null,
          };
          set((s) => ({
            result,
            screen: "result",
            progress: { ...s.progress!, stage: "completed", ratio: 1, message: "Done" },
            recent: [record, ...s.recent].slice(0, 12),
            engineCaps: processManager.capabilities(),
          }));
          const autoOpen = JSON.parse(localStorage.getItem("ffvc-settings") || "{}") as {
            state?: { autoOpenOutput?: boolean };
          };
          if (autoOpen.state?.autoOpenOutput) openBlob(result.blob);
        } catch (error) {
          const err = toCompressorError(error);
          if (err.code === "CANCELLED") {
            const record: JobRecord = {
              id: crypto.randomUUID(),
              filename: file.name,
              originalSizeBytes: info.sizeBytes,
              outputSizeBytes: null,
              status: "cancelled",
              presetId: settings.presetId,
              createdAt: Date.now(),
              durationMs: get().progress?.elapsedMs ?? null,
              errorMessage: null,
            };
            set((s) => ({
              screen: "editor",
              progress: null,
              error: null,
              recent: [record, ...s.recent].slice(0, 12),
            }));
            return;
          }
          const record: JobRecord = {
            id: crypto.randomUUID(),
            filename: file.name,
            originalSizeBytes: info.sizeBytes,
            outputSizeBytes: null,
            status: "failed",
            presetId: settings.presetId,
            createdAt: Date.now(),
            durationMs: get().progress?.elapsedMs ?? null,
            errorMessage: err.userMessage,
          };
          set((s) => ({
            screen: "editor",
            error: { user: err.userMessage, diagnostic: err.diagnostic },
            progress: null,
            recent: [record, ...s.recent].slice(0, 12),
          }));
        }
      },

      cancel: async () => {
        set((s) => ({
          progress: s.progress
            ? { ...s.progress, stage: "cancelling", message: "Stopping FFmpeg and removing temp files…" }
            : s.progress,
        }));
        await processManager.cancel();
      },

      saveResult: async () => {
        const { result } = get();
        if (!result) return;
        try {
          await saveOutput(result.blob, result.filename);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          const err = toCompressorError(error);
          set({ error: { user: err.userMessage, diagnostic: err.diagnostic } });
        }
      },

      resetToEditor: () => set({ screen: "editor", progress: null }),

      estimate: () => {
        const { info, settings } = get();
        if (!info) return null;
        return estimateOutputSize(info, settings);
      },

      commandPreview: () => {
        const { info, settings, engineCaps } = get();
        if (!info) return null;
        try {
          const built = builder.build(info, settings, engineCaps);
          return ["ffmpeg", ...built.args].join(" ");
        } catch (error) {
          if (error instanceof CompressorError) return error.userMessage;
          return null;
        }
      },

      hydrateEngine: async () => {
        try {
          const caps = await processManager.ensureLoaded();
          set({ engineCaps: caps });
        } catch {
          /* engine loads on first compress / probe */
        }
      },
    }),
    {
      name: "ffvc-recent",
      partialize: (s) => ({ recent: s.recent }),
    },
  ),
);
