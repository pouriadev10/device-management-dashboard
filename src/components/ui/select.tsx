import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/cn";

import { INPUT_STYLES, INVALID_STYLES } from "./input";

/**
 * The native control, deliberately: its dropdown is the one the platform already
 * places, keyboard-drives and mirrors for a right-to-left page. Only the closed
 * state is styled, and it borrows the text input's styling so the two line up.
 */
export function Select({
  className,
  ...props
}: ComponentPropsWithRef<"select">) {
  return (
    <select
      className={cn(INPUT_STYLES, INVALID_STYLES, "pe-2", className)}
      {...props}
    />
  );
}
