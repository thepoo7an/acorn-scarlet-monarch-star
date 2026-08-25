import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/licenses")({ component: LicensesPage });

function LicensesPage() {
  const caps = useAppStore((s) => s.engineCaps);
  const gpl = caps?.license === "gpl";

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link to="/settings" className="inline-flex h-11 items-center gap-1 text-sm text-muted hover:text-fg">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Settings
        </Link>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">Open source licenses</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="text-base font-medium text-fg">FFmpeg</h2>
            <p className="mt-2">
              FFmpeg is licensed under the LGPL or GPL depending on how it is configured and which
              libraries are enabled. This app does not claim a license it has not verified against the
              loaded binary.
            </p>
            <p className="mt-2 font-mono text-xs text-fg">
              Loaded engine license flag: {caps?.license ?? "unknown until the engine loads"}
            </p>
            {gpl ? (
              <p className="mt-2 rounded-[var(--radius-md)] bg-warn/15 p-3 text-warn">
                GPL flag: this WebAssembly core is distributed under GPL-2.0-or-later because it includes
                GPL components (typically x264). A store release that ships this core must comply with GPL.
                Review before publishing.
              </p>
            ) : (
              <p className="mt-2">
                If a future native build enables <span className="font-mono">--enable-gpl</span> or libx264 /
                libx265, GPL obligations apply. Prefer an LGPL FFmpeg 9.0.1 build plus Android MediaCodec
                for Play distribution unless counsel signs off on GPL.
              </p>
            )}
            <p className="mt-2">
              Official source:{" "}
              <a className="text-accent underline" href="https://ffmpeg.org/download.html">
                ffmpeg.org/download.html
              </a>
              . Latest stable at time of this project: FFmpeg 9.0.1 (12 Aug 2026).
            </p>
          </section>
          <section>
            <h2 className="text-base font-medium text-fg">ffmpeg.wasm</h2>
            <p className="mt-2">
              The JavaScript wrapper (@ffmpeg/ffmpeg, MIT) loads a WebAssembly core (@ffmpeg/core,
              GPL-2.0-or-later in the published npm package). That core is an older FFmpeg, not 9.0.1.
            </p>
          </section>
          <section>
            <h2 className="text-base font-medium text-fg">This application</h2>
            <p className="mt-2">
              Application UI code is provided as part of this project. Third-party UI libraries (React,
              TanStack, Radix, Lucide) keep their own licenses.
            </p>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
