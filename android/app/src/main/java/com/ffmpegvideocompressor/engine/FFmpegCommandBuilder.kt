package com.ffmpegvideocompressor.engine

class FFmpegCommandBuilder {
    fun build(
        info: VideoInfo,
        settings: CompressionSettings,
        inputPath: String,
        outputPath: String,
        availableEncoders: Set<String> = emptySet(),
    ): BuiltCommand {
        require(!inputPath.contains("..") && !outputPath.contains("..")) {
            "Unsafe path rejected"
        }
        val warnings = mutableListOf<String>()
        val args = mutableListOf("-hide_banner", "-y", "-i", inputPath)

        if (settings.container == ContainerId.WEBM &&
            (settings.videoCodec == VideoCodecId.H264 || settings.videoCodec == VideoCodecId.HEVC)
        ) {
            throw CompressorException(
                "UNSUPPORTED_CONTAINER",
                "WebM cannot hold H.264 or HEVC. Use VP9/AV1 or MP4/MKV.",
            )
        }

        when (settings.videoCodec) {
            VideoCodecId.COPY -> args += listOf("-c:v", "copy")
            VideoCodecId.H264 -> {
                val enc = pick(availableEncoders, listOf("h264_mediacodec", "libx264", "h264"))
                    ?: "h264_mediacodec"
                args += listOf("-c:v", enc)
                if (enc == "libx264" || enc == "h264") {
                    if (settings.rateControl == RateControl.CRF) {
                        args += listOf("-crf", settings.crf.toString(), "-preset", settings.encoderPreset)
                    } else {
                        args += listOf("-b:v", "${settings.videoBitrateKbps}k")
                    }
                } else {
                    args += listOf("-b:v", "${settings.videoBitrateKbps}k")
                    warnings += "MediaCodec uses bitrate, not CRF."
                }
            }
            VideoCodecId.HEVC -> args += listOf("-c:v", pick(availableEncoders, listOf("hevc_mediacodec", "libx265")) ?: "hevc_mediacodec")
            VideoCodecId.AV1 -> args += listOf("-c:v", pick(availableEncoders, listOf("libaom-av1", "av1_mediacodec")) ?: "libaom-av1")
            VideoCodecId.VP9 -> args += listOf("-c:v", "libvpx-vp9")
        }

        scaleArgs(info, settings)?.let { args += listOf("-vf", it) }
        fpsValue(settings)?.let { args += listOf("-r", it.toString()) }

        when (settings.audioCodec) {
            AudioCodecId.NONE -> args += "-an"
            AudioCodecId.COPY -> args += listOf("-c:a", "copy")
            AudioCodecId.AAC -> args += listOf("-c:a", "aac", "-b:a", "${settings.audioBitrateKbps}k")
            AudioCodecId.OPUS -> args += listOf("-c:a", "libopus", "-b:a", "${settings.audioBitrateKbps}k")
        }

        if (settings.container == ContainerId.MP4 && settings.faststart) {
            args += listOf("-movflags", "+faststart")
        }
        args += outputPath
        return BuiltCommand(args, inputPath, outputPath, warnings)
    }

    private fun pick(available: Set<String>, candidates: List<String>): String? =
        if (available.isEmpty()) candidates.firstOrNull()
        else candidates.firstOrNull { it in available }

    private fun fpsValue(settings: CompressionSettings): Int? = when (settings.fps) {
        FpsPreset.ORIGINAL -> null
        FpsPreset.FPS_60 -> 60
        FpsPreset.FPS_30 -> 30
        FpsPreset.FPS_24 -> 24
        FpsPreset.CUSTOM -> settings.customFps
    }

    private fun scaleArgs(info: VideoInfo, settings: CompressionSettings): String? {
        val h = when (settings.resolution) {
            ResolutionPreset.ORIGINAL -> return null
            ResolutionPreset.UHD_2160 -> 2160
            ResolutionPreset.QHD_1440 -> 1440
            ResolutionPreset.FHD_1080 -> 1080
            ResolutionPreset.HD_720 -> 720
            ResolutionPreset.SD_480 -> 480
            ResolutionPreset.CUSTOM -> settings.customHeight
        }
        val w = if (settings.resolution == ResolutionPreset.CUSTOM) settings.customWidth
        else even(((info.width ?: 1280) * h) / (info.height ?: 720))
        return "scale=${even(w)}:${even(h)}:force_original_aspect_ratio=decrease:flags=lanczos," +
            "pad=${even(w)}:${even(h)}:(ow-iw)/2:(oh-ih)/2,setsar=1"
    }

    private fun even(n: Int): Int = if (n % 2 == 0) n.coerceAtLeast(2) else (n + 1).coerceAtLeast(2)
}
