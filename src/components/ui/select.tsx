import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({
  id,
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <select
        id={id}
        className={cn(
          "h-11 w-full rounded-[var(--radius-md)] bg-surface-2 px-3 text-sm text-fg shadow-[var(--shadow-border)]",
          "focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
