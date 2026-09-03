import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

const INPUT_STYLES =
  "bg-surface border-border-strong placeholder:text-muted h-10 w-full rounded-control border px-3 text-sm shadow-panel transition-[border-color,box-shadow] duration-150 ease-out focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:outline-none";

/** Field-level validation is signalled by `aria-invalid`, so the styling follows it. */
const INVALID_STYLES =
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:border-danger aria-[invalid=true]:focus-visible:ring-danger/35";

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return (
    <input className={cn(INPUT_STYLES, INVALID_STYLES, className)} {...props} />
  );
}

export { INPUT_STYLES, INVALID_STYLES };
