import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDeviceFilters } from "./use-device-filters";

// The hook's whole job is to read and write the address bar, so the navigation
// hooks are backed by the real jsdom location rather than by fixed values.
// Deliberately inert: these tests drive re-renders themselves, so that reading
// the URL and reacting to it can be checked separately. The dashboard test uses
// a reactive mock instead, to cover the two working together.
vi.mock("next/navigation", () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

const goTo = (url: string) => window.history.replaceState(null, "", url);

const url = () => window.location.pathname + window.location.search;

describe("useDeviceFilters", () => {
  beforeEach(() => {
    goTo("/devices");
  });

  it("reads the filters out of the URL", () => {
    goTo("/devices?search=router&status=Warning");

    const { result } = renderHook(() => useDeviceFilters());

    expect(result.current.filters).toEqual({
      search: "router",
      status: "Warning",
    });
  });

  it("falls back to the defaults when the URL carries none", () => {
    const { result } = renderHook(() => useDeviceFilters());

    expect(result.current.filters).toEqual({ search: "", status: "All" });
  });

  it("writes a changed filter into the URL", () => {
    const { result } = renderHook(() => useDeviceFilters());

    act(() => result.current.setFilters({ search: "nas" }));

    expect(url()).toBe("/devices?search=nas");
  });

  it("patches one filter without disturbing the other", () => {
    goTo("/devices?search=nas&status=Online");

    const { result } = renderHook(() => useDeviceFilters());

    act(() => result.current.setFilters({ status: "Offline" }));

    expect(url()).toBe("/devices?search=nas&status=Offline");
  });

  it("leaves a bare path behind when the filters go back to their defaults", () => {
    goTo("/devices?search=nas&status=Online");

    const { result } = renderHook(() => useDeviceFilters());

    act(() => result.current.setFilters({ search: "", status: "All" }));

    expect(url()).toBe("/devices");
    expect(window.location.search).toBe("");
  });

  it("keeps params it does not own", () => {
    goTo("/devices?ref=email");

    const { result } = renderHook(() => useDeviceFilters());

    act(() => result.current.setFilters({ search: "nas" }));

    expect(url()).toBe("/devices?ref=email&search=nas");
  });

  it("patches the live URL, not the one from the render it was created in", () => {
    goTo("/devices");

    const { result } = renderHook(() => useDeviceFilters());

    // A debounced search write is captured while the URL is still empty...
    const publishSearch = result.current.setFilters;

    // ...the status changes before it lands...
    goTo("/devices?status=Offline");

    // ...and only then does the pending write go through.
    act(() => publishSearch({ search: "router" }));

    // It must add to what is actually in the URL rather than reverting the
    // status back to the snapshot it was created with.
    expect(new URLSearchParams(window.location.search).get("status")).toBe(
      "Offline",
    );
    expect(new URLSearchParams(window.location.search).get("search")).toBe(
      "router",
    );
  });

  it("replaces the history entry instead of stacking one per keystroke", () => {
    const { result } = renderHook(() => useDeviceFilters());
    const before = window.history.length;

    act(() => result.current.setFilters({ search: "r" }));
    act(() => result.current.setFilters({ search: "ro" }));
    act(() => result.current.setFilters({ search: "rou" }));

    expect(window.history.length).toBe(before);
  });

  it("re-reads the filters when the URL changes underneath it", () => {
    const { result, rerender } = renderHook(() => useDeviceFilters());

    expect(result.current.filters.status).toBe("All");

    goTo("/devices?status=Warning");
    rerender();

    expect(result.current.filters.status).toBe("Warning");
  });
});
