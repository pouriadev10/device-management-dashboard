import { DEVICE_STATUSES } from "./schemas";

/** "All" plus every real device status, in the order the filter bar shows them. */
export const STATUS_FILTERS = ["All", ...DEVICE_STATUSES] as const;

export type StatusFilter = (typeof STATUS_FILTERS)[number];

export type DeviceFilters = {
  search: string;
  status: StatusFilter;
};

export const DEFAULT_FILTERS: DeviceFilters = { search: "", status: "All" };

export const SEARCH_PARAM = "search";
export const STATUS_PARAM = "status";

/**
 * Reads filters out of a query string. Anything unrecognised falls back to the
 * default rather than filtering everything away, and a status is matched
 * case-insensitively before being canonicalised — `?status=online` is honoured
 * and rewritten as `Online`.
 */
export function parseDeviceFilters(params: URLSearchParams): DeviceFilters {
  return {
    search: params.get(SEARCH_PARAM)?.trim() ?? DEFAULT_FILTERS.search,
    status: parseStatusFilter(params.get(STATUS_PARAM)),
  };
}

function parseStatusFilter(raw: string | null): StatusFilter {
  const candidate = raw?.trim().toLowerCase();

  return (
    STATUS_FILTERS.find((status) => status.toLowerCase() === candidate) ??
    DEFAULT_FILTERS.status
  );
}

/**
 * Writes filters back into a query string, starting from the params already in
 * the URL so unrelated ones survive. Defaults are omitted, which keeps the
 * cleared state as a bare `/devices` instead of `/devices?search=&status=All`.
 */
export function serializeDeviceFilters(
  filters: DeviceFilters,
  current: URLSearchParams = new URLSearchParams(),
): URLSearchParams {
  const params = new URLSearchParams(current.toString());

  applyParam(
    params,
    SEARCH_PARAM,
    filters.search.trim(),
    DEFAULT_FILTERS.search,
  );
  applyParam(params, STATUS_PARAM, filters.status, DEFAULT_FILTERS.status);

  return params;
}

function applyParam(
  params: URLSearchParams,
  key: string,
  value: string,
  defaultValue: string,
): void {
  if (value === defaultValue) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
}

/** True when the filters differ from the defaults, i.e. the list is narrowed. */
export function hasActiveFilters(filters: DeviceFilters): boolean {
  return (
    filters.search !== DEFAULT_FILTERS.search ||
    filters.status !== DEFAULT_FILTERS.status
  );
}
