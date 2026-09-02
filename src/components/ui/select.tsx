import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

export function Select({
  className,
  ...props
}: ComponentPropsWithRef<"select">) {
  return (
    <select
      className={cn(
        "bg-surface focus-visible:ring-ring h-10 w-full rounded-xl border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}
