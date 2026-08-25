import { PROFILES } from "@/ffmpeg/profiles";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export function PresetGrid() {
  const selected = useAppStore((s) => s.settings.presetId);
  const applyPreset = useAppStore((s) => s.applyPreset);

  return (
    <section aria-labelledby="presets-heading">
      <h2 id="presets-heading" className="text-sm font-medium text-muted">
        Compression preset
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PROFILES.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.id)}
              aria-pressed={active}
              className={cn(
                "rounded-[var(--radius-lg)] bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out active:scale-[0.96]",
                active && "shadow-[0_0_0_1px_var(--color-accent)]",
              )}
            >
              <p className="text-sm font-medium">{p.name}</p>
              <p className="mt-1 text-xs text-muted">{p.tagline}</p>
            </button>
          );
        })}
      </div>
      <p className="mt-3 max-w-3xl text-sm text-muted">
        {PROFILES.find((p) => p.id === selected)?.description}
      </p>
    </section>
  );
}
