package com.ffmpegvideocompressor.engine

data class VideoInfo(
    val filename: String,
    val sizeBytes: Long,
    val uri: String,
    val mimeType: String,
    val container: String?,
    val durationSec: Double?,
    val width: Int?,
    val height: Int?,
    val fps: Double?,
    val videoCodec: String?,
    val audioCodec: String?,
    val bitrateBps: Long?,
    val rotation: Int?,
)

enum class PresetId { INSTAGRAM_REELS, INSTAGRAM_STORY, HIGH_QUALITY, SMALL_FILE, CUSTOM }
enum class VideoCodecId { H264, HEVC, AV1, VP9, COPY }
enum class AudioCodecId { AAC, OPUS, COPY, NONE }
enum class ContainerId { MP4, MKV, WEBM }
enum class RateControl { CRF, BITRATE }
enum class ResolutionPreset { ORIGINAL, UHD_2160, QHD_1440, FHD_1080, HD_720, SD_480, CUSTOM }
enum class FpsPreset { ORIGINAL, FPS_60, FPS_30, FPS_24, CUSTOM }

data class CompressionSettings(
    val presetId: PresetId = PresetId.SMALL_FILE,
    val videoCodec: VideoCodecId = VideoCodecId.H264,
    val audioCodec: AudioCodecId = AudioCodecId.AAC,
    val container: ContainerId = ContainerId.MP4,
    val rateControl: RateControl = RateControl.CRF,
    val crf: Int = 23,
    val videoBitrateKbps: Int = 2500,
    val audioBitrateKbps: Int = 128,
    val encoderPreset: String = "medium",
    val resolution: ResolutionPreset = ResolutionPreset.HD_720,
    val customWidth: Int = 1920,
    val customHeight: Int = 1080,
    val fps: FpsPreset = FpsPreset.FPS_30,
    val customFps: Int = 30,
    val fitMode: String = "pad",
    val faststart: Boolean = true,
)

data class BuiltCommand(
    val args: List<String>,
    val inputPath: String,
    val outputPath: String,
    val warnings: List<String>,
)

sealed class ProcessingState {
    data object Idle : ProcessingState()
    data class Running(
        val stage: String,
        val progress: Float?,
        val elapsedMs: Long,
        val remainingMs: Long?,
        val message: String,
    ) : ProcessingState()
    data class Completed(
        val outputUri: String,
        val outputBytes: Long,
        val originalBytes: Long,
        val durationMs: Long,
    ) : ProcessingState()
    data class Failed(val userMessage: String, val diagnostic: String?) : ProcessingState()
    data object Cancelled : ProcessingState()
}

class CompressorException(
    val code: String,
    val userMessage: String,
    val diagnostic: String? = null,
) : Exception(userMessage)
