"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  parseDeviceFilters,
  serializeDeviceFilters,
  type DeviceFilters,
} from "./filter-params";

type UseDeviceFiltersResult = {
  filters: DeviceFilters;
  setFilters: (patch: Partial<DeviceFilters>) => void;
};

/**
 * Binds the filter state to the URL, which is its single source of truth: there
 * is no local copy to fall out of sync, so a refresh, a shared link and a new
 * tab all produce exactly the same view.
 *
 * Updates go through `history.replaceState` rather than `router.replace`, for
 * two reasons. It stays on the client, so a filter change costs nothing on the
 * server even though the route is dynamic; and it leaves the history stack
 * alone, because filters are a view of one page rather than separate
 * destinations — eight keystrokes should not cost eight presses of the back
 * button. Next.js hooks into the native history API, so `useSearchParams` still
 * re-renders with the new value.
 */
export function useDeviceFilters(): UseDeviceFiltersResult {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();

  const filters = useMemo(
    () => parseDeviceFilters(new URLSearchParams(query)),
    [query],
  );

  const setFilters = useCallback(
    (patch: Partial<DeviceFilters>) => {
      // Read the live URL rather than this render's snapshot: a debounced write
      // can land after another filter has already changed, and it must patch
      // what is actually there instead of reverting it.
      const current = new URLSearchParams(window.location.search);
      const next = serializeDeviceFilters(
        { ...parseDeviceFilters(current), ...patch },
        current,
      ).toString();

      window.history.replaceState(
        null,
        "",
        next === "" ? pathname : `${pathname}?${next}`,
      );
    },
    [pathname],
  );

  return { filters, setFilters };
}
