package com.ffmpegvideocompressor.engine

data class CompressionProfile(
    val id: PresetId,
    val name: String,
    val tagline: String,
    val description: String,
    val settings: CompressionSettings,
)

object CompressionProfiles {
    val all: List<CompressionProfile> = listOf(
        CompressionProfile(
            PresetId.INSTAGRAM_REELS,
            "Instagram Reels",
            "Vertical 9:16, social-ready",
            "Crops to 1080×1920. H.264, AAC, MP4. Keeps 60 FPS when the source is 60; otherwise 30.",
            CompressionSettings(
                presetId = PresetId.INSTAGRAM_REELS,
                crf = 20,
                encoderPreset = "fast",
                resolution = ResolutionPreset.CUSTOM,
                customWidth = 1080,
                customHeight = 1920,
                fps = FpsPreset.FPS_30,
                fitMode = "crop",
            ),
        ),
        CompressionProfile(
            PresetId.INSTAGRAM_STORY,
            "Instagram Story",
            "Short vertical clips",
            "1080×1920 Stories frame with stronger compression for short clips.",
            CompressionSettings(
                presetId = PresetId.INSTAGRAM_STORY,
                crf = 23,
                audioBitrateKbps = 96,
                encoderPreset = "veryfast",
                resolution = ResolutionPreset.CUSTOM,
                customWidth = 1080,
                customHeight = 1920,
                fps = FpsPreset.FPS_30,
                fitMode = "crop",
            ),
        ),
        CompressionProfile(
            PresetId.HIGH_QUALITY,
            "High Quality",
            "Keep the picture, shrink a little",
            "Original resolution and frame rate. CRF 18, slow preset.",
            CompressionSettings(
                presetId = PresetId.HIGH_QUALITY,
                crf = 18,
                audioBitrateKbps = 192,
                encoderPreset = "slow",
                resolution = ResolutionPreset.ORIGINAL,
                fps = FpsPreset.ORIGINAL,
            ),
        ),
        CompressionProfile(
            PresetId.SMALL_FILE,
            "Small File",
            "Smallest acceptable quality",
            "Caps at 720p / 30 FPS with CRF 28.",
            CompressionSettings(presetId = PresetId.SMALL_FILE),
        ),
        CompressionProfile(
            PresetId.CUSTOM,
            "Custom",
            "Full manual control",
            "Every encoder option is exposed. Incompatible combinations are blocked.",
            CompressionSettings(presetId = PresetId.CUSTOM, resolution = ResolutionPreset.ORIGINAL, fps = FpsPreset.ORIGINAL),
        ),
    )

    fun settings(id: PresetId, sourceFps: Double?): CompressionSettings {
        val base = all.first { it.id == id }.settings
        return if (id == PresetId.INSTAGRAM_REELS && sourceFps != null && sourceFps >= 50.0) {
            base.copy(fps = FpsPreset.FPS_60)
        } else base
    }
}
