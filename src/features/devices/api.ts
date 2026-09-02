import { MOCK_DEVICES } from "./mock-data";
import type { Device } from "./types";

/**
 * Stands in for a backend. The module-level array is the "database": it lives
 * for the lifetime of the tab, so devices added or removed during a session
 * survive refetches.
 */
const devices: Device[] = [...MOCK_DEVICES];

/** Artificial latency, so loading states are actually observable. */
const LATENCY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDevices(): Promise<Device[]> {
  await delay(LATENCY_MS);
  return [...devices];
}
