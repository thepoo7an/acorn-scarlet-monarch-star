import { Shield } from "lucide-react";
import { useEffect } from "react";
import { AdvancedSheet } from "@/components/compressor/advanced-sheet";
import { EstimatePanel } from "@/components/compressor/estimate-panel";
import { PresetGrid } from "@/components/compressor/preset-grid";
import { ProcessingScreen } from "@/components/compressor/processing-screen";
import { QuickSettings } from "@/components/compressor/quick-settings";
import { RecentJobs } from "@/components/compressor/recent-jobs";
import { ResultScreen } from "@/components/compressor/result-screen";
import { VideoInfoCard } from "@/components/compressor/video-info-card";
import { VideoPicker } from "@/components/compressor/video-picker";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { useSettingsStore } from "@/store/settings-store";

export function MainScreen() {
  const file = useAppStore((s) => s.file);
  const info = useAppStore((s) => s.info);
  const error = useAppStore((s) => s.error);
  const screen = useAppStore((s) => s.screen);
  const compress = useAppStore((s) => s.compress);
  const probing = useAppStore((s) => s.probing);
  const caps = useAppStore((s) => s.engineCaps);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const defaultPreset = useSettingsStore((s) => s.defaultPreset);

  useEffect(() => {
    if (!useAppStore.getState().file) applyPreset(defaultPreset);
  }, [applyPreset, defaultPreset]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 pb-28 md:py-10">
      <div className="stagger-in space-y-6">
        {!file ? <VideoPicker /> : <VideoInfoCard />}

        {error ? (
          <div
            role="alert"
            className="rounded-[var(--radius-lg)] bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            <p className="font-medium">{error.user}</p>
            {error.diagnostic ? (
              <p className="mt-1 font-mono text-xs text-muted">{error.diagnostic}</p>
            ) : null}
          </div>
        ) : null}

        <PresetGrid />
        <QuickSettings />
        {info ? <EstimatePanel /> : null}
        <RecentJobs />

        <aside className="flex items-start gap-3 rounded-[var(--radius-lg)] bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]">
          <Shield className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <p>
            Videos never leave this device. This preview uses a WebAssembly FFmpeg build
            {caps?.ffmpegVersion ? ` (${caps.ffmpegVersion})` : ""}. It is not FFmpeg 9.0.1 — the native
            Android project targets official 9.0.1 after NDK integration.
          </p>
        </aside>
      </div>

      {file ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 p-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <p className="hidden text-sm text-muted sm:block">
              {probing ? "Still reading metadata — you can compress now." : "Ready to compress on this device."}
            </p>
            <Button
              size="lg"
              className="w-full sm:w-auto sm:min-w-48"
              onClick={() => void compress()}
              disabled={!file}
            >
              Compress video
            </Button>
          </div>
        </div>
      ) : null}

      <AdvancedSheet />
      {screen === "processing" ? <ProcessingScreen /> : null}
      {screen === "result" ? <ResultScreen /> : null}
    </main>
  );
}
