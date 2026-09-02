import { MOCK_DEVICES } from "./mock-data";
import type { Device, NewDeviceInput } from "./types";

/**
 * Stands in for a backend. The module-level array is the "database": it lives
 * for the lifetime of the tab, so devices added or removed during a session
 * survive refetches.
 */
const devices: Device[] = [...MOCK_DEVICES];

/** Artificial latency, so loading and pending states are actually observable. */
const READ_LATENCY_MS = 700;
const WRITE_LATENCY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDevices(): Promise<Device[]> {
  await delay(READ_LATENCY_MS);
  return [...devices];
}

export async function createDevice(input: NewDeviceInput): Promise<Device> {
  await delay(WRITE_LATENCY_MS);

  const device: Device = {
    id: crypto.randomUUID(),
    name: input.name,
    ip: input.ip,
    status: input.status,
    lastPing: "Just now",
  };

  devices.unshift(device);

  return device;
}

export async function deleteDevice(id: string): Promise<void> {
  await delay(WRITE_LATENCY_MS);

  const index = devices.findIndex((device) => device.id === id);
  if (index !== -1) devices.splice(index, 1);
}
