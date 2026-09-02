import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_FILTERS,
  type DeviceFilters,
} from "@/features/devices/filter-params";

import { DeviceFilterBar } from "./device-filter-bar";

function renderFilters(filters: DeviceFilters = DEFAULT_FILTERS) {
  const onSearchChange = vi.fn();
  const onStatusChange = vi.fn();

  const { rerender } = render(
    <DeviceFilterBar
      filters={filters}
      onSearchChange={onSearchChange}
      onStatusChange={onStatusChange}
    />,
  );

  return { onSearchChange, onStatusChange, rerender };
}

const searchBox = () => screen.getByLabelText(/search devices/i);

/** Types one character at a time, 50ms apart, the way a person would. */
function typeSearch(text: string) {
  for (let end = 1; end <= text.length; end += 1) {
    fireEvent.change(searchBox(), { target: { value: text.slice(0, end) } });
    act(() => {
      vi.advanceTimersByTime(50);
    });
  }
}

describe("DeviceFilterBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("publishes the search term once, after typing settles", () => {
    const { onSearchChange } = renderFilters();

    typeSearch("router");

    // Still inside the debounce window: nothing written to the URL yet.
    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onSearchChange).toHaveBeenCalledExactlyOnceWith("router");
  });

  it("shows what was typed straight away, even while debouncing", () => {
    renderFilters();

    typeSearch("nas");

    expect(searchBox()).toHaveValue("nas");
  });

  it("offers every status, including Warning", () => {
    renderFilters();

    expect(
      screen.getAllByRole("radio").map((radio) => radio.getAttribute("value")),
    ).toEqual(["All", "Online", "Offline", "Warning"]);
  });

  it("reports a status change immediately", () => {
    const { onStatusChange } = renderFilters();

    fireEvent.click(screen.getByRole("radio", { name: "Offline" }));

    expect(onStatusChange).toHaveBeenCalledExactlyOnceWith("Offline");
  });

  it("marks the active status from the incoming filters", () => {
    renderFilters({ search: "", status: "Warning" });

    expect(screen.getByRole("radio", { name: "Warning" })).toBeChecked();
  });

  it("abandons a pending search when the filters are cleared underneath it", () => {
    const onSearchChange = vi.fn();

    const { rerender } = render(
      <DeviceFilterBar
        filters={{ search: "zz", status: "Online" }}
        onSearchChange={onSearchChange}
        onStatusChange={vi.fn()}
      />,
    );

    // A keystroke lands, then the filters are cleared before it is published.
    fireEvent.change(searchBox(), { target: { value: "zzz" } });
    rerender(
      <DeviceFilterBar
        filters={DEFAULT_FILTERS}
        onSearchChange={onSearchChange}
        onStatusChange={vi.fn()}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // The stale keystroke must not resurrect the search it just replaced.
    expect(onSearchChange).not.toHaveBeenCalled();
    expect(searchBox()).toHaveValue("");
  });

  it("follows the URL when it changes from the outside", () => {
    const { rerender } = renderFilters({ search: "router", status: "All" });

    expect(searchBox()).toHaveValue("router");

    rerender(
      <DeviceFilterBar
        filters={DEFAULT_FILTERS}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

    expect(searchBox()).toHaveValue("");
  });
});
