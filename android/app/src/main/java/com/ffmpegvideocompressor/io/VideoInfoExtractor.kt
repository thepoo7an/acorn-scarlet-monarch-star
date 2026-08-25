package com.ffmpegvideocompressor.io

import android.content.Context
import android.media.MediaMetadataRetriever
import android.net.Uri
import com.ffmpegvideocompressor.engine.VideoInfo

/**
 * Fast metadata from MediaMetadataRetriever.
 * After FFmpeg 9.0.1 is linked, prefer FFmpegEngine.probe() for codec names.
 * Unknown fields stay null — never invent values.
 */
class VideoInfoExtractor(private val context: Context) {
    fun fromUri(uri: Uri): VideoInfo {
        val retriever = MediaMetadataRetriever()
        try {
            retriever.setDataSource(context, uri)
            val durationMs = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)?.toLongOrNull()
            val width = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH)?.toIntOrNull()
            val height = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT)?.toIntOrNull()
            val bitrate = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_BITRATE)?.toLongOrNull()
            val mime = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_MIMETYPE)
            val rotation = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_ROTATION)?.toIntOrNull()
            val name = uri.lastPathSegment ?: "video"
            return VideoInfo(
                filename = name,
                sizeBytes = context.contentResolver.openAssetFileDescriptor(uri, "r")?.use { it.length } ?: 0L,
                uri = uri.toString(),
                mimeType = mime ?: "video/*",
                container = mime,
                durationSec = durationMs?.div(1000.0),
                width = width,
                height = height,
                fps = null,
                videoCodec = null,
                audioCodec = null,
                bitrateBps = bitrate,
                rotation = rotation,
            )
        } finally {
            retriever.release()
        }
    }
}
