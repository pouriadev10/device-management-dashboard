import type { Device } from "@/features/devices/types";

import { DeviceCardList } from "./device-card-list";
import { DeviceEmptyState } from "./device-empty-state";
import { DeviceListSkeleton } from "./device-list-skeleton";
import { DeviceTable } from "./device-table";

type DeviceListProps = {
  devices: readonly Device[];
  isPending: boolean;
};

/**
 * Presentational: it decides between the loading, empty and populated views but
 * knows nothing about where the devices came from.
 */
export function DeviceList({ devices, isPending }: DeviceListProps) {
  if (isPending) {
    return <DeviceListSkeleton />;
  }

  if (devices.length === 0) {
    return (
      <DeviceEmptyState
        title="No devices yet"
        description="Devices you register will show up here with their latest reachability."
      />
    );
  }

  return (
    <>
      <DeviceTable devices={devices} />
      <DeviceCardList devices={devices} />
    </>
  );
}
