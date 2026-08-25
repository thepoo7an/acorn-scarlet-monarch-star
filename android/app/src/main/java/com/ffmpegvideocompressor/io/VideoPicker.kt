package com.ffmpegvideocompressor.io

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable

/**
 * Storage Access Framework picker. No READ_MEDIA_VIDEO permission.
 */
@Composable
fun rememberVideoPicker(onPicked: (Uri) -> Unit): () -> Unit {
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenDocument(),
        onResult = { uri -> if (uri != null) onPicked(uri) },
    )
    return { launcher.launch(arrayOf("video/*")) }
}
