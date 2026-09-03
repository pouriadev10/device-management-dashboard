import type { Device } from "@/features/devices/types";
import { useI18n } from "@/features/i18n/i18n-provider";

import { DeleteDeviceButton } from "./delete-device-button";
import { DeviceStatusBadge } from "./device-status-badge";

type DeviceTableProps = {
  devices: readonly Device[];
  onDelete: (device: Device) => void;
};

/** Desktop presentation. The card list covers narrow viewports. */
export function DeviceTable({ devices, onDelete }: DeviceTableProps) {
  const { t, formatRelativeMinutes } = useI18n();

  return (
    <div className="bg-surface rounded-panel shadow-panel hidden overflow-hidden border md:block">
      <table className="w-full text-start text-sm">
        <thead className="bg-surface-muted text-muted border-b text-xs tracking-wide uppercase">
          <tr>
            <th scope="col" className="px-5 py-3 text-start font-medium">
              {t("devices.column.device")}
            </th>
            <th scope="col" className="px-5 py-3 text-start font-medium">
              {t("devices.column.ip")}
            </th>
            <th scope="col" className="px-5 py-3 text-start font-medium">
              {t("devices.column.status")}
            </th>
            <th scope="col" className="px-5 py-3 text-start font-medium">
              {t("devices.column.lastPing")}
            </th>
            <th scope="col" className="px-5 py-3">
              <span className="sr-only">{t("devices.column.actions")}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr
              key={device.id}
              className="hover:bg-surface-muted/60 border-t transition-colors duration-150 ease-out first:border-t-0"
            >
              <th scope="row" className="px-5 py-4 text-start font-medium">
                {/* Latin names and addresses inside a right-to-left page: `bdi`
                    keeps each one whole instead of letting the surrounding
                    direction reorder it. */}
                <bdi>{device.name}</bdi>
              </th>
              <td className="text-muted px-5 py-4 font-mono">
                <bdi>{device.ip}</bdi>
              </td>
              <td className="px-5 py-4">
                <DeviceStatusBadge status={device.status} />
              </td>
              <td className="text-muted px-5 py-4">
                {formatRelativeMinutes(device.lastPingMinutesAgo)}
              </td>
              <td className="px-5 py-4 text-end">
                <DeleteDeviceButton device={device} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
