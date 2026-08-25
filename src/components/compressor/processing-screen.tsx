import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatClock, formatBytes, percent } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { useSettingsStore } from "@/store/settings-store";

const STAGE_LABEL: Record<string, string> = {
  "loading-engine": "Loading FFmpeg",
  probing: "Reading video",
  "writing-input": "Preparing file",
  encoding: "Encoding",
  "reading-output": "Collecting output",
  finalizing: "Cleaning up",
  cancelling: "Cancelling",
  completed: "Finished",
  failed: "Failed",
  cancelled: "Cancelled",
  idle: "Waiting",
};

export function ProcessingScreen() {
  const progress = useAppStore((s) => s.progress);
  const info = useAppStore((s) => s.info);
  const cancel = useAppStore((s) => s.cancel);
  const detailed = useSettingsStore((s) => s.showDetailedLogs);
  if (!progress) return null;

  const pct = progress.ratio == null ? null : progress.ratio * 100;
  const stage = STAGE_LABEL[progress.stage] ?? progress.stage;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="proc-title"
        aria-describedby="proc-desc"
        className="w-full max-w-md rounded-[var(--radius-xl)] bg-bg-elevated p-6 shadow-[var(--shadow-border)]"
      >
        <p className="text-xs font-medium tracking-wide text-accent uppercase">Processing</p>
        <h2 id="proc-title" className="mt-2 text-xl font-medium tracking-tight">
          {stage}
        </h2>
        <p id="proc-desc" className="mt-1 text-sm text-muted">
          {progress.message}
        </p>
        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between font-mono text-sm tabular">
            <span>{pct == null ? "Working" : percent(pct)}</span>
            <span className="text-muted">{info?.filename}</span>
          </div>
          <Progress value={pct} label="Compression progress" />
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-subtle">Elapsed</dt>
            <dd className="font-mono tabular">{formatClock(progress.elapsedMs)}</dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">Remaining</dt>
            <dd className="font-mono tabular">
              {progress.remainingMs != null ? formatClock(progress.remainingMs) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">Original size</dt>
            <dd className="font-mono tabular">{info ? formatBytes(info.sizeBytes) : "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">Output size</dt>
            <dd className="font-mono tabular text-subtle">Available after encode</dd>
          </div>
        </dl>
        {detailed && progress.logLine ? (
          <pre className="mt-4 max-h-24 overflow-auto rounded-[var(--radius-sm)] bg-surface-2 p-2 font-mono text-[10px] text-muted">
            {progress.logLine}
          </pre>
        ) : null}
        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={() => void cancel()}
          disabled={progress.stage === "cancelling"}
        >
          {progress.stage === "cancelling" ? "Stopping FFmpeg…" : "Cancel"}
        </Button>
        <p className="mt-3 text-xs text-subtle">
          Cancel stops the FFmpeg process and deletes temporary copies. The original file is not changed.
        </p>
      </div>
    </div>
  );
}
