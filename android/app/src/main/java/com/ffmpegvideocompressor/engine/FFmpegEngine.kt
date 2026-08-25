package com.ffmpegvideocompressor.engine

/**
 * Engine boundary. Compose / ViewModel never import JNI or FFmpeg headers.
 *
 * Web preview: WasmFFmpegEngine (TypeScript).
 * Android Studio: NativeFFmpegEngine wrapping official FFmpeg 9.0.1.
 */
interface FFmpegEngine {
    val id: String
    fun isAvailable(): Boolean
    fun version(): String?
    fun licenseNotice(): String
    suspend fun probe(inputPath: String): VideoInfo
    suspend fun run(
        command: BuiltCommand,
        onProgress: (ProcessingState.Running) -> Unit,
    ): ProcessingState.Completed
    fun cancel()
}

interface FFmpegProcessManagerApi {
    fun build(info: VideoInfo, settings: CompressionSettings, input: String, output: String): BuiltCommand
    suspend fun compress(
        info: VideoInfo,
        settings: CompressionSettings,
        input: String,
        output: String,
        onProgress: (ProcessingState.Running) -> Unit,
    ): ProcessingState.Completed
    fun cancel()
}
