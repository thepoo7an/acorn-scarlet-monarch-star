package com.ffmpegvideocompressor.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ffmpegvideocompressor.engine.NativeFFmpegEngine

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(vm: CompressionViewModel = viewModel()) {
    val state by vm.state.collectAsState()
    val engine = NativeFFmpegEngine()
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("FFmpeg Video Compressor") })
        },
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
        ) {
            Text("Your videos stay on your device.", style = MaterialTheme.typography.bodyMedium)
            Text(
                engine.version() ?: engine.licenseNotice(),
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 12.dp),
            )
            Text(
                "Select a video with the Storage Access Framework picker after FFmpeg 9.0.1 is linked. This stub will not fake a compression job.",
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 12.dp),
            )
            state.info?.let {
                Text("${it.filename} · ${it.width}x${it.height}", modifier = Modifier.padding(top = 16.dp))
            }
        }
    }
}
