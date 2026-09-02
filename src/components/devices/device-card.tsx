import { Button } from "@/components/ui/button";
import type { Device } from "@/features/devices/types";

import { DeviceStatusBadge } from "./device-status-badge";

type DeviceCardProps = {
  device: Device;
  onDelete: (device: Device) => void;
};

export function DeviceCard({ device, onDelete }: DeviceCardProps) {
  return (
    <li className="bg-surface rounded-2xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium">{device.name}</h3>
        <DeviceStatusBadge status={device.status} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-muted text-xs">IP address</dt>
          <dd className="font-mono">{device.ip}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs">Last ping</dt>
          <dd>{device.lastPing}</dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-end border-t pt-3">
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Delete ${device.name}`}
          className="text-muted hover:text-rose-600 dark:hover:text-rose-400"
          onClick={() => onDelete(device)}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}
