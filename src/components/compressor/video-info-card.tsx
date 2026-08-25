import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBitrate, formatBytes, formatContainer, formatDuration, formatFps } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export function VideoInfoCard() {
  const info = useAppStore((s) => s.info);
  const probing = useAppStore((s) => s.probing);
  const clearFile = useAppStore((s) => s.clearFile);
  if (!info) return null;

  const resolution =
    info.width && info.height ? `${info.width}×${info.height}` : probing ? "Reading…" : "Unknown";

  const stats: Array<{ label: string; value: string }> = [
    { label: "Size", value: formatBytes(info.sizeBytes) },
    { label: "Duration", value: formatDuration(info.durationSec) },
    { label: "Resolution", value: resolution },
    { label: "FPS", value: formatFps(info.fps) },
    { label: "Video", value: info.videoCodec ?? (probing ? "Reading…" : "Unknown") },
    { label: "Audio", value: info.audioCodec ?? (probing ? "Reading…" : "Unknown") },
    { label: "Bitrate", value: formatBitrate(info.bitrateBps) },
    { label: "Container", value: formatContainer(info.container) },
  ];

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-0 md:grid-cols-[minmax(0,280px)_1fr]">
        <div className="relative aspect-video bg-surface-2 md:aspect-auto md:min-h-44">
          {info.thumbnailUrl ? (
            <img
              src={info.thumbnailUrl}
              alt={`Thumbnail of ${info.filename}`}
              className="size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-subtle">
              {probing ? "Generating preview…" : "No preview"}
            </div>
          )}
        </div>
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-medium" title={info.filename}>
                {info.filename}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge>Source</Badge>
                {probing ? <Badge tone="accent">Reading metadata</Badge> : null}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile} aria-label="Remove selected video" className="size-10">
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs text-subtle">{s.label}</dt>
                <dd className="mt-0.5 font-mono text-sm tabular text-fg">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Card>
  );
}
