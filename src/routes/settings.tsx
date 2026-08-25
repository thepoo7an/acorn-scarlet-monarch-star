import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PROFILES } from "@/ffmpeg/profiles";
import { processManager } from "@/ffmpeg/process-manager";
import type { PresetId } from "@/ffmpeg/types";
import { useSettingsStore, type ThemeMode } from "@/store/settings-store";
import { useAppStore } from "@/store/app-store";
import { useEffect } from "react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const defaultPreset = useSettingsStore((s) => s.defaultPreset);
  const setDefaultPreset = useSettingsStore((s) => s.setDefaultPreset);
  const keepOriginal = useSettingsStore((s) => s.keepOriginal);
  const setKeepOriginal = useSettingsStore((s) => s.setKeepOriginal);
  const autoOpen = useSettingsStore((s) => s.autoOpenOutput);
  const setAutoOpen = useSettingsStore((s) => s.setAutoOpenOutput);
  const detailed = useSettingsStore((s) => s.showDetailedLogs);
  const setDetailed = useSettingsStore((s) => s.setShowDetailedLogs);
  const caps = useAppStore((s) => s.engineCaps);
  const hydrate = useAppStore((s) => s.hydrateEngine);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const version =
    caps?.versionLine ??
    (processManager.capabilities()?.versionLine ??
      "Engine not loaded yet — version is read from the real FFmpeg binary, not hard-coded.");

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link to="/" className="inline-flex h-11 items-center gap-1 text-sm text-muted hover:text-fg">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back
        </Link>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted">Defaults for this device. Nothing is synced.</p>

        <section className="mt-8 space-y-6 rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]">
          <Select
            id="theme"
            label="Theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </Select>
          <Select
            id="defpreset"
            label="Default compression preset"
            value={defaultPreset}
            onChange={(e) => setDefaultPreset(e.target.value as PresetId)}
          >
            {PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Switch
            id="keep"
            label="Keep original files"
            description="Never overwrite the source. Compressed output is always a new file."
            checked={keepOriginal}
            onCheckedChange={setKeepOriginal}
          />
          <Switch
            id="auto"
            label="Automatically open output"
            description="Open the compressed file when FFmpeg finishes."
            checked={autoOpen}
            onCheckedChange={setAutoOpen}
          />
          <Switch
            id="logs"
            label="Show detailed processing information"
            description="Display FFmpeg log lines and the generated command."
            checked={detailed}
            onCheckedChange={setDetailed}
          />
        </section>

        <section className="mt-6 space-y-3 rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-medium">About</h2>
          <p className="text-sm text-muted">
            FFmpeg Video Compressor processes video on this device. Short description: compress and convert
            videos locally with FFmpeg.
          </p>
          <div>
            <p className="text-xs text-subtle">FFmpeg version (loaded engine)</p>
            <p className="mt-1 font-mono text-sm text-fg">{version}</p>
          </div>
          {caps?.notes?.map((n) => (
            <p key={n} className="text-xs text-subtle">
              {n}
            </p>
          ))}
        </section>

        <nav className="mt-6 flex flex-col gap-2 text-sm">
          <Link to="/privacy" className="text-accent hover:underline">
            Privacy
          </Link>
          <Link to="/licenses" className="text-accent hover:underline">
            Open source licenses
          </Link>
        </nav>
      </main>
    </AppShell>
  );
}
