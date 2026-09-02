import type { DeviceFilters } from "./filter-params";
import type { Device } from "./types";

/**
 * Narrows the device list by status and by a free-text term matched against the
 * device name or its IP address. Pure, so it can be tested without rendering.
 */
export function filterDevices(
  devices: readonly Device[],
  filters: DeviceFilters,
): Device[] {
  const term = filters.search.trim().toLowerCase();

  return devices.filter((device) => {
    if (filters.status !== "All" && device.status !== filters.status) {
      return false;
    }

    if (term === "") return true;

    return (
      device.name.toLowerCase().includes(term) ||
      device.ip.toLowerCase().includes(term)
    );
  });
}
