import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/features/i18n/i18n-provider";

const PLACEHOLDER_ROWS = [0, 1, 2, 3];

export function DeviceListSkeleton() {
  const { t } = useI18n();

  return (
    <div role="status" aria-label={t("devices.loadingList")}>
      <div className="bg-surface rounded-panel shadow-panel hidden overflow-hidden border md:block">
        <div className="bg-surface-muted h-11 border-b" />
        {PLACEHOLDER_ROWS.map((row) => (
          <div
            key={row}
            className="grid grid-cols-5 items-center gap-4 border-b px-5 py-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ms-auto h-4 w-12" />
          </div>
        ))}
      </div>

      <ul className="grid gap-3 md:hidden">
        {PLACEHOLDER_ROWS.map((row) => (
          <li
            key={row}
            className="bg-surface rounded-panel shadow-panel border p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
