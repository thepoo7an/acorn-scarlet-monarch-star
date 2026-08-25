import { FFmpegCommandBuilder } from "./command-builder";
import type { FFmpegEngine } from "./engine";
import { CompressorError, toCompressorError } from "./errors";
import { fileSizeWarning, WasmFFmpegEngine } from "./wasm-engine";
import type {
  BuiltCommand,
  CompressionResult,
  CompressionSettings,
  EngineCapabilities,
  ProcessingProgress,
  VideoInfo,
} from "./types";

/**
 * Owns engine lifecycle, cancellation, and temp-file cleanup.
 * UI never talks to ffmpeg.wasm directly.
 */
export class FFmpegProcessManager {
  private engine: FFmpegEngine;
  private abort: AbortController | null = null;
  private running = false;
  private readonly builder = new FFmpegCommandBuilder();

  constructor(engine?: FFmpegEngine) {
    this.engine = engine ?? new WasmFFmpegEngine();
  }

  getEngine(): FFmpegEngine {
    return this.engine;
  }

  isBusy(): boolean {
    return this.running;
  }

  async ensureLoaded(onStatus?: (message: string) => void): Promise<EngineCapabilities> {
    return this.engine.load(onStatus);
  }

  capabilities(): EngineCapabilities | null {
    return this.engine.capabilities();
  }

  buildCommand(info: VideoInfo, settings: CompressionSettings): BuiltCommand {
    return this.builder.build(info, settings, this.engine.capabilities());
  }

  async compress(
    file: File,
    info: VideoInfo,
    settings: CompressionSettings,
    onProgress: (p: ProcessingProgress) => void,
  ): Promise<CompressionResult> {
    if (this.running) {
      throw new CompressorError("INTERRUPTED", "Another compression job is already running.");
    }

    const warning = fileSizeWarning(file.size);
    if (warning) {
      onProgress({
        stage: "loading-engine",
        ratio: null,
        frameTimeSec: null,
        elapsedMs: 0,
        remainingMs: null,
        message: warning,
        logLine: null,
      });
    }

    this.running = true;
    this.abort = new AbortController();
    const signal = this.abort.signal;

    try {
      onProgress({
        stage: "loading-engine",
        ratio: 0,
        frameTimeSec: null,
        elapsedMs: 0,
        remainingMs: null,
        message: "Preparing FFmpeg…",
        logLine: null,
      });
      await this.engine.load((message) => {
        onProgress({
          stage: "loading-engine",
          ratio: 0,
          frameTimeSec: null,
          elapsedMs: 0,
          remainingMs: null,
          message,
          logLine: null,
        });
      });

      const command = this.buildCommand(info, settings);
      return await this.engine.run({
        file,
        info,
        settings,
        command,
        signal,
        onProgress,
      });
    } catch (error) {
      throw toCompressorError(error);
    } finally {
      this.running = false;
      this.abort = null;
    }
  }

  async cancel(): Promise<void> {
    this.abort?.abort();
    await this.engine.cancel();
    this.running = false;
    this.abort = null;
  }
}

export const processManager = new FFmpegProcessManager();
