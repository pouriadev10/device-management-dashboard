import { describe, expect, it } from "vitest";

import { filterDevices } from "./filter-devices";
import { DEFAULT_FILTERS, type DeviceFilters } from "./filter-params";
import { MOCK_DEVICES } from "./mock-data";

const names = (filters: Partial<DeviceFilters>) =>
  filterDevices(MOCK_DEVICES, { ...DEFAULT_FILTERS, ...filters }).map(
    (device) => device.name,
  );

describe("filterDevices", () => {
  it("returns every device by default", () => {
    expect(names({})).toHaveLength(MOCK_DEVICES.length);
  });

  it("matches on device name", () => {
    expect(names({ search: "router" })).toEqual(["Edge-Router"]);
  });

  it("matches regardless of case", () => {
    expect(names({ search: "STORAGE" })).toEqual(["Storage-NAS"]);
  });

  it("matches on a partial IP address", () => {
    expect(names({ search: "192.168.1." })).toEqual([
      "Core-Switch-01",
      "Storage-NAS",
    ]);
  });

  it("ignores whitespace around the search term", () => {
    expect(names({ search: "  backup  " })).toEqual(["Backup-Server"]);
  });

  it("filters by status", () => {
    expect(names({ status: "Online" })).toEqual([
      "Core-Switch-01",
      "Backup-Server",
    ]);
    expect(names({ status: "Warning" })).toEqual(["Edge-Router"]);
  });

  it("applies search and status together", () => {
    expect(names({ search: "192.168", status: "Online" })).toEqual([
      "Core-Switch-01",
      "Backup-Server",
    ]);
  });

  it("returns nothing when the combination matches no device", () => {
    expect(names({ search: "router", status: "Offline" })).toEqual([]);
  });
});
