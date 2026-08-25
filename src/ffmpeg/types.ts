export type VideoCodecId = "h264" | "hevc" | "av1" | "vp9" | "copy";
export type AudioCodecId = "aac" | "opus" | "copy" | "none";
export type ContainerId = "mp4" | "mkv" | "webm";
export type RateControl = "crf" | "bitrate";
export type EncoderPreset =
  | "ultrafast"
  | "superfast"
  | "veryfast"
  | "faster"
  | "fast"
  | "medium"
  | "slow"
  | "slower"
  | "veryslow";
export type ResolutionPreset =
  | "original"
  | "2160p"
  | "1440p"
  | "1080p"
  | "720p"
  | "480p"
  | "custom";
export type FpsPreset = "original" | "60" | "30" | "24" | "custom";
export type PresetId =
  | "instagram-reels"
  | "instagram-story"
  | "high-quality"
  | "small-file"
  | "custom";
export type FitMode = "crop" | "pad" | "stretch";

export interface VideoInfo {
  filename: string;
  sizeBytes: number;
  mimeType: string;
  container: string | null;
  durationSec: number | null;
  width: number | null;
  height: number | null;
  fps: number | null;
  videoCodec: string | null;
  audioCodec: string | null;
  bitrateBps: number | null;
  videoBitrateBps: number | null;
  audioBitrateBps: number | null;
  audioSampleRate: number | null;
  audioChannels: number | null;
  rotation: number | null;
  pixelFormat: string | null;
  thumbnailUrl: string | null;
}

export interface CompressionSettings {
  presetId: PresetId;
  videoCodec: VideoCodecId;
  audioCodec: AudioCodecId;
  container: ContainerId;
  rateControl: RateControl;
  crf: number;
  videoBitrateKbps: number;
  audioBitrateKbps: number;
  encoderPreset: EncoderPreset;
  resolution: ResolutionPreset;
  customWidth: number;
  customHeight: number;
  fps: FpsPreset;
  customFps: number;
  audioSampleRate: number | "original";
  fitMode: FitMode;
  faststart: boolean;
}

export interface CompressionProfile {
  id: PresetId;
  name: string;
  tagline: string;
  description: string;
  settings: CompressionSettings;
}

export interface EngineCapabilities {
  versionLine: string | null;
  ffmpegVersion: string | null;
  configuration: string | null;
  license: "gpl" | "lgpl" | "unknown";
  videoEncoders: string[];
  audioEncoders: string[];
  hardwareAcceleration: false;
  threading: "single" | "multi";
  source: "ffmpeg.wasm" | "native";
  notes: string[];
}

export interface BuiltCommand {
  args: string[];
  inputName: string;
  outputName: string;
  summary: string[];
  warnings: string[];
}

export type ProcessingStage =
  | "idle"
  | "loading-engine"
  | "probing"
  | "writing-input"
  | "encoding"
  | "reading-output"
  | "finalizing"
  | "cancelling"
  | "completed"
  | "failed"
  | "cancelled";

export interface ProcessingProgress {
  stage: ProcessingStage;
  ratio: number | null;
  frameTimeSec: number | null;
  elapsedMs: number;
  remainingMs: number | null;
  message: string;
  logLine: string | null;
}

export interface CompressionResult {
  blob: Blob;
  filename: string;
  sizeBytes: number;
  originalSizeBytes: number;
  reductionPercent: number | null;
  durationMs: number;
  settings: CompressionSettings;
  command: string[];
  outputCodec: string;
  outputContainer: ContainerId;
}

export interface JobRecord {
  id: string;
  filename: string;
  originalSizeBytes: number;
  outputSizeBytes: number | null;
  status: "completed" | "failed" | "cancelled";
  presetId: PresetId;
  createdAt: number;
  durationMs: number | null;
  errorMessage: string | null;
}

export const RESOLUTION_HEIGHT: Record<Exclude<ResolutionPreset, "original" | "custom">, number> =
  {
    "2160p": 2160,
    "1440p": 1440,
    "1080p": 1080,
    "720p": 720,
    "480p": 480,
  };

export const CONTAINER_EXTENSION: Record<ContainerId, string> = {
  mp4: "mp4",
  mkv: "mkv",
  webm: "webm",
};

export const VIDEO_CODEC_LABEL: Record<VideoCodecId, string> = {
  h264: "H.264 / AVC",
  hevc: "H.265 / HEVC",
  av1: "AV1",
  vp9: "VP9",
  copy: "Copy (no re-encode)",
};

export const AUDIO_CODEC_LABEL: Record<AudioCodecId, string> = {
  aac: "AAC",
  opus: "Opus",
  copy: "Copy",
  none: "Disable audio",
};
