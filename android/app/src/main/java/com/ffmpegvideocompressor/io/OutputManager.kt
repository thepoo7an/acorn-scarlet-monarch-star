package com.ffmpegvideocompressor.io

import android.content.Context
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import java.io.File

class OutputManager(private val context: Context) {
    fun cacheOutput(name: String): File {
        val dir = File(context.cacheDir, "ffmpeg-out").apply { mkdirs() }
        return File(dir, name)
    }

    fun copyToUri(source: File, dest: Uri) {
        context.contentResolver.openOutputStream(dest)?.use { out ->
            source.inputStream().use { it.copyTo(out) }
        } ?: throw IllegalStateException("Could not create the output file.")
    }

    fun deleteQuietly(file: File) {
        if (file.exists()) file.delete()
    }
}

@Composable
fun rememberCreateDocument(mime: String, onCreated: (Uri) -> Unit): (String) -> Unit {
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.CreateDocument(mime),
        onResult = { uri -> if (uri != null) onCreated(uri) },
    )
    return { name -> launcher.launch(name) }
}
