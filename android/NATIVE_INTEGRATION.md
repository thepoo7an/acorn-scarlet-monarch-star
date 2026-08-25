# Native FFmpeg 9.0.1 integration (Android Studio)

This preview environment cannot compile the Android NDK or package native C/C++.
The Kotlin architecture is complete. The missing piece is a real FFmpeg 9.0.1 binary
linked through JNI.

Do not ship a store build until this layer is implemented. The UI must not fake
progress or pretend compression succeeded.

## Official source (do not substitute)

- Site: https://ffmpeg.org/download.html
- Latest stable as of 24 Aug 2026: **FFmpeg 9.0.1 “Lei”**, released **12 Aug 2026**
- Tarball: https://ffmpeg.org/releases/ffmpeg-9.0.1.tar.xz
- Signature: https://ffmpeg.org/releases/ffmpeg-9.0.1.tar.xz.asc

Do not silently use an older FFmpeg. Do not use unofficial “FFmpeg for Android”
APKs or mystery GitHub binaries unless a specific ABI cannot be built from this
tarball, and document that exception.

## What already exists (A — this repo)

| Piece | Location |
| --- | --- |
| Engine interface | `app/src/main/java/com/ffmpegvideocompressor/engine/FFmpegEngine.kt` |
| Command builder | `.../engine/FFmpegCommandBuilder.kt` |
| Process manager | `.../engine/FFmpegProcessManager.kt` |
| Profiles | `.../engine/CompressionProfile.kt` |
| Models / errors | `.../engine/Models.kt` |
| Native stub | `.../engine/NativeFFmpegEngine.kt` |
| ViewModel | `.../ui/CompressionViewModel.kt` |
| Output manager | `.../io/OutputManager.kt` |
| Video picker (SAF) | `.../io/VideoPicker.kt` |

The rest of the app talks only to `FFmpegEngine`. Swap the stub for the JNI
implementation without touching Compose screens.

## What you add in Android Studio (B)

1. Install **NDK r27+** and CMake.
2. Run `native/build-ffmpeg.sh` (downloads official 9.0.1, cross-compiles
   `arm64-v8a` and `x86_64`).
3. Place `libffmpeg.so` + headers under `app/src/main/jniLibs/` and `native/include/`.
4. Implement `native-lib.cpp` JNI:
   - `ffmpegExecute(String[] args, long nativeHandle)`
   - `ffmpegCancel(long nativeHandle)`
   - `ffmpegVersion()`
   - progress via `AVIO` / `av_log` callbacks onto a Kotlin Flow
5. Replace the body of `NativeFFmpegEngine` so `isAvailable()` returns true
   only after `System.loadLibrary("ffmpeg_compressor")` succeeds **and**
   `ffmpegVersion()` reports **9.0.1**.
6. Wire MediaCodec encoders (`h264_mediacodec`, `hevc_mediacodec`) when the
   device supports them. Never claim hardware acceleration unless those
   encoders are actually selected.

## Recommended configure (LGPL-first)

Play Store + GPL is a legal review item. Default configure **without** `--enable-gpl`:

```text
--enable-cross-compile
--target-os=android
--arch=aarch64
--enable-shared
--disable-static
--disable-doc
--disable-programs
--enable-avcodec --enable-avformat --enable-avfilter --enable-swscale --enable-swresample
--enable-jni --enable-mediacodec --enable-hwaccels
--enable-small
```

This keeps FFmpeg **LGPL**. H.264/HEVC encode via Android MediaCodec, not libx264.

If you add `--enable-gpl --enable-libx264 --enable-libx265`, the app becomes GPL.
Flag that in Settings → Licenses and get a legal review before release.

## Version string

`About` must call `FFmpegEngine.version()`, never a hard-coded `"9.0.1"`.
If the binary is missing, show “FFmpeg not packaged in this build”.

## Files to replace after NDK work

- `app/src/main/java/com/ffmpegvideocompressor/engine/NativeFFmpegEngine.kt`
- `app/src/main/cpp/native-lib.cpp` (create)
- `app/src/main/cpp/CMakeLists.txt` (create)
- `app/src/main/jniLibs/arm64-v8a/libffmpeg.so` (build output)
