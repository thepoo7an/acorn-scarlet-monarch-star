export type CompressorErrorCode =
  | "ENGINE_UNAVAILABLE"
  | "ENGINE_LOAD_FAILED"
  | "UNSUPPORTED_CODEC"
  | "UNSUPPORTED_CONTAINER"
  | "INVALID_VIDEO"
  | "CORRUPTED_VIDEO"
  | "INSUFFICIENT_STORAGE"
  | "FILE_TOO_LARGE"
  | "PERMISSION_DENIED"
  | "CANCELLED"
  | "INTERRUPTED"
  | "OUTPUT_FAILED"
  | "COMMAND_INVALID"
  | "EXECUTION_FAILED"
  | "PROBE_FAILED";

export class CompressorError extends Error {
  readonly code: CompressorErrorCode;
  readonly diagnostic: string | null;
  readonly userMessage: string;

  constructor(code: CompressorErrorCode, userMessage: string, diagnostic?: string) {
    super(userMessage);
    this.name = "CompressorError";
    this.code = code;
    this.userMessage = userMessage;
    this.diagnostic = diagnostic ?? null;
  }
}

export function toCompressorError(error: unknown): CompressorError {
  if (error instanceof CompressorError) return error;
  if (error instanceof DOMException && error.name === "AbortError") {
    return new CompressorError("CANCELLED", "Compression was cancelled.", error.message);
  }
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  if (lower.includes("memory") || lower.includes("enomem")) {
    return new CompressorError(
      "INSUFFICIENT_STORAGE",
      "This device ran out of memory while processing the video. Try a smaller file or a lower resolution.",
      message,
    );
  }
  if (lower.includes("permission")) {
    return new CompressorError(
      "PERMISSION_DENIED",
      "Permission to read or save the file was denied.",
      message,
    );
  }
  return new CompressorError(
    "EXECUTION_FAILED",
    "Video processing failed. The file may use an unsupported codec, or the selected settings may be incompatible.",
    message,
  );
}

export const ERROR_COPY: Record<CompressorErrorCode, string> = {
  ENGINE_UNAVAILABLE:
    "The FFmpeg engine is not available in this environment. Processing cannot start.",
  ENGINE_LOAD_FAILED:
    "The FFmpeg engine could not be loaded. Check your connection and try again.",
  UNSUPPORTED_CODEC:
    "That codec is not included in this FFmpeg build. Choose another codec or container.",
  UNSUPPORTED_CONTAINER:
    "That container is not compatible with the selected codecs. The app will suggest a valid combination.",
  INVALID_VIDEO: "This file does not appear to be a readable video.",
  CORRUPTED_VIDEO: "The video file looks damaged and could not be read completely.",
  INSUFFICIENT_STORAGE: "There is not enough memory or disk space to finish this job.",
  FILE_TOO_LARGE:
    "This file is too large for in-browser FFmpeg. Use a smaller video, or the native Android build with FFmpeg 9.0.1.",
  PERMISSION_DENIED: "Permission to access the file was denied.",
  CANCELLED: "Compression was cancelled.",
  INTERRUPTED: "Processing was interrupted before it finished.",
  OUTPUT_FAILED: "The compressed file could not be created or saved.",
  COMMAND_INVALID: "The generated FFmpeg command failed validation and was not run.",
  EXECUTION_FAILED: "FFmpeg could not complete this job with the current settings.",
  PROBE_FAILED: "Video details could not be read. You can still try compressing the file.",
};
