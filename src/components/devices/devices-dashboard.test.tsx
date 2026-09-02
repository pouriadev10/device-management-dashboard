import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteDevice, fetchDevices } from "@/features/devices/api";
import { MOCK_DEVICES } from "@/features/devices/mock-data";

import { DevicesDashboard } from "./devices-dashboard";

vi.mock("@/features/devices/api", () => ({
  fetchDevices: vi.fn(),
  createDevice: vi.fn(),
  deleteDevice: vi.fn(),
}));

/**
 * Next.js patches the native history API so that `useSearchParams` re-renders
 * when the app calls `replaceState`. The dashboard depends on that, so the mock
 * models it rather than returning an inert snapshot — otherwise clearing the
 * filters would update the URL and leave the list showing the old one.
 */
vi.mock("next/navigation", async () => {
  const { useSyncExternalStore } = await import("react");

  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  };

  const replaceState = window.history.replaceState.bind(window.history);
  window.history.replaceState = (...args) => {
    replaceState(...args);
    notify();
  };

  const useLocation = <T,>(read: () => T) =>
    useSyncExternalStore(subscribe, read, read);

  return {
    usePathname: () => useLocation(() => window.location.pathname),
    useSearchParams: () =>
      new URLSearchParams(useLocation(() => window.location.search)),
  };
});

const fetchDevicesMock = vi.mocked(fetchDevices);
const deleteDeviceMock = vi.mocked(deleteDevice);

function renderDashboard(url = "/devices") {
  window.history.replaceState(null, "", url);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const user = userEvent.setup();

  render(
    <QueryClientProvider client={queryClient}>
      <DevicesDashboard />
    </QueryClientProvider>,
  );

  return { user };
}

const table = () => within(screen.getByRole("table"));

const loaded = () => screen.findByRole("table");

describe("DevicesDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchDevicesMock.mockResolvedValue([...MOCK_DEVICES]);
    deleteDeviceMock.mockResolvedValue(undefined);
  });

  it("says how many devices are showing once they arrive", async () => {
    renderDashboard();

    expect(await screen.findByText("Showing 4 of 4 devices")).toBeVisible();
  });

  it("counts a single device in the singular", async () => {
    fetchDevicesMock.mockResolvedValue([{ ...MOCK_DEVICES[0]! }]);

    renderDashboard();

    expect(await screen.findByText("Showing 1 of 1 device")).toBeVisible();
  });

  it("arrives already filtered when the URL carries filters", async () => {
    renderDashboard("/devices?status=Online");

    await loaded();

    expect(screen.getByText("Showing 2 of 4 devices")).toBeVisible();
    expect(table().queryByText("Edge-Router")).not.toBeInTheDocument();
  });

  it("narrows the list by the search term in the URL", async () => {
    renderDashboard("/devices?search=192.168.1.");

    await loaded();

    expect(table().getByText("Core-Switch-01")).toBeVisible();
    expect(table().getByText("Storage-NAS")).toBeVisible();
    expect(table().queryByText("Edge-Router")).not.toBeInTheDocument();
  });

  it("narrows the list when a status is picked in the filter bar", async () => {
    const { user } = renderDashboard();
    await loaded();

    await user.click(screen.getByRole("radio", { name: "Warning" }));

    // The choice has to reach the URL, and the list has to follow the URL.
    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).get("status")).toBe(
        "Warning",
      ),
    );
    expect(await screen.findByText("Showing 1 of 4 devices")).toBeVisible();
    expect(table().getByText("Edge-Router")).toBeVisible();
    expect(table().queryByText("Core-Switch-01")).not.toBeInTheDocument();
  });

  it("follows the search box into the URL once typing settles", async () => {
    vi.useFakeTimers();

    try {
      renderDashboard();
      // The mocked fetch resolves on the microtask queue, not on a timer.
      await act(async () => {});

      fireEvent.change(screen.getByLabelText(/search devices/i), {
        target: { value: "nas" },
      });

      // Still inside the debounce window: the URL has not moved yet.
      expect(window.location.search).toBe("");

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(new URLSearchParams(window.location.search).get("search")).toBe(
        "nas",
      );
      expect(screen.getByText("Showing 1 of 4 devices")).toBeVisible();
      expect(table().getByText("Storage-NAS")).toBeVisible();
    } finally {
      vi.useRealTimers();
    }
  });

  it("offers a way out when the filters match nothing", async () => {
    const { user } = renderDashboard("/devices?search=nothing-matches-this");

    const clear = await screen.findByRole("button", { name: "Clear filters" });
    expect(screen.getByText("No devices match these filters")).toBeVisible();

    await user.click(clear);

    await waitFor(() => expect(window.location.search).toBe(""));
    expect(await loaded()).toBeVisible();
  });

  it("distinguishes an empty registry from an empty result", async () => {
    fetchDevicesMock.mockResolvedValue([]);

    renderDashboard();

    expect(await screen.findByText("No devices yet")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Clear filters" }),
    ).not.toBeInTheDocument();
  });

  it("explains a failure to load and offers a retry", async () => {
    fetchDevicesMock.mockRejectedValueOnce(new Error("registry unreachable"));

    const { user } = renderDashboard();

    expect(await screen.findByText("Could not load devices")).toBeVisible();

    fetchDevicesMock.mockResolvedValue([...MOCK_DEVICES]);
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await loaded()).toBeVisible();
  });

  it("confirms before deleting, naming the device", async () => {
    const { user } = renderDashboard();
    await loaded();

    await user.click(
      table().getByRole("button", { name: "Delete Storage-NAS" }),
    );

    const dialog = within(screen.getByRole("dialog"));
    expect(
      dialog.getByText(/Storage-NAS \(192\.168\.1\.50\)/),
    ).toBeInTheDocument();
    expect(deleteDeviceMock).not.toHaveBeenCalled();
  });

  it("removes the device once the deletion is confirmed", async () => {
    const { user } = renderDashboard();
    await loaded();

    await user.click(
      table().getByRole("button", { name: "Delete Storage-NAS" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete device" }));

    await waitFor(() =>
      expect(table().queryByText("Storage-NAS")).not.toBeInTheDocument(),
    );
    // TanStack passes a mutation context alongside the variables.
    expect(deleteDeviceMock).toHaveBeenCalledOnce();
    expect(deleteDeviceMock.mock.calls[0]?.[0]).toBe("3");
    expect(screen.getByText("Showing 3 of 3 devices")).toBeVisible();
  });

  it("closes the confirmation without deleting when it is dismissed", async () => {
    const { user } = renderDashboard();
    await loaded();

    await user.click(
      table().getByRole("button", { name: "Delete Storage-NAS" }),
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(deleteDeviceMock).not.toHaveBeenCalled();
    expect(table().getByText("Storage-NAS")).toBeVisible();
  });
});
