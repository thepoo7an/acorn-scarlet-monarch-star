import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link to="/settings" className="inline-flex h-11 items-center gap-1 text-sm text-muted hover:text-fg">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Settings
        </Link>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">Privacy</h1>
        <p className="mt-2 text-lg text-muted">Your videos stay on your device.</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
          <p>
            FFmpeg Video Compressor is built for local processing. When you select a video, it is read in
            this browser and handed to FFmpeg running as WebAssembly on your machine. The file is not
            uploaded to a server for compression.
          </p>
          <p>
            There is no account, no analytics, and no tracking SDK in this app. Settings and recent job
            names are stored only in this browser's local storage.
          </p>
          <p>
            The FFmpeg engine files are served from this app so encoding does not depend on a third-party
            media API. Loading the page still uses whatever network your browser needs for the app itself.
          </p>
          <p>
            The native Android build, once FFmpeg 9.0.1 is compiled with the NDK, is designed the same way:
            Storage Access Framework for picking files, no cloud upload, no extra storage permission.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
