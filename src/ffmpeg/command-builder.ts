import { CompressorError } from "./errors";
import type { EngineCapabilities } from "./types";
import {
  CONTAINER_EXTENSION,
  RESOLUTION_HEIGHT,
  type BuiltCommand,
  type CompressionSettings,
  type ContainerId,
  type VideoCodecId,
  type VideoInfo,
} from "./types";

const SAFE_INPUT = "source_input";
const SAFE_OUTPUT = "source_output";

const ENCODER_FOR_CODEC: Record<Exclude<VideoCodecId, "copy">, string[]> = {
  h264: ["libx264", "h264"],
  hevc: ["libx265", "hevc"],
  av1: ["libaom-av1", "librav1e", "libsvtav1", "av1"],
  vp9: ["libvpx-vp9", "vp9"],
};

const AUDIO_ENCODER: Record<"aac" | "opus", string[]> = {
  aac: ["aac", "libfdk_aac"],
  opus: ["libopus", "opus"],
};

export class FFmpegCommandBuilder {
  build(
    info: VideoInfo,
    settings: CompressionSettings,
    capabilities: EngineCapabilities | null,
  ): BuiltCommand {
    const warnings: string[] = [];
    const summary: string[] = [];
    const inputExt = extensionOf(info.filename) || guessExt(info.container) || "mp4";
    const inputName = `${SAFE_INPUT}.${inputExt}`;
    const outputName = `${SAFE_OUTPUT}.${CONTAINER_EXTENSION[settings.container]}`;

    this.validateCombination(settings, warnings);
    this.validateCapabilities(settings, capabilities, warnings);

    const args: string[] = ["-hide_banner", "-i", inputName];

    const videoArgs = this.videoArgs(info, settings, capabilities, warnings, summary);
    args.push(...videoArgs);

    const audioArgs = this.audioArgs(settings, capabilities, warnings, summary);
    args.push(...audioArgs);

    if (settings.container === "mp4" && settings.faststart && settings.videoCodec !== "copy") {
      args.push("-movflags", "+faststart");
      summary.push("Fast-start MP4 for quicker playback");
    }

    if (settings.container === "mp4") {
      args.push("-pix_fmt", "yuv420p");
    }

    args.push(outputName);

    this.assertValid(args, settings);

    return { args, inputName, outputName, summary, warnings };
  }

  private videoArgs(
    info: VideoInfo,
    settings: CompressionSettings,
    capabilities: EngineCapabilities | null,
    warnings: string[],
    summary: string[],
  ): string[] {
    const args: string[] = [];
    const encoder = pickVideoEncoder(settings.videoCodec, capabilities);

    if (settings.videoCodec === "copy") {
      args.push("-c:v", "copy");
      summary.push("Video stream copied (no re-encode)");
      if (settings.resolution !== "original" || settings.fps !== "original") {
        warnings.push("Stream copy ignores resolution and FPS changes. Switch off Copy to resize or change frame rate.");
      }
      return args;
    }

    if (!encoder) {
      throw new CompressorError(
        "UNSUPPORTED_CODEC",
        `${labelCodec(settings.videoCodec)} encoding is not available in this FFmpeg build.`,
        `Requested ${settings.videoCodec}; available: ${capabilities?.videoEncoders.join(", ") ?? "unknown"}`,
      );
    }

    args.push("-c:v", encoder);
    summary.push(`Video codec ${labelCodec(settings.videoCodec)} (${encoder})`);

    const vf = this.scaleFilter(info, settings);
    if (vf) {
      args.push("-vf", vf);
      summary.push(`Scale filter: ${vf}`);
    }

    const fps = targetFps(info, settings);
    if (fps) {
      args.push("-r", String(fps));
      summary.push(`${fps} FPS`);
    } else {
      summary.push("Original frame rate");
    }

    if (settings.rateControl === "bitrate") {
      const kbps = clamp(settings.videoBitrateKbps, 100, 100_000);
      args.push("-b:v", `${kbps}k`);
      args.push("-maxrate", `${Math.round(kbps * 1.4)}k`);
      args.push("-bufsize", `${Math.round(kbps * 2)}k`);
      summary.push(`Video bitrate ${kbps} kbps`);
    } else {
      const crf = clamp(settings.crf, 0, 51);
      if (encoder === "libaom-av1") {
        args.push("-crf", String(crf), "-b:v", "0", "-cpu-used", "6");
      } else if (encoder === "libvpx-vp9") {
        args.push("-crf", String(crf), "-b:v", "0", "-row-mt", "1");
      } else if (encoder === "libx265") {
        args.push("-crf", String(crf), "-preset", settings.encoderPreset, "-tag:v", "hvc1");
        args.push("-x265-params", "log-level=error");
      } else {
        args.push("-crf", String(crf), "-preset", settings.encoderPreset);
        args.push("-profile:v", "high");
      }
      summary.push(`CRF ${crf}, preset ${settings.encoderPreset}`);
    }

    return args;
  }

  private audioArgs(
    settings: CompressionSettings,
    capabilities: EngineCapabilities | null,
    warnings: string[],
    summary: string[],
  ): string[] {
    if (settings.audioCodec === "none") {
      summary.push("Audio disabled");
      return ["-an"];
    }
    if (settings.audioCodec === "copy") {
      summary.push("Audio stream copied");
      return ["-c:a", "copy"];
    }

    const encoder = pickAudioEncoder(settings.audioCodec, capabilities);
    if (!encoder) {
      warnings.push(
        `${settings.audioCodec.toUpperCase()} is not in this build. Audio will be disabled if encoding fails; AAC is the usual fallback.`,
      );
      if (capabilities?.audioEncoders.includes("aac")) {
        summary.push("Audio AAC (fallback)");
        return ["-c:a", "aac", "-b:a", `${clamp(settings.audioBitrateKbps, 32, 512)}k`];
      }
      throw new CompressorError(
        "UNSUPPORTED_CODEC",
        "No compatible audio encoder is available in this FFmpeg build.",
        capabilities?.audioEncoders.join(", ") ?? "none",
      );
    }

    const args = ["-c:a", encoder, "-b:a", `${clamp(settings.audioBitrateKbps, 32, 512)}k`];
    if (settings.audioSampleRate !== "original") {
      args.push("-ar", String(settings.audioSampleRate));
    }
    summary.push(`Audio ${settings.audioCodec.toUpperCase()} ${settings.audioBitrateKbps} kbps`);
    return args;
  }

  private scaleFilter(info: VideoInfo, settings: CompressionSettings): string | null {
    const target = targetSize(info, settings);
    if (!target) return null;
    const { width, height } = target;
    const evenW = even(width);
    const evenH = even(height);

    if (settings.fitMode === "stretch") {
      return `scale=${evenW}:${evenH}:flags=lanczos,setsar=1`;
    }
    if (settings.fitMode === "crop") {
      return `scale=${evenW}:${evenH}:force_original_aspect_ratio=increase:flags=lanczos,crop=${evenW}:${evenH},setsar=1`;
    }
    return `scale=${evenW}:${evenH}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${evenW}:${evenH}:(ow-iw)/2:(oh-ih)/2,setsar=1`;
  }

  private validateCombination(settings: CompressionSettings, warnings: string[]) {
    const { videoCodec, audioCodec, container } = settings;

    if (container === "webm" && (videoCodec === "h264" || videoCodec === "hevc")) {
      throw new CompressorError(
        "UNSUPPORTED_CONTAINER",
        "WebM cannot hold H.264 or HEVC. Use VP9 or AV1, or switch the container to MP4 or MKV.",
      );
    }
    if (container === "webm" && audioCodec === "aac") {
      throw new CompressorError(
        "UNSUPPORTED_CONTAINER",
        "WebM does not support AAC audio. Choose Opus, or switch to MP4 / MKV.",
      );
    }
    if (container === "mp4" && audioCodec === "opus") {
      warnings.push("Opus in MP4 is less compatible with some players. AAC is safer for MP4.");
    }
    if (videoCodec === "copy" && container === "webm") {
      warnings.push("Copying into WebM only works if the source is already VP8, VP9, or AV1.");
    }
  }

  private validateCapabilities(
    settings: CompressionSettings,
    capabilities: EngineCapabilities | null,
    warnings: string[],
  ) {
    if (!capabilities) return;
    if (settings.videoCodec !== "copy") {
      const encoder = pickVideoEncoder(settings.videoCodec, capabilities);
      if (!encoder) {
        throw new CompressorError(
          "UNSUPPORTED_CODEC",
          `${labelCodec(settings.videoCodec)} is not included in the loaded FFmpeg build.`,
          capabilities.videoEncoders.join(", "),
        );
      }
    }
    if (capabilities.hardwareAcceleration) {
      warnings.push("Hardware acceleration is reported as available.");
    }
  }

  private assertValid(args: string[], settings: CompressionSettings) {
    if (args.length < 5) {
      throw new CompressorError("COMMAND_INVALID", "The FFmpeg command was empty and was not started.");
    }
    if (!args.includes("-i")) {
      throw new CompressorError("COMMAND_INVALID", "The FFmpeg command is missing an input file.");
    }
    const dangerous = args.some((a) => a === "-f" && false);
    void dangerous;
    void settings;
    if (args.some((a) => a.includes("..") || a.startsWith("/"))) {
      throw new CompressorError("COMMAND_INVALID", "The FFmpeg command contained an unsafe path and was blocked.");
    }
  }
}

export function pickVideoEncoder(
  codec: VideoCodecId,
  capabilities: EngineCapabilities | null,
): string | null {
  if (codec === "copy") return "copy";
  const candidates = ENCODER_FOR_CODEC[codec];
  if (!capabilities || capabilities.videoEncoders.length === 0) return candidates[0] ?? null;
  return candidates.find((c) => capabilities.videoEncoders.includes(c)) ?? null;
}

function pickAudioEncoder(
  codec: "aac" | "opus",
  capabilities: EngineCapabilities | null,
): string | null {
  const candidates = AUDIO_ENCODER[codec];
  if (!capabilities || capabilities.audioEncoders.length === 0) return candidates[0] ?? null;
  return candidates.find((c) => capabilities.audioEncoders.includes(c)) ?? null;
}

export function targetSize(
  info: VideoInfo,
  settings: CompressionSettings,
): { width: number; height: number } | null {
  const srcW = info.width;
  const srcH = info.height;
  if (settings.resolution === "original") return null;
  if (settings.resolution === "custom") {
    return { width: even(settings.customWidth), height: even(settings.customHeight) };
  }
  const targetH = RESOLUTION_HEIGHT[settings.resolution];
  if (!srcW || !srcH) {
    const targetW = Math.round((targetH * 16) / 9);
    return { width: even(targetW), height: even(targetH) };
  }
  if (srcH <= targetH && srcW <= Math.round((targetH * srcW) / srcH)) {
    return null;
  }
  const scale = targetH / srcH;
  return { width: even(Math.round(srcW * scale)), height: even(targetH) };
}

export function targetFps(info: VideoInfo, settings: CompressionSettings): number | null {
  if (settings.fps === "original") return null;
  if (settings.fps === "custom") return settings.customFps;
  return Number(settings.fps);
}

function extensionOf(name: string): string | null {
  const i = name.lastIndexOf(".");
  if (i <= 0) return null;
  return name.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, "") || null;
}

function guessExt(container: string | null): string | null {
  if (!container) return null;
  const c = container.toLowerCase();
  if (c.includes("mp4") || c.includes("mov") || c.includes("isom") || c.includes("m4v")) return "mp4";
  if (c.includes("webm")) return "webm";
  if (c.includes("matroska") || c.includes("mkv")) return "mkv";
  if (c.includes("avi")) return "avi";
  if (c.includes("quicktime")) return "mov";
  return null;
}

function even(n: number): number {
  const v = Math.max(2, Math.round(n));
  return v % 2 === 0 ? v : v + 1;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function labelCodec(id: VideoCodecId): string {
  if (id === "h264") return "H.264";
  if (id === "hevc") return "H.265 / HEVC";
  if (id === "av1") return "AV1";
  if (id === "vp9") return "VP9";
  return "Copy";
}

export function commandToString(args: string[]): string {
  return ["ffmpeg", ...args.map((a) => (/\s/.test(a) ? `'${a}'` : a))].join(" ");
}

export function suggestedFilename(original: string, container: ContainerId): string {
  const base = original.replace(/\.[^.]+$/, "") || "video";
  return `${base}-compressed.${CONTAINER_EXTENSION[container]}`;
}
