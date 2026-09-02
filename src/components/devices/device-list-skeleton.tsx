import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_ROWS = [0, 1, 2, 3];

export function DeviceListSkeleton() {
  return (
    <div role="status" aria-label="Loading devices">
      <div className="bg-surface hidden overflow-hidden rounded-2xl border md:block">
        <div className="bg-surface-muted h-11 border-b" />
        {PLACEHOLDER_ROWS.map((row) => (
          <div
            key={row}
            className="grid grid-cols-5 items-center gap-4 border-b px-5 py-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-4 w-12" />
          </div>
        ))}
      </div>

      <ul className="grid gap-3 md:hidden">
        {PLACEHOLDER_ROWS.map((row) => (
          <li key={row} className="bg-surface rounded-2xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
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
