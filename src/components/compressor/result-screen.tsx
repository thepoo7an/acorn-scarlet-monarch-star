import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, formatClock, percent } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { VIDEO_CODEC_LABEL } from "@/ffmpeg/types";

export function ResultScreen() {
  const result = useAppStore((s) => s.result);
  const info = useAppStore((s) => s.info);
  const saveResult = useAppStore((s) => s.saveResult);
  const reset = useAppStore((s) => s.resetToEditor);
  if (!result) return null;

  const reduced = result.reductionPercent;
  const smaller = reduced != null && reduced > 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="res-title"
        className="w-full max-w-md rounded-[var(--radius-xl)] bg-bg-elevated p-6 shadow-[var(--shadow-border)]"
      >
        <p className="text-xs font-medium tracking-wide text-ok uppercase">Finished</p>
        <h2 id="res-title" className="mt-2 text-xl font-medium tracking-tight">
          {result.filename}
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Stat label="Original" value={formatBytes(result.originalSizeBytes)} />
          <Stat label="Output" value={formatBytes(result.sizeBytes)} />
          <Stat
            label="Change"
            value={
              reduced == null
                ? "—"
                : smaller
                  ? `${percent(reduced)} smaller`
                  : `${percent(Math.abs(reduced))} larger`
            }
          />
          <Stat label="Time" value={formatClock(result.durationMs)} />
          <Stat
            label="Resolution"
            value={info?.width && info?.height ? `${info.width}×${info.height}` : "See settings"}
          />
          <Stat label="Codec" value={VIDEO_CODEC_LABEL[result.settings.videoCodec]} />
        </dl>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={() => void saveResult()}>
            <Download className="size-4" aria-hidden="true" />
            Save file
          </Button>
          <Button variant="secondary" className="flex-1" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Back
          </Button>
        </div>
        <p className="mt-3 text-xs text-subtle">
          The original file was not overwritten. Choose where to save the compressed copy.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="font-mono text-sm tabular">{value}</dd>
    </div>
  );
}
