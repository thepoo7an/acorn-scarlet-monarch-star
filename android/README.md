# FFmpeg Video Compressor — Android

Kotlin + Jetpack Compose architecture for a local FFmpeg compressor.

This tree is the **native integration boundary**. The engine interface, command
builder, presets, ViewModel, and SAF-oriented manifest are in place.

`NativeFFmpegEngine` is a stub on purpose: this environment cannot compile
FFmpeg 9.0.1 or the Android NDK. It throws a clear error instead of faking
compression.

Open in Android Studio and follow [NATIVE_INTEGRATION.md](NATIVE_INTEGRATION.md).

Target: Android 13–16 (minSdk 33), scoped storage only, no extra media permissions.
