import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MOCK_DEVICES } from "./mock-data";

/**
 * The module keeps its devices in a module-level array that stands in for a
 * database. Each test therefore imports a fresh copy of the module rather than
 * sharing one store, so nothing leaks from one case into the next.
 */
async function loadApi() {
  vi.resetModules();
  return import("./api");
}

/** Pushes past the module's artificial latency without waiting for real time. */
async function settle<T>(promise: Promise<T>): Promise<T> {
  await vi.advanceTimersByTimeAsync(1000);
  return promise;
}

const newDevice = { name: "Edge-Router-02", ip: "10.0.0.42" } as const;

describe("devices api", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("serves the seed devices", async () => {
    const { fetchDevices } = await loadApi();

    expect(await settle(fetchDevices())).toEqual([...MOCK_DEVICES]);
  });

  it("does not let a caller mutate the store through the list it was given", async () => {
    const { fetchDevices } = await loadApi();

    const first = await settle(fetchDevices());
    first.pop();

    expect(await settle(fetchDevices())).toHaveLength(MOCK_DEVICES.length);
  });

  it("adds a device to the front of the list", async () => {
    const { createDevice, fetchDevices } = await loadApi();

    const created = await settle(
      createDevice({ ...newDevice, status: "Warning" }),
    );

    expect(created).toMatchObject({
      name: "Edge-Router-02",
      ip: "10.0.0.42",
      status: "Warning",
      lastPing: "Just now",
    });
    expect(created.id).toEqual(expect.any(String));

    const devices = await settle(fetchDevices());
    expect(devices[0]).toEqual(created);
    expect(devices).toHaveLength(MOCK_DEVICES.length + 1);
  });

  it("gives each new device its own id", async () => {
    const { createDevice } = await loadApi();

    const first = await settle(
      createDevice({ ...newDevice, status: "Online" }),
    );
    const second = await settle(
      createDevice({ ...newDevice, status: "Online" }),
    );

    expect(first.id).not.toBe(second.id);
  });

  it("removes the device it was asked to remove", async () => {
    const { deleteDevice, fetchDevices } = await loadApi();

    await settle(deleteDevice("2"));

    const names = (await settle(fetchDevices())).map((device) => device.name);
    expect(names).not.toContain("Edge-Router");
    expect(names).toHaveLength(MOCK_DEVICES.length - 1);
  });

  it("ignores a delete for a device that is not there", async () => {
    const { deleteDevice, fetchDevices } = await loadApi();

    await settle(deleteDevice("does-not-exist"));

    expect(await settle(fetchDevices())).toHaveLength(MOCK_DEVICES.length);
  });

  it("starts from the seed data again in a fresh module", async () => {
    const { createDevice } = await loadApi();
    await settle(createDevice({ ...newDevice, status: "Online" }));

    const { fetchDevices } = await loadApi();

    expect(await settle(fetchDevices())).toHaveLength(MOCK_DEVICES.length);
  });
});
