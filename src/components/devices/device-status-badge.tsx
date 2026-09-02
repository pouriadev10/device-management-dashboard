import { cn } from "@/lib/cn";
import type { DeviceStatus } from "@/features/devices/types";

const BADGE_STYLES: Record<DeviceStatus, string> = {
  Online:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/25",
  Offline:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/25",
  Warning:
    "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/25",
};

const DOT_STYLES: Record<DeviceStatus, string> = {
  Online: "bg-emerald-500",
  Offline: "bg-rose-500",
  Warning: "bg-amber-500",
};

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        BADGE_STYLES[status],
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", DOT_STYLES[status])}
      />
      {status}
    </span>
  );
}
