import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return (
    <input
      className={cn(
        "bg-surface placeholder:text-muted focus-visible:ring-ring h-10 w-full rounded-xl border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none",
        "aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus-visible:ring-rose-400",
        className,
      )}
      {...props}
    />
  );
}
