import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  label,
}: {
  value: number | null;
  className?: string;
  label?: string;
}) {
  const pct = value == null ? null : Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct ?? undefined}
      aria-label={label ?? "Progress"}
      aria-valuetext={pct == null ? "Working" : `${Math.round(pct)} percent`}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-200 ease-out"
        style={{ width: pct == null ? "30%" : `${pct}%` }}
      />
    </div>
  );
}
