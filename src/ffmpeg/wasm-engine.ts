import { toBlobURL } from "@ffmpeg/util";
import { FFmpegCommandBuilder, suggestedFilename } from "./command-builder";
import type { FFmpegEngine, ProbeResult, RunJob } from "./engine";
import { CompressorError, toCompressorError } from "./errors";
import { reductionPercent } from "./estimate";
import { parseFfprobeJson, parseFfmpegBanner, parseVersionAndEncoders } from "./parse-probe";
import type {
  EngineCapabilities,
  ProcessingProgress,
  ProcessingStage,
  VideoInfo,
} from "./types";

type FFmpegInstance = {
  loaded: boolean;
  on(event: "log" | "progress", cb: (data: { message?: string; progress?: number; time?: number }) => void): void;
  off(event: "log" | "progress", cb: (data: { message?: string; progress?: number; time?: number }) => void): void;
  load(config: { coreURL: string; wasmURL: string }, opts?: { signal?: AbortSignal }): Promise<boolean>;
  exec(args: string[], timeout?: number, opts?: { signal?: AbortSignal }): Promise<number>;
  ffprobe(args: string[], timeout?: number, opts?: { signal?: AbortSignal }): Promise<number>;
  writeFile(path: string, data: Uint8Array): Promise<boolean>;
  readFile(path: string): Promise<Uint8Array | string>;
  deleteFile(path: string): Promise<boolean>;
  terminate(): void;
};

const MAX_BROWSER_BYTES = 1_200_000_000;
const WARN_BROWSER_BYTES = 400_000_000;

export class WasmFFmpegEngine implements FFmpegEngine {
  readonly id = "ffmpeg.wasm";
  private ffmpeg: FFmpegInstance | null = null;
  private caps: EngineCapabilities | null = null;
  private loading: Promise<EngineCapabilities> | null = null;
  private cancelled = false;

  capabilities(): EngineCapabilities | null {
    return this.caps;
  }

  isReady(): boolean {
    return Boolean(this.ffmpeg?.loaded && this.caps);
  }

  async load(onStatus?: (message: string) => void): Promise<EngineCapabilities> {
    if (this.caps && this.ffmpeg?.loaded) return this.caps;
    if (this.loading) return this.loading;
    this.loading = this.loadInternal(onStatus);
    try {
      return await this.loading;
    } finally {
      this.loading = null;
    }
  }

  private async loadInternal(onStatus?: (message: string) => void): Promise<EngineCapabilities> {
    if (typeof window === "undefined") {
      throw new CompressorError(
        "ENGINE_UNAVAILABLE",
        "FFmpeg can only run in the browser in this preview.",
      );
    }

    onStatus?.("Loading FFmpeg WebAssembly core…");
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const ffmpeg = new FFmpeg() as unknown as FFmpegInstance;
      const base = `${window.location.origin}/ffmpeg`;
      const coreURL = await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript");
      const wasmURL = await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm");
      onStatus?.("Initializing FFmpeg worker…");
      await ffmpeg.load({ coreURL, wasmURL });
      this.ffmpeg = ffmpeg;

      onStatus?.("Reading encoder list…");
      const logs: string[] = [];
      const onLog = ({ message }: { message?: string }) => {
        if (message) logs.push(message);
      };
      ffmpeg.on("log", onLog);
      await ffmpeg.exec(["-hide_banner", "-version"]);
      await ffmpeg.exec(["-hide_banner", "-encoders"]);
      ffmpeg.off("log", onLog);

      const caps = parseVersionAndEncoders(logs);
      caps.source = "ffmpeg.wasm";
      caps.threading = "single";
      caps.hardwareAcceleration = false;
      if (!caps.ffmpegVersion) {
        caps.ffmpegVersion = "unknown (ffmpeg.wasm core)";
      }
      caps.notes = [
        `Loaded engine reports: ${caps.versionLine ?? "ffmpeg.wasm"}`,
        "Official latest stable FFmpeg is 9.0.1 (12 Aug 2026). This WebAssembly core is an older FFmpeg, not 9.0.1.",
        "Native Android integration (see android/) must compile FFmpeg 9.0.1 from official source.",
        "No hardware acceleration is used here.",
        caps.license === "gpl"
          ? "This WASM core is GPL-licensed because it includes GPL encoders such as x264."
          : "Confirm the FFmpeg license before shipping a store build.",
      ];
      this.caps = caps;
      return caps;
    } catch (error) {
      this.ffmpeg = null;
      this.caps = null;
      throw new CompressorError(
        "ENGINE_LOAD_FAILED",
        "The FFmpeg engine failed to load. Refresh and try again.",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async probe(file: File, inputName: string, signal?: AbortSignal): Promise<ProbeResult> {
    const ffmpeg = await this.requireReady();
    this.assertSize(file.size);
    const data = new Uint8Array(await file.arrayBuffer());
    if (signal?.aborted) throw new CompressorError("CANCELLED", "Cancelled.");
    await ffmpeg.writeFile(inputName, data);

    const logs: string[] = [];
    const onLog = ({ message }: { message?: string }) => {
      if (message) logs.push(message);
    };
    ffmpeg.on("log", onLog);

    let raw = "";
    try {
      const code = await ffmpeg.ffprobe(
        [
          "-v",
          "error",
          "-print_format",
          "json",
          "-show_format",
          "-show_streams",
          inputName,
          "-o",
          "probe.json",
        ],
        undefined,
        signal ? { signal } : undefined,
      );
      if (code === 0) {
        const out = await ffmpeg.readFile("probe.json");
        raw = typeof out === "string" ? out : new TextDecoder().decode(out);
        await safeDelete(ffmpeg, "probe.json");
      }
    } catch {
      raw = "";
    }

    if (!raw) {
      await ffmpeg.exec(["-hide_banner", "-i", inputName], undefined, signal ? { signal } : undefined);
      raw = logs.join("\n");
    }

    ffmpeg.off("log", onLog);
    await safeDelete(ffmpeg, inputName);

    const info = raw.trim().startsWith("{")
      ? parseFfprobeJson(raw, { filename: file.name, sizeBytes: file.size })
      : parseFfmpegBanner(raw.split("\n"), { filename: file.name, sizeBytes: file.size });

    return { info, raw };
  }

  async run(job: RunJob): Promise<import("./types").CompressionResult> {
    this.cancelled = false;
    this.assertSize(job.file.size);
    const ffmpeg = await this.requireReady();
    const started = performance.now();
    const { command, file, settings, info, signal } = job;

    const emit = (stage: ProcessingStage, ratio: number | null, message: string, extra?: Partial<ProcessingProgress>) => {
      const elapsedMs = performance.now() - started;
      const remainingMs =
        ratio && ratio > 0.03 && ratio < 1 ? Math.round((elapsedMs / ratio) * (1 - ratio)) : null;
      job.onProgress({
        stage,
        ratio,
        frameTimeSec: extra?.frameTimeSec ?? null,
        elapsedMs,
        remainingMs,
        message,
        logLine: extra?.logLine ?? null,
      });
    };

    if (signal.aborted || this.cancelled) {
      throw new CompressorError("CANCELLED", "Compression was cancelled.");
    }

    emit("writing-input", 0, "Copying video into the FFmpeg workspace…");
    const bytes = new Uint8Array(await file.arrayBuffer());
    await ffmpeg.writeFile(command.inputName, bytes);

    const onLog = ({ message }: { message?: string }) => {
      if (!message) return;
      emit("encoding", null, "Encoding with FFmpeg…", { logLine: message });
    };
    const onProgress = ({ progress, time }: { progress?: number; time?: number }) => {
      const ratio = typeof progress === "number" ? Math.min(0.99, Math.max(0, progress)) : null;
      emit("encoding", ratio, "Encoding with FFmpeg…", {
        frameTimeSec: typeof time === "number" ? time / 1_000_000 : null,
      });
    };

    ffmpeg.on("log", onLog);
    ffmpeg.on("progress", onProgress);

    try {
      emit("encoding", 0.01, "Starting FFmpeg…");
      const code = await ffmpeg.exec(command.args, undefined, { signal });
      if (this.cancelled || signal.aborted) {
        throw new CompressorError("CANCELLED", "Compression was cancelled.");
      }
      if (code !== 0) {
        throw new CompressorError(
          "EXECUTION_FAILED",
          "FFmpeg could not compress this video with the current settings.",
          `ffmpeg exited with code ${code}`,
        );
      }

      emit("reading-output", 0.99, "Reading compressed file…");
      const output = await ffmpeg.readFile(command.outputName);
      if (typeof output === "string") {
        throw new CompressorError("OUTPUT_FAILED", "The compressed file could not be read.");
      }
      const copy = new Uint8Array(output);
      const blob = new Blob([copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.byteLength)], {
        type: mimeFor(settings.container),
      });
      const filename = suggestedFilename(file.name, settings.container);
      const durationMs = performance.now() - started;

      emit("finalizing", 1, "Cleaning up temporary files…");
      await safeDelete(ffmpeg, command.inputName);
      await safeDelete(ffmpeg, command.outputName);

      emit("completed", 1, "Compression finished.");
      return {
        blob,
        filename,
        sizeBytes: blob.size,
        originalSizeBytes: info.sizeBytes,
        reductionPercent: reductionPercent(info.sizeBytes, blob.size),
        durationMs,
        settings,
        command: command.args,
        outputCodec: settings.videoCodec,
        outputContainer: settings.container,
      };
    } catch (error) {
      await safeDelete(ffmpeg, command.inputName);
      await safeDelete(ffmpeg, command.outputName);
      throw toCompressorError(error);
    } finally {
      ffmpeg.off("log", onLog);
      ffmpeg.off("progress", onProgress);
    }
  }

  async cancel(): Promise<void> {
    this.cancelled = true;
    this.ffmpeg?.terminate();
    this.ffmpeg = null;
    this.caps = null;
  }

  async dispose(): Promise<void> {
    this.ffmpeg?.terminate();
    this.ffmpeg = null;
    this.caps = null;
  }

  private async requireReady(): Promise<FFmpegInstance> {
    if (!this.ffmpeg?.loaded) await this.load();
    if (!this.ffmpeg) {
      throw new CompressorError("ENGINE_UNAVAILABLE", "FFmpeg is not ready.");
    }
    return this.ffmpeg;
  }

  private assertSize(size: number) {
    if (size > MAX_BROWSER_BYTES) {
      throw new CompressorError(
        "FILE_TOO_LARGE",
        "This file is too large for in-browser FFmpeg (about 1.2 GB limit). Use a smaller video, or the native Android build with FFmpeg 9.0.1.",
      );
    }
  }
}

export function fileSizeWarning(size: number): string | null {
  if (size > WARN_BROWSER_BYTES) {
    return "Large files are slow in the browser engine and may run out of memory. The native Android FFmpeg 9.0.1 build handles big files better.";
  }
  return null;
}

async function safeDelete(ffmpeg: FFmpegInstance, path: string) {
  try {
    await ffmpeg.deleteFile(path);
  } catch {
    /* MEMFS entry may already be gone after terminate */
  }
}

function mimeFor(container: string): string {
  if (container === "webm") return "video/webm";
  if (container === "mkv") return "video/x-matroska";
  return "video/mp4";
}

export { FFmpegCommandBuilder };
