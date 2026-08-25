import { formatBytes, formatClock } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { Badge } from "@/components/ui/badge";
import { getProfile } from "@/ffmpeg/profiles";

export function RecentJobs() {
  const recent = useAppStore((s) => s.recent);
  if (recent.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading">
      <h2 id="recent-heading" className="text-sm font-medium text-muted">
        Recent jobs
      </h2>
      <ul className="mt-3 divide-y divide-border rounded-[var(--radius-xl)] bg-surface shadow-[var(--shadow-border)]">
        {recent.slice(0, 6).map((job) => (
          <li key={job.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm">{job.filename}</p>
              <p className="mt-0.5 font-mono text-xs tabular text-subtle">
                {formatBytes(job.originalSizeBytes)}
                {job.outputSizeBytes != null ? ` → ${formatBytes(job.outputSizeBytes)}` : ""}
                {job.durationMs != null ? ` · ${formatClock(job.durationMs)}` : ""}
                {` · ${getProfile(job.presetId).name}`}
              </p>
            </div>
            <Badge
              tone={job.status === "completed" ? "ok" : job.status === "failed" ? "danger" : "neutral"}
            >
              {job.status}
            </Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
