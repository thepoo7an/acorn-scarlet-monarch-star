import type { CompressionProfile, CompressionSettings, PresetId } from "./types";

export const DEFAULT_CUSTOM_SETTINGS: CompressionSettings = {
  presetId: "custom",
  videoCodec: "h264",
  audioCodec: "aac",
  container: "mp4",
  rateControl: "crf",
  crf: 23,
  videoBitrateKbps: 2500,
  audioBitrateKbps: 128,
  encoderPreset: "medium",
  resolution: "original",
  customWidth: 1920,
  customHeight: 1080,
  fps: "original",
  customFps: 30,
  audioSampleRate: "original",
  fitMode: "pad",
  faststart: true,
};

export const PROFILES: CompressionProfile[] = [
  {
    id: "instagram-reels",
    name: "Instagram Reels",
    tagline: "Vertical 9:16, social-ready",
    description:
      "Crops to a 9:16 frame at 1080×1920. Uses H.264 and AAC in MP4 so Reels uploads stay compatible. Keeps 60 FPS when the source is 60; otherwise locks to 30. Balanced quality for a reasonable file size.",
    settings: {
      ...DEFAULT_CUSTOM_SETTINGS,
      presetId: "instagram-reels",
      videoCodec: "h264",
      audioCodec: "aac",
      container: "mp4",
      rateControl: "crf",
      crf: 20,
      audioBitrateKbps: 128,
      encoderPreset: "fast",
      resolution: "custom",
      customWidth: 1080,
      customHeight: 1920,
      fps: "30",
      fitMode: "crop",
      faststart: true,
    },
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    tagline: "Short vertical clips",
    description:
      "Same 9:16 1080×1920 frame as Stories, with slightly stronger compression for short clips. H.264, AAC, MP4, 30 FPS. Designed for quick sharing rather than archival quality.",
    settings: {
      ...DEFAULT_CUSTOM_SETTINGS,
      presetId: "instagram-story",
      videoCodec: "h264",
      audioCodec: "aac",
      container: "mp4",
      rateControl: "crf",
      crf: 23,
      audioBitrateKbps: 96,
      encoderPreset: "veryfast",
      resolution: "custom",
      customWidth: 1080,
      customHeight: 1920,
      fps: "30",
      fitMode: "crop",
      faststart: true,
    },
  },
  {
    id: "high-quality",
    name: "High Quality",
    tagline: "Keep the picture, shrink a little",
    description:
      "Preserves the original resolution and frame rate. Slow H.264 encode at CRF 18 for high visual fidelity. Larger files. Use this when the result still needs to look close to the source.",
    settings: {
      ...DEFAULT_CUSTOM_SETTINGS,
      presetId: "high-quality",
      videoCodec: "h264",
      audioCodec: "aac",
      container: "mp4",
      rateControl: "crf",
      crf: 18,
      audioBitrateKbps: 192,
      encoderPreset: "slow",
      resolution: "original",
      fps: "original",
      fitMode: "pad",
      faststart: true,
    },
  },
  {
    id: "small-file",
    name: "Small File",
    tagline: "Smallest acceptable quality",
    description:
      "Caps output at 720p and 30 FPS, then uses a high CRF so the file drops substantially. Picture will look softer, especially on large screens. Best for messages, drafts, and storage cleanup.",
    settings: {
      ...DEFAULT_CUSTOM_SETTINGS,
      presetId: "small-file",
      videoCodec: "h264",
      audioCodec: "aac",
      container: "mp4",
      rateControl: "crf",
      crf: 28,
      audioBitrateKbps: 96,
      encoderPreset: "veryfast",
      resolution: "720p",
      fps: "30",
      fitMode: "pad",
      faststart: true,
    },
  },
  {
    id: "custom",
    name: "Custom",
    tagline: "Full manual control",
    description:
      "Every encoder option is yours: codec, CRF or bitrate, preset, resolution, frame rate, audio, and container. Incompatible combinations are blocked before FFmpeg runs.",
    settings: DEFAULT_CUSTOM_SETTINGS,
  },
];

export function getProfile(id: PresetId): CompressionProfile {
  return PROFILES.find((p) => p.id === id) ?? PROFILES[4]!;
}

export function settingsFromPreset(
  id: PresetId,
  sourceFps: number | null,
): CompressionSettings {
  const profile = getProfile(id);
  const next = { ...profile.settings };
  if (id === "instagram-reels" && sourceFps && sourceFps >= 50) {
    next.fps = "60";
  }
  return next;
}
