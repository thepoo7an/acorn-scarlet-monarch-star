import { X } from "lucide-react";
import { NumberField } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { EncoderPreset, FitMode } from "@/ffmpeg/types";
import { useAppStore } from "@/store/app-store";
import { useSettingsStore } from "@/store/settings-store";

const PRESETS: EncoderPreset[] = [
  "ultrafast",
  "superfast",
  "veryfast",
  "faster",
  "fast",
  "medium",
  "slow",
  "slower",
  "veryslow",
];

export function AdvancedSheet() {
  const open = useAppStore((s) => s.advancedOpen);
  const setOpen = useAppStore((s) => s.setAdvancedOpen);
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const commandPreview = useAppStore((s) => s.commandPreview);
  const detailed = useSettingsStore((s) => s.showDetailedLogs);
  const preview = open ? commandPreview() : null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70"
        aria-label="Close advanced settings"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="adv-title"
        className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[var(--radius-xl)] bg-bg-elevated p-5 shadow-[var(--shadow-border)] sm:rounded-[var(--radius-xl)]"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="adv-title" className="text-lg font-medium tracking-tight">
            Advanced settings
          </h2>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-[var(--radius-md)] hover:bg-surface-2"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5 space-y-5">
          <Select
            id="preset"
            label="Encoder preset"
            value={settings.encoderPreset}
            onChange={(e) => patch({ encoderPreset: e.target.value as EncoderPreset })}
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <p className="text-xs text-subtle">
            Faster presets finish sooner and make larger files. Slow is for quality.
          </p>
          <Slider
            id="abr"
            label="Audio bitrate"
            min={32}
            max={320}
            step={16}
            value={settings.audioBitrateKbps}
            onChange={(audioBitrateKbps) => patch({ audioBitrateKbps })}
            display={`${settings.audioBitrateKbps} kbps`}
          />
          <Select
            id="ar"
            label="Audio sample rate"
            value={String(settings.audioSampleRate)}
            onChange={(e) =>
              patch({
                audioSampleRate: e.target.value === "original" ? "original" : Number(e.target.value),
              })
            }
          >
            <option value="original">Original</option>
            <option value="48000">48 kHz</option>
            <option value="44100">44.1 kHz</option>
            <option value="32000">32 kHz</option>
          </Select>
          <Select
            id="fit"
            label="Resize fit"
            value={settings.fitMode}
            onChange={(e) => patch({ fitMode: e.target.value as FitMode })}
          >
            <option value="pad">Pad (letterbox)</option>
            <option value="crop">Crop (fill)</option>
            <option value="stretch">Stretch</option>
          </Select>
          {settings.resolution === "custom" ? (
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                id="cw"
                label="Width"
                value={settings.customWidth}
                min={16}
                max={7680}
                onChange={(e) => patch({ customWidth: Number(e.target.value) })}
              />
              <NumberField
                id="ch"
                label="Height"
                value={settings.customHeight}
                min={16}
                max={4320}
                onChange={(e) => patch({ customHeight: Number(e.target.value) })}
              />
            </div>
          ) : null}
          {settings.fps === "custom" ? (
            <NumberField
              id="cfps"
              label="Custom FPS"
              value={settings.customFps}
              min={1}
              max={120}
              onChange={(e) => patch({ customFps: Number(e.target.value) })}
            />
          ) : null}
          <Switch
            id="faststart"
            label="Fast start (MP4)"
            description="Moves the moov atom to the front so playback can begin before the file finishes downloading."
            checked={settings.faststart}
            onCheckedChange={(faststart) => patch({ faststart })}
          />
          {detailed ? (
            <div>
              <p className="text-sm font-medium">Generated command</p>
              <pre className="mt-2 overflow-x-auto rounded-[var(--radius-md)] bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-muted">
                {preview ?? "Select a video to generate a command."}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
