import { Card } from "@/components/ui/card";
import { estimateOutputSize } from "@/ffmpeg/estimate";
import { VIDEO_CODEC_LABEL } from "@/ffmpeg/types";
import { formatBytes, formatDuration, formatFps } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export function EstimatePanel() {
  const info = useAppStore((s) => s.info);
  const settings = useAppStore((s) => s.settings);
  if (!info) return null;
  const estimate = estimateOutputSize(info, settings);

  return (
    <Card>
      <h2 className="text-sm font-medium">Before / after</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-subtle">Original</p>
          <ul className="mt-2 space-y-1 font-mono text-sm tabular">
            <li>{formatBytes(info.sizeBytes)}</li>
            <li>
              {info.width && info.height ? `${info.width}×${info.height}` : "Resolution unknown"}
            </li>
            <li>{formatDuration(info.durationSec)}</li>
            <li>{formatFps(info.fps)}</li>
            <li>{info.videoCodec ?? "Codec unknown"}</li>
          </ul>
        </div>
        <div>
          <p className="text-xs text-subtle">After these settings</p>
          <ul className="mt-2 space-y-1 font-mono text-sm tabular">
            <li>
              {estimate ? formatBytes(estimate.bytes) : "—"}
              {estimate ? (
                <span className="ml-2 font-sans text-xs text-subtle"> estimate</span>
              ) : (
                <span className="ml-2 font-sans text-xs text-subtle">need duration</span>
              )}
            </li>
            <li>{VIDEO_CODEC_LABEL[settings.videoCodec]}</li>
            <li>{settings.container.toUpperCase()}</li>
            <li>
              {settings.rateControl === "crf" ? `CRF ${settings.crf}` : `${settings.videoBitrateKbps} kbps`}
            </li>
          </ul>
        </div>
      </div>
      {estimate ? (
        <p className="mt-3 text-xs text-subtle">
          Estimated from {estimate.method}. Actual size depends on the picture. This is not a guarantee.
        </p>
      ) : null}
    </Card>
  );
}
