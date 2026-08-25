package com.ffmpegvideocompressor.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ffmpegvideocompressor.engine.CompressionSettings
import com.ffmpegvideocompressor.engine.CompressorException
import com.ffmpegvideocompressor.engine.FFmpegProcessManager
import com.ffmpegvideocompressor.engine.PresetId
import com.ffmpegvideocompressor.engine.ProcessingState
import com.ffmpegvideocompressor.engine.VideoInfo
import com.ffmpegvideocompressor.engine.CompressionProfiles
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class UiState(
    val info: VideoInfo? = null,
    val settings: CompressionSettings = CompressionProfiles.settings(PresetId.SMALL_FILE, null),
    val processing: ProcessingState = ProcessingState.Idle,
)

class CompressionViewModel(
    private val manager: FFmpegProcessManager = FFmpegProcessManager(),
) : ViewModel() {
    private val _state = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = _state

    fun onVideoPicked(info: VideoInfo) {
        _state.update {
            it.copy(
                info = info,
                settings = CompressionProfiles.settings(it.settings.presetId, info.fps),
                processing = ProcessingState.Idle,
            )
        }
    }

    fun applyPreset(id: PresetId) {
        _state.update {
            it.copy(settings = CompressionProfiles.settings(id, it.info?.fps))
        }
    }

    fun patch(settings: CompressionSettings) {
        _state.update { it.copy(settings = settings.copy(presetId = PresetId.CUSTOM)) }
    }

    fun compress(inputPath: String, outputPath: String) {
        val info = _state.value.info ?: return
        viewModelScope.launch {
            try {
                val result = manager.compress(info, _state.value.settings, inputPath, outputPath) { running ->
                    _state.update { it.copy(processing = running) }
                }
                _state.update { it.copy(processing = result) }
            } catch (e: CompressorException) {
                _state.update {
                    it.copy(processing = ProcessingState.Failed(e.userMessage, e.diagnostic))
                }
            }
        }
    }

    fun cancel() {
        manager.cancel()
        _state.update { it.copy(processing = ProcessingState.Cancelled) }
    }
}
