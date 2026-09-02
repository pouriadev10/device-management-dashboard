import type { ReactNode } from "react";

import type { Device } from "@/features/devices/types";

import { DeviceCardList } from "./device-card-list";
import { DeviceListSkeleton } from "./device-list-skeleton";
import { DeviceTable } from "./device-table";

type DeviceListProps = {
  devices: readonly Device[];
  isPending: boolean;
  emptyState: ReactNode;
  onDelete: (device: Device) => void;
};

/**
 * Presentational: it decides between the loading, empty and populated views but
 * knows nothing about where the devices came from or why the list is empty.
 */
export function DeviceList({
  devices,
  isPending,
  emptyState,
  onDelete,
}: DeviceListProps) {
  if (isPending) {
    return <DeviceListSkeleton />;
  }

  if (devices.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <DeviceTable devices={devices} onDelete={onDelete} />
      <DeviceCardList devices={devices} onDelete={onDelete} />
    </>
  );
}
