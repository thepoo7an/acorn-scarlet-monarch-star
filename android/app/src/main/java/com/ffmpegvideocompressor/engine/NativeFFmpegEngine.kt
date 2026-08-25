package com.ffmpegvideocompressor.engine

/**
 * STUB — replace after compiling official FFmpeg 9.0.1 with the NDK.
 *
 * This class must not report success, fake progress, or claim version 9.0.1
 * until `System.loadLibrary` succeeds and `nativeVersion()` returns the
 * string from the linked binary.
 *
 * See android/NATIVE_INTEGRATION.md.
 */
class NativeFFmpegEngine : FFmpegEngine {
    override val id: String = "native-ffmpeg-9.0.1"

    override fun isAvailable(): Boolean = false

    override fun version(): String? = null

    override fun licenseNotice(): String =
        "FFmpeg 9.0.1 is not packaged in this build. Compile official source " +
            "(https://ffmpeg.org/releases/ffmpeg-9.0.1.tar.xz) with the Android NDK. " +
            "Default script is LGPL (MediaCodec). Enabling libx264 requires GPL review."

    override suspend fun probe(inputPath: String): VideoInfo {
        throw CompressorException(
            "ENGINE_UNAVAILABLE",
            "Native FFmpeg 9.0.1 is not linked in this build.",
            "NativeFFmpegEngine.probe() called before NDK integration.",
        )
    }

    override suspend fun run(
        command: BuiltCommand,
        onProgress: (ProcessingState.Running) -> Unit,
    ): ProcessingState.Completed {
        throw CompressorException(
            "ENGINE_UNAVAILABLE",
            "Cannot compress: FFmpeg 9.0.1 is not packaged. Open this project in Android Studio, run native/build-ffmpeg.sh, and implement JNI in native-lib.cpp.",
            command.args.joinToString(" "),
        )
    }

    override fun cancel() {
        // JNI: ffmpegCancel(handle) then delete temp files in cacheDir.
    }

    companion object {
        // Uncomment after libffmpeg_compressor.so exists:
        // init { System.loadLibrary("ffmpeg_compressor") }
        // @JvmStatic private external fun nativeVersion(): String
        // @JvmStatic private external fun nativeExecute(args: Array<String>): Int
        // @JvmStatic private external fun nativeCancel()
    }
}
