import type { ReactNode } from "react";

import type { Device } from "@/features/devices/types";

import { DeviceCardList } from "./device-card-list";
import { DeviceListSkeleton } from "./device-list-skeleton";
import { DeviceTable } from "./device-table";

type DeviceListProps = {
  devices: readonly Device[];
  isPending: boolean;
  emptyState: ReactNode;
};

/**
 * Presentational: it decides between the loading, empty and populated views but
 * knows nothing about where the devices came from or why the list is empty.
 */
export function DeviceList({
  devices,
  isPending,
  emptyState,
}: DeviceListProps) {
  if (isPending) {
    return <DeviceListSkeleton />;
  }

  if (devices.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <DeviceTable devices={devices} />
      <DeviceCardList devices={devices} />
    </>
  );
}
