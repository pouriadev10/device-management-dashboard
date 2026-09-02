import { describe, expect, it } from "vitest";

import {
  DEFAULT_FILTERS,
  hasActiveFilters,
  parseDeviceFilters,
  serializeDeviceFilters,
  type DeviceFilters,
} from "./filter-params";

const parse = (query: string) => parseDeviceFilters(new URLSearchParams(query));

const serialize = (filters: DeviceFilters, query = "") =>
  serializeDeviceFilters(filters, new URLSearchParams(query)).toString();

describe("parseDeviceFilters", () => {
  it("falls back to defaults when the query string is empty", () => {
    expect(parse("")).toEqual(DEFAULT_FILTERS);
  });

  it("reads the search term and status", () => {
    expect(parse("search=router&status=Online")).toEqual({
      search: "router",
      status: "Online",
    });
  });

  it("supports every status, including Warning", () => {
    expect(parse("status=Warning").status).toBe("Warning");
    expect(parse("status=Offline").status).toBe("Offline");
  });

  it("canonicalises a status given in the wrong case", () => {
    expect(parse("status=online").status).toBe("Online");
  });

  it("ignores an unknown status rather than filtering everything away", () => {
    expect(parse("status=banana").status).toBe("All");
  });

  it("trims the search term", () => {
    expect(parse("search=%20%20router%20%20").search).toBe("router");
  });
});

describe("serializeDeviceFilters", () => {
  it("omits values that are already the default", () => {
    expect(serialize(DEFAULT_FILTERS)).toBe("");
    expect(serialize({ search: "router", status: "All" })).toBe(
      "search=router",
    );
    expect(serialize({ search: "", status: "Offline" })).toBe("status=Offline");
  });

  it("writes both values when both are set", () => {
    expect(serialize({ search: "router", status: "Online" })).toBe(
      "search=router&status=Online",
    );
  });

  it("drops a param that has gone back to its default", () => {
    expect(serialize(DEFAULT_FILTERS, "search=router&status=Online")).toBe("");
  });

  it("leaves params it does not own alone", () => {
    expect(serialize({ search: "nas", status: "All" }, "ref=email")).toBe(
      "ref=email&search=nas",
    );
  });

  it("round-trips through parse without losing anything", () => {
    const filters: DeviceFilters = { search: "192.168", status: "Warning" };

    expect(parse(serialize(filters))).toEqual(filters);
  });
});

describe("hasActiveFilters", () => {
  it("is false for the default view", () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
  });

  it("is true once either filter is set", () => {
    expect(hasActiveFilters({ search: "nas", status: "All" })).toBe(true);
    expect(hasActiveFilters({ search: "", status: "Offline" })).toBe(true);
  });
});
