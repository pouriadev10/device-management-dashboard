import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { createDevice, deleteDevice, fetchDevices } from "./api";
import { MOCK_DEVICES } from "./mock-data";
import { useAddDevice, useDeleteDevice, useDevices } from "./queries";
import type { Device } from "./types";

vi.mock("./api", () => ({
  fetchDevices: vi.fn(),
  createDevice: vi.fn(),
  deleteDevice: vi.fn(),
}));

const fetchDevicesMock = vi.mocked(fetchDevices);
const createDeviceMock = vi.mocked(createDevice);
const deleteDeviceMock = vi.mocked(deleteDevice);

const added: Device = {
  id: "99",
  name: "Edge-Router-02",
  ip: "10.0.0.42",
  status: "Online",
  lastPingMinutesAgo: 0,
};

function wrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/** Renders the list plus a mutation against one shared cache. */
function renderDevices() {
  const Wrapper = wrapper();

  const list = renderHook(() => useDevices(), { wrapper: Wrapper });
  const add = renderHook(() => useAddDevice(), { wrapper: Wrapper });
  const remove = renderHook(() => useDeleteDevice(), { wrapper: Wrapper });

  return { list, add, remove };
}

const names = (devices: Device[] | undefined) =>
  devices?.map((device) => device.name);

describe("device queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchDevicesMock.mockResolvedValue([...MOCK_DEVICES]);
    createDeviceMock.mockResolvedValue(added);
    deleteDeviceMock.mockResolvedValue(undefined);
  });

  it("loads the device list", async () => {
    const { list } = renderDevices();

    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));

    expect(names(list.result.current.data)).toEqual(
      MOCK_DEVICES.map((device) => device.name),
    );
  });

  it("shows a new device at the top of the list straight away", async () => {
    const { list, add } = renderDevices();
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));

    add.result.current.mutate({
      name: added.name,
      ip: added.ip,
      status: added.status,
    });

    await waitFor(() =>
      expect(names(list.result.current.data)?.[0]).toBe("Edge-Router-02"),
    );
    expect(list.result.current.data).toHaveLength(MOCK_DEVICES.length + 1);
  });

  it("adds without sending the list back through its loading state", async () => {
    const { list, add } = renderDevices();
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));
    expect(fetchDevicesMock).toHaveBeenCalledTimes(1);

    add.result.current.mutate({
      name: added.name,
      ip: added.ip,
      status: added.status,
    });
    await waitFor(() => expect(add.result.current.isSuccess).toBe(true));

    // Writing the result into the cache rather than invalidating is what keeps
    // the skeleton from flashing over data that is already on screen.
    expect(fetchDevicesMock).toHaveBeenCalledTimes(1);
    expect(list.result.current.isFetching).toBe(false);
  });

  it("drops the deleted device from the list", async () => {
    const { list, remove } = renderDevices();
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));

    remove.result.current.mutate("2");

    await waitFor(() =>
      expect(names(list.result.current.data)).not.toContain("Edge-Router"),
    );
    expect(list.result.current.data).toHaveLength(MOCK_DEVICES.length - 1);
  });

  it("leaves the other devices alone when one is deleted", async () => {
    const { list, remove } = renderDevices();
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));

    remove.result.current.mutate("2");

    await waitFor(() =>
      expect(names(list.result.current.data)).toEqual([
        "Core-Switch-01",
        "Storage-NAS",
        "Backup-Server",
      ]),
    );
  });

  it("deletes without refetching the list", async () => {
    const { list, remove } = renderDevices();
    await waitFor(() => expect(list.result.current.isSuccess).toBe(true));

    remove.result.current.mutate("2");
    await waitFor(() => expect(remove.result.current.isSuccess).toBe(true));

    expect(fetchDevicesMock).toHaveBeenCalledTimes(1);
  });

  it("surfaces a failure to load", async () => {
    fetchDevicesMock.mockRejectedValue(new Error("registry unreachable"));

    const { list } = renderDevices();

    await waitFor(() => expect(list.result.current.isError).toBe(true));
  });
});
