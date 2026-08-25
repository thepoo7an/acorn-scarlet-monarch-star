import type { EngineCapabilities, VideoInfo } from "./types";

interface FfprobeJson {
  format?: {
    filename?: string;
    format_name?: string;
    duration?: string;
    size?: string;
    bit_rate?: string;
  };
  streams?: Array<{
    codec_type?: string;
    codec_name?: string;
    width?: number;
    height?: number;
    avg_frame_rate?: string;
    r_frame_rate?: string;
    bit_rate?: string;
    sample_rate?: string;
    channels?: number;
    pix_fmt?: string;
    tags?: Record<string, string>;
    side_data_list?: Array<{ rotation?: number | string }>;
  }>;
}

export function parseFfprobeJson(raw: string, fallback: Partial<VideoInfo>): Partial<VideoInfo> {
  try {
    const json = JSON.parse(raw) as FfprobeJson;
    const format = json.format ?? {};
    const streams = json.streams ?? [];
    const video = streams.find((s) => s.codec_type === "video");
    const audio = streams.find((s) => s.codec_type === "audio");

    const duration = num(format.duration) ?? fallback.durationSec ?? null;
    const bitrate = num(format.bit_rate) ?? fallback.bitrateBps ?? null;
    const fps = parseRate(video?.avg_frame_rate) ?? parseRate(video?.r_frame_rate) ?? fallback.fps ?? null;
    const rotation =
      num(video?.tags?.rotate) ??
      num(video?.side_data_list?.[0]?.rotation) ??
      fallback.rotation ??
      null;

    return {
      container: format.format_name ?? fallback.container ?? null,
      durationSec: duration,
      width: video?.width ?? fallback.width ?? null,
      height: video?.height ?? fallback.height ?? null,
      fps,
      videoCodec: video?.codec_name ?? fallback.videoCodec ?? null,
      audioCodec: audio?.codec_name ?? fallback.audioCodec ?? null,
      bitrateBps: bitrate,
      videoBitrateBps: num(video?.bit_rate) ?? fallback.videoBitrateBps ?? null,
      audioBitrateBps: num(audio?.bit_rate) ?? fallback.audioBitrateBps ?? null,
      audioSampleRate: num(audio?.sample_rate) ?? fallback.audioSampleRate ?? null,
      audioChannels: audio?.channels ?? fallback.audioChannels ?? null,
      rotation,
      pixelFormat: video?.pix_fmt ?? fallback.pixelFormat ?? null,
    };
  } catch {
    return fallback;
  }
}

export function parseFfmpegBanner(logs: string[], fallback: Partial<VideoInfo>): Partial<VideoInfo> {
  const text = logs.join("\n");
  const durationMatch = text.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  let durationSec = fallback.durationSec ?? null;
  if (durationMatch) {
    durationSec =
      Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3]);
  }

  const bitrateMatch = text.match(/bitrate:\s*(\d+)\s*kb\/s/i);
  const bitrateBps = bitrateMatch ? Number(bitrateMatch[1]) * 1000 : (fallback.bitrateBps ?? null);

  const videoMatch = text.match(
    /Stream #0:\d+.*Video:\s*([a-zA-Z0-9_]+).*?,\s*(\d+)x(\d+)(?:.*?(?:(\d+(?:\.\d+)?)\s*fps))?/s,
  );
  const audioMatch = text.match(/Stream #0:\d+.*Audio:\s*([a-zA-Z0-9_]+)/);

  const inputMatch = text.match(/Input #\d+,\s*([^,]+),/);

  return {
    container: inputMatch?.[1]?.trim() ?? fallback.container ?? null,
    durationSec,
    bitrateBps,
    videoCodec: videoMatch?.[1] ?? fallback.videoCodec ?? null,
    width: videoMatch?.[2] ? Number(videoMatch[2]) : (fallback.width ?? null),
    height: videoMatch?.[3] ? Number(videoMatch[3]) : (fallback.height ?? null),
    fps: videoMatch?.[4] ? Number(videoMatch[4]) : (fallback.fps ?? null),
    audioCodec: audioMatch?.[1] ?? fallback.audioCodec ?? null,
  };
}

export function parseVersionAndEncoders(logs: string[]): EngineCapabilities {
  const text = logs.join("\n");
  const versionLine = text.split("\n").find((l) => /ffmpeg version/i.test(l)) ?? null;
  const versionMatch = versionLine?.match(/ffmpeg version\s+(\S+)/i);
  const configMatch = text.match(/configuration:\s*(.+)/);
  const configuration = configMatch?.[1]?.trim() ?? null;

  const videoEncoders: string[] = [];
  const audioEncoders: string[] = [];
  for (const line of logs) {
    const m = line.match(/^\s*([VAS][A-Z.]+)\s+([a-zA-Z0-9_-]+)\s+/);
    if (!m) continue;
    const flags = m[1] ?? "";
    const name = m[2] ?? "";
    if (!name || name === "=") continue;
    if (flags.startsWith("V")) videoEncoders.push(name);
    if (flags.startsWith("A")) audioEncoders.push(name);
  }

  const license: EngineCapabilities["license"] = configuration?.includes("--enable-gpl")
    ? "gpl"
    : configuration?.includes("--enable-version3")
      ? "lgpl"
      : versionLine?.toLowerCase().includes("gpl")
        ? "gpl"
        : "unknown";

  return {
    versionLine,
    ffmpegVersion: versionMatch?.[1] ?? null,
    configuration,
    license,
    videoEncoders: unique(videoEncoders),
    audioEncoders: unique(audioEncoders),
    hardwareAcceleration: false,
    threading: "single",
    source: "ffmpeg.wasm",
    notes: [
      "This preview engine is FFmpeg compiled to WebAssembly (ffmpeg.wasm).",
      "It is not FFmpeg 9.0.1. Native Android integration targets official FFmpeg 9.0.1.",
      "No hardware acceleration is used in the browser engine.",
    ],
  };
}

export function classifyLogStage(line: string): string | null {
  const l = line.toLowerCase();
  if (l.includes("opening") || l.startsWith("input #")) return "Opening input";
  if (l.includes("stream mapping")) return "Mapping streams";
  if (l.includes("press [q]")) return "Encoding";
  if (l.includes("error") || l.includes("failed")) return "Encoder reported an issue";
  if (l.startsWith("frame=") || l.includes("time=")) return "Encoding frames";
  if (l.includes("muxing") || l.includes("header")) return "Writing container";
  return null;
}

function num(v: string | number | undefined | null): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseRate(rate: string | undefined): number | null {
  if (!rate || rate === "0/0") return null;
  if (rate.includes("/")) {
    const [a, b] = rate.split("/").map(Number);
    if (!a || !b) return null;
    return a / b;
  }
  const n = Number(rate);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function unique(list: string[]): string[] {
  return [...new Set(list)];
}
