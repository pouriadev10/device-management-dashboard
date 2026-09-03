import type { Device } from "./types";

/** Seed data for the dashboard. There is no backend; this stands in for one. */
export const MOCK_DEVICES: readonly Device[] = [
  {
    id: "1",
    name: "Core-Switch-01",
    ip: "192.168.1.1",
    status: "Online",
    lastPingMinutesAgo: 2,
  },
  {
    id: "2",
    name: "Edge-Router",
    ip: "10.0.0.1",
    status: "Warning",
    lastPingMinutesAgo: 15,
  },
  {
    id: "3",
    name: "Storage-NAS",
    ip: "192.168.1.50",
    status: "Offline",
    lastPingMinutesAgo: 120,
  },
  {
    id: "4",
    name: "Backup-Server",
    ip: "192.168.2.10",
    status: "Online",
    lastPingMinutesAgo: 0,
  },
];
