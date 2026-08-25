import type {
  BuiltCommand,
  CompressionResult,
  CompressionSettings,
  EngineCapabilities,
  ProcessingProgress,
  VideoInfo,
} from "./types";

export interface ProbeResult {
  info: Partial<VideoInfo>;
  raw: string;
}

export interface RunJob {
  file: File;
  info: VideoInfo;
  settings: CompressionSettings;
  command: BuiltCommand;
  signal: AbortSignal;
  onProgress: (progress: ProcessingProgress) => void;
}

/**
 * Engine boundary. UI and CompressionManager talk only to this interface.
 * Web: WasmFFmpegEngine (ffmpeg.wasm).
 * Android Studio: replace with NativeFFmpegEngine wrapping FFmpeg 9.0.1.
 */
export interface FFmpegEngine {
  readonly id: string;
  load(onStatus?: (message: string) => void): Promise<EngineCapabilities>;
  capabilities(): EngineCapabilities | null;
  isReady(): boolean;
  probe(file: File, inputName: string, signal?: AbortSignal): Promise<ProbeResult>;
  run(job: RunJob): Promise<CompressionResult>;
  cancel(): Promise<void>;
  dispose(): Promise<void>;
}

export const NATIVE_ENGINE_NOTES = [
  "Native Android must compile official FFmpeg 9.0.1 from https://ffmpeg.org/download.html",
  "Source tarball: https://ffmpeg.org/releases/ffmpeg-9.0.1.tar.xz (released 2026-08-12).",
  "Do not substitute unofficial binaries unless an Android ABI cannot be built from source.",
  "Implement NativeFFmpegEngine in android/app/.../engine/NativeFFmpegEngine.kt after NDK setup.",
] as const;
