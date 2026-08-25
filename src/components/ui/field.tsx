import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function NumberField({
  id,
  label,
  suffix,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; suffix?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          className={cn(
            "h-11 w-full rounded-[var(--radius-md)] bg-surface-2 px-3 text-sm text-fg shadow-[var(--shadow-border)]",
            suffix && "pr-12",
            className,
          )}
          {...props}
        />
        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs text-subtle">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
