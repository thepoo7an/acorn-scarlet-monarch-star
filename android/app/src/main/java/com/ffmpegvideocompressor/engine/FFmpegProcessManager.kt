package com.ffmpegvideocompressor.engine

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class FFmpegProcessManager(
    private val engine: FFmpegEngine = NativeFFmpegEngine(),
    private val builder: FFmpegCommandBuilder = FFmpegCommandBuilder(),
) : FFmpegProcessManagerApi {

    @Volatile private var busy = false

    fun isBusy(): Boolean = busy

    override fun build(
        info: VideoInfo,
        settings: CompressionSettings,
        input: String,
        output: String,
    ): BuiltCommand = builder.build(info, settings, input, output)

    override suspend fun compress(
        info: VideoInfo,
        settings: CompressionSettings,
        input: String,
        output: String,
        onProgress: (ProcessingState.Running) -> Unit,
    ): ProcessingState.Completed = withContext(Dispatchers.IO) {
        if (busy) {
            throw CompressorException("INTERRUPTED", "Another job is already running.")
        }
        if (!engine.isAvailable()) {
            throw CompressorException(
                "ENGINE_UNAVAILABLE",
                engine.licenseNotice(),
                "FFmpegEngine.isAvailable() == false",
            )
        }
        busy = true
        try {
            val command = builder.build(info, settings, input, output)
            engine.run(command, onProgress)
        } finally {
            busy = false
        }
    }

    override fun cancel() {
        engine.cancel()
        busy = false
    }
}
