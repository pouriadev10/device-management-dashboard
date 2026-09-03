import type { Device } from "@/features/devices/types";
import { useI18n } from "@/features/i18n/i18n-provider";

import { DeleteDeviceButton } from "./delete-device-button";
import { DeviceStatusBadge } from "./device-status-badge";

type DeviceCardProps = {
  device: Device;
  onDelete: (device: Device) => void;
};

export function DeviceCard({ device, onDelete }: DeviceCardProps) {
  const { t, formatRelativeMinutes } = useI18n();

  return (
    <li className="bg-surface rounded-panel shadow-panel border p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium">
          <bdi>{device.name}</bdi>
        </h3>
        <DeviceStatusBadge status={device.status} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-muted text-xs">{t("devices.column.ip")}</dt>
          <dd className="font-mono">
            <bdi>{device.ip}</bdi>
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs">{t("devices.column.lastPing")}</dt>
          <dd>{formatRelativeMinutes(device.lastPingMinutesAgo)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-end border-t pt-3">
        <DeleteDeviceButton device={device} onDelete={onDelete} />
      </div>
    </li>
  );
}
