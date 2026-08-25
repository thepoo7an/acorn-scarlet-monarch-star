import { targetFps, targetSize } from "./command-builder";
import type { CompressionSettings, VideoInfo } from "./types";

export interface SizeEstimate {
  bytes: number;
  label: string;
  confidence: "low" | "medium";
  method: string;
}

/**
 * Output size is estimated, never promised.
 * CRF uses a bits-per-pixel heuristic; bitrate mode uses the selected rates.
 */
export function estimateOutputSize(
  info: VideoInfo,
  settings: CompressionSettings,
): SizeEstimate | null {
  const duration = info.durationSec;
  if (!duration || duration <= 0) return null;

  const size = targetSize(info, settings);
  const width = size?.width ?? info.width ?? 1280;
  const height = size?.height ?? info.height ?? 720;
  const fps = targetFps(info, settings) ?? info.fps ?? 30;

  let videoBps: number;
  let method: string;

  if (settings.videoCodec === "copy" && info.videoBitrateBps) {
    videoBps = info.videoBitrateBps;
    method = "copied video bitrate";
  } else if (settings.rateControl === "bitrate") {
    videoBps = settings.videoBitrateKbps * 1000;
    method = "selected video bitrate";
  } else {
    const bpp = bitsPerPixel(settings.crf, settings.videoCodec);
    videoBps = bpp * width * height * fps;
    method = `CRF ${settings.crf} bits-per-pixel heuristic`;
  }

  let audioBps = 0;
  if (settings.audioCodec === "none") audioBps = 0;
  else if (settings.audioCodec === "copy" && info.audioBitrateBps) audioBps = info.audioBitrateBps;
  else audioBps = settings.audioBitrateKbps * 1000;

  const bytes = Math.max(1024, Math.round(((videoBps + audioBps) * duration) / 8) + 64_000);
  const confidence: SizeEstimate["confidence"] =
    settings.rateControl === "bitrate" && settings.videoCodec !== "copy" ? "medium" : "low";

  return {
    bytes,
    label: "Estimated output size",
    confidence,
    method,
  };
}

function bitsPerPixel(crf: number, codec: CompressionSettings["videoCodec"]): number {
  const base = codec === "hevc" || codec === "av1" ? 0.06 : codec === "vp9" ? 0.07 : 0.1;
  return base * 2 ** ((23 - crf) / 6);
}

export function reductionPercent(original: number, output: number): number | null {
  if (!original || original <= 0) return null;
  return ((original - output) / original) * 100;
}
