import { processManager } from "./process-manager";
import { parseFfmpegBanner, parseFfprobeJson } from "./parse-probe";
import type { VideoInfo } from "./types";

export async function extractBrowserMetadata(file: File): Promise<VideoInfo> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;
  video.src = objectUrl;

  const loaded = new Promise<void>((resolve, reject) => {
    const onErr = () => reject(new Error("metadata"));
    video.addEventListener("loadedmetadata", () => resolve(), { once: true });
    video.addEventListener("error", onErr, { once: true });
    setTimeout(() => resolve(), 4000);
  });

  let width: number | null = null;
  let height: number | null = null;
  let durationSec: number | null = null;
  let thumbnailUrl: string | null = null;

  try {
    await loaded;
    if (video.videoWidth) width = video.videoWidth;
    if (video.videoHeight) height = video.videoHeight;
    if (Number.isFinite(video.duration) && video.duration > 0) durationSec = video.duration;
    thumbnailUrl = await captureThumbnail(video);
  } catch {
    /* browser cannot decode this container; FFmpeg may still read it */
  } finally {
    video.src = "";
    URL.revokeObjectURL(objectUrl);
  }

  return {
    filename: file.name,
    sizeBytes: file.size,
    mimeType: file.type || "application/octet-stream",
    container: containerFromName(file.name, file.type),
    durationSec,
    width,
    height,
    fps: null,
    videoCodec: null,
    audioCodec: null,
    bitrateBps: durationSec ? Math.round((file.size * 8) / durationSec) : null,
    videoBitrateBps: null,
    audioBitrateBps: null,
    audioSampleRate: null,
    audioChannels: null,
    rotation: null,
    pixelFormat: null,
    thumbnailUrl,
  };
}

export async function enrichWithFFmpeg(file: File, base: VideoInfo): Promise<VideoInfo> {
  try {
    await processManager.ensureLoaded();
    const inputName = `probe_${Math.random().toString(36).slice(2, 8)}.${ext(file.name) || "mp4"}`;
    const { info, raw } = await processManager.getEngine().probe(file, inputName);
    const fromJson = raw.trim().startsWith("{") ? parseFfprobeJson(raw, base) : {};
    const fromBanner = raw.trim().startsWith("{") ? {} : parseFfmpegBanner(raw.split("\n"), base);
    return {
      ...base,
      ...fromBanner,
      ...fromJson,
      filename: base.filename,
      sizeBytes: base.sizeBytes,
      mimeType: base.mimeType,
      thumbnailUrl: base.thumbnailUrl,
    };
  } catch {
    return base;
  }
}

async function captureThumbnail(video: HTMLVideoElement): Promise<string | null> {
  try {
    if (!video.videoWidth || !video.videoHeight) return null;
    const t = Number.isFinite(video.duration) && video.duration > 0 ? Math.min(1, video.duration * 0.12) : 0;
    if (t > 0) {
      video.currentTime = t;
      await new Promise<void>((resolve) => {
        video.addEventListener("seeked", () => resolve(), { once: true });
        setTimeout(() => resolve(), 1200);
      });
    }
    const canvas = document.createElement("canvas");
    const max = 640;
    const scale = Math.min(1, max / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return null;
  }
}

function containerFromName(name: string, mime: string): string | null {
  const extn = ext(name);
  if (extn) return extn;
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("webm")) return "webm";
  if (mime.includes("quicktime")) return "mov";
  if (mime.includes("matroska")) return "mkv";
  return null;
}

function ext(name: string): string | null {
  const i = name.lastIndexOf(".");
  if (i <= 0) return null;
  return name.slice(i + 1).toLowerCase();
}
