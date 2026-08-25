import { AUDIO_CODEC_LABEL, VIDEO_CODEC_LABEL, type AudioCodecId, type ContainerId, type FpsPreset, type ResolutionPreset, type VideoCodecId } from "@/ffmpeg/types";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/store/app-store";

const CODECS: VideoCodecId[] = ["h264", "hevc", "av1", "vp9", "copy"];
const AUDIO: AudioCodecId[] = ["aac", "opus", "copy", "none"];
const CONTAINERS: ContainerId[] = ["mp4", "mkv", "webm"];
const RES: ResolutionPreset[] = ["original", "2160p", "1440p", "1080p", "720p", "480p", "custom"];
const FPS: FpsPreset[] = ["original", "60", "30", "24", "custom"];

export function QuickSettings() {
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const caps = useAppStore((s) => s.engineCaps);
  const setAdvancedOpen = useAppStore((s) => s.setAdvancedOpen);

  const encoderHint = (id: VideoCodecId) => {
    if (!caps || id === "copy") return true;
    if (caps.videoEncoders.length === 0) return true;
    const map: Record<string, string[]> = {
      h264: ["libx264", "h264"],
      hevc: ["libx265", "hevc"],
      av1: ["libaom-av1", "libsvtav1", "av1"],
      vp9: ["libvpx-vp9", "vp9"],
    };
    return (map[id] ?? []).some((e) => caps.videoEncoders.includes(e));
  };

  return (
    <section aria-labelledby="quick-heading" className="rounded-[var(--radius-xl)] bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="quick-heading" className="text-sm font-medium">
          Quick settings
        </h2>
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={() => setAdvancedOpen(true)}
        >
          Advanced
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          id="codec"
          label="Video codec"
          value={settings.videoCodec}
          onChange={(e) => patch({ videoCodec: e.target.value as VideoCodecId })}
        >
          {CODECS.map((c) => (
            <option key={c} value={c} disabled={!encoderHint(c)}>
              {VIDEO_CODEC_LABEL[c]}
              {caps && !encoderHint(c) ? " (not in this build)" : ""}
            </option>
          ))}
        </Select>
        <Select
          id="acodec"
          label="Audio"
          value={settings.audioCodec}
          onChange={(e) => patch({ audioCodec: e.target.value as AudioCodecId })}
        >
          {AUDIO.map((c) => (
            <option key={c} value={c}>
              {AUDIO_CODEC_LABEL[c]}
            </option>
          ))}
        </Select>
        <Select
          id="container"
          label="Container"
          value={settings.container}
          onChange={(e) => patch({ container: e.target.value as ContainerId })}
        >
          {CONTAINERS.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </Select>
        <Select
          id="res"
          label="Resolution"
          value={settings.resolution}
          onChange={(e) => patch({ resolution: e.target.value as ResolutionPreset })}
        >
          {RES.map((c) => (
            <option key={c} value={c}>
              {c === "original" ? "Original" : c === "custom" ? "Custom" : c}
            </option>
          ))}
        </Select>
        <Select
          id="fps"
          label="Frame rate"
          value={settings.fps}
          onChange={(e) => patch({ fps: e.target.value as FpsPreset })}
        >
          {FPS.map((c) => (
            <option key={c} value={c}>
              {c === "original" ? "Original" : c === "custom" ? "Custom" : `${c} FPS`}
            </option>
          ))}
        </Select>
        <Select
          id="rate"
          label="Rate control"
          value={settings.rateControl}
          onChange={(e) => patch({ rateControl: e.target.value as "crf" | "bitrate" })}
        >
          <option value="crf">CRF (quality)</option>
          <option value="bitrate">Video bitrate</option>
        </Select>
      </div>
      <div className="mt-5">
        {settings.rateControl === "crf" ? (
          <Slider
            id="crf"
            label="CRF"
            min={14}
            max={40}
            value={settings.crf}
            onChange={(crf) => patch({ crf })}
            display={String(settings.crf)}
            hint="Lower is higher quality and a larger file. 18 is visually high; 28 is small."
          />
        ) : (
          <Slider
            id="vbr"
            label="Video bitrate"
            min={250}
            max={20000}
            step={50}
            value={settings.videoBitrateKbps}
            onChange={(videoBitrateKbps) => patch({ videoBitrateKbps })}
            display={`${settings.videoBitrateKbps} kbps`}
          />
        )}
      </div>
    </section>
  );
}
