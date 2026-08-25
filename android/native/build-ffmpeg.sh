#!/usr/bin/env bash
# Cross-compile official FFmpeg 9.0.1 for Android.
# Run on a machine with Android NDK. This sandbox cannot run the NDK.
set -euo pipefail

FFMPEG_VERSION="9.0.1"
FFMPEG_URL="https://ffmpeg.org/releases/ffmpeg-${FFMPEG_VERSION}.tar.xz"
API="${ANDROID_API:-24}"
NDK="${ANDROID_NDK_HOME:?Set ANDROID_NDK_HOME to your NDK path}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="${ROOT}/ffmpeg-${FFMPEG_VERSION}"
OUT="${ROOT}/out"

if [[ ! -d "$SRC" ]]; then
  echo "Downloading official FFmpeg ${FFMPEG_VERSION} from ffmpeg.org…"
  curl -L "$FFMPEG_URL" -o "${ROOT}/ffmpeg-${FFMPEG_VERSION}.tar.xz"
  tar -xf "${ROOT}/ffmpeg-${FFMPEG_VERSION}.tar.xz" -C "$ROOT"
fi

build_abi() {
  local ABI="$1" ARCH="$2" CPU="$3" TRIPLE="$4"
  local PREFIX="${OUT}/${ABI}"
  local TOOLCHAIN="${NDK}/toolchains/llvm/prebuilt/linux-x86_64"
  mkdir -p "$PREFIX"
  pushd "$SRC" >/dev/null
  make distclean >/dev/null 2>&1 || true
  ./configure \
    --prefix="$PREFIX" \
    --enable-cross-compile \
    --target-os=android \
    --arch="$ARCH" \
    --cpu="$CPU" \
    --cc="${TOOLCHAIN}/bin/${TRIPLE}${API}-clang" \
    --cxx="${TOOLCHAIN}/bin/${TRIPLE}${API}-clang++" \
    --sysroot="${TOOLCHAIN}/sysroot" \
    --enable-shared --disable-static \
    --disable-doc --disable-programs --disable-debug \
    --enable-avcodec --enable-avformat --enable-avfilter \
    --enable-swscale --enable-swresample --enable-avutil \
    --enable-jni --enable-mediacodec --enable-hwaccels \
    --enable-small \
    --extra-cflags="-O2 -fPIC" \
    --extra-ldflags="-Wl,-z,max-page-size=16384"
  make -j"$(nproc)"
  make install
  popd >/dev/null
  echo "Built ${ABI} → ${PREFIX}"
}

build_abi arm64-v8a aarch64 armv8-a aarch64-linux-android
build_abi x86_64 x86_64 x86-64 x86_64-linux-android

echo "Done. Copy ${OUT}/<abi>/lib/*.so into app/src/main/jniLibs/<abi>/"
echo "This LGPL configure does not enable libx264/libx265. Adding them requires --enable-gpl and legal review."
