import type { Device } from "@/features/devices/types";

import { DeviceCard } from "./device-card";

type DeviceCardListProps = {
  devices: readonly Device[];
  onDelete: (device: Device) => void;
};

/**
 * Mobile presentation. Rendered alongside the table but only one of the two is
 * ever displayed, so assistive technology sees a single list of devices.
 */
export function DeviceCardList({ devices, onDelete }: DeviceCardListProps) {
  return (
    <ul className="grid gap-3 md:hidden">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} onDelete={onDelete} />
      ))}
    </ul>
  );
}
