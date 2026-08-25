import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="FFmpeg Video Compressor home">
            <BrandMark />
            <span className="truncate text-sm font-medium tracking-tight">FFmpeg Video Compressor</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge tone="accent" className="hidden sm:inline-flex">
              Local only
            </Badge>
            <Link
              to="/settings"
              aria-label="Open settings"
              className="flex size-11 items-center justify-center rounded-[var(--radius-md)] text-fg transition-colors duration-150 hover:bg-surface-2"
            >
              <Settings className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>
      <div id="main">{children}</div>
    </div>
  );
}

export function BrandMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" className="fill-surface-2" />
      <rect x="8" y="7" width="16" height="11" rx="2" fill="none" className="stroke-accent" strokeWidth="2" />
      <rect x="11" y="10" width="4" height="2.2" rx="0.4" className="fill-accent" />
      <rect x="17" y="10" width="4" height="2.2" rx="0.4" className="fill-accent" />
      <path
        d="M12 21.5 L16 25.5 L20 21.5"
        fill="none"
        className="stroke-accent"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
