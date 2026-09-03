import { useI18n } from "@/features/i18n/i18n-provider";
import type { DeviceStatus } from "@/features/devices/types";
import { cn } from "@/lib/cn";

/**
 * One hue per status, mixed into a tint and a ring in the stylesheet. The
 * component names the status, not the colour, so light and dark cannot drift
 * apart here — there is only one set of classes to keep right.
 */
const BADGE_STYLES: Record<DeviceStatus, string> = {
  Online: "bg-online-soft text-online ring-online-ring",
  Offline: "bg-offline-soft text-offline ring-offline-ring",
  Warning: "bg-warning-soft text-warning ring-warning-ring",
};

const DOT_STYLES: Record<DeviceStatus, string> = {
  Online: "bg-online",
  Offline: "bg-offline",
  Warning: "bg-warning",
};

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        BADGE_STYLES[status],
      )}
    >
      {/* Colour alone never carries the status; the dot only reinforces the word. */}
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", DOT_STYLES[status])}
      />
      {t(`status.${status}`)}
    </span>
  );
}
