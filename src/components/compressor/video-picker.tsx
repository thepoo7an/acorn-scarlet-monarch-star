import { Film, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export function VideoPicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectFile = useAppStore((s) => s.selectFile);
  const [drag, setDrag] = useState(false);

  const onFiles = useCallback(
    (list: FileList | null) => {
      const file = list?.[0];
      if (!file) return;
      void selectFile(file);
    },
    [selectFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-2xl)] bg-surface px-6 py-12 text-center shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150",
        drag && "bg-surface-2 shadow-[var(--shadow-border-hover)]",
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-[var(--radius-lg)] bg-surface-2">
        <Film className="size-7 text-accent" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-medium tracking-tight md:text-3xl">Compress video locally</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Your file stays on this device. FFmpeg runs in your browser — nothing is uploaded.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v"
        className="sr-only"
        onChange={(e) => onFiles(e.target.files)}
      />
      <Button
        className="mt-6 min-w-44"
        size="lg"
        onClick={() => inputRef.current?.click()}
        aria-label="Select a video file"
      >
        <Upload className="size-4" aria-hidden="true" />
        Select video
      </Button>
      <p className="mt-3 text-xs text-subtle">MP4, MOV, MKV, WebM, AVI · processed on-device</p>
    </div>
  );
}
