import { Button } from "@/components/ui/button";
import type { Device } from "@/features/devices/types";

import { DeviceStatusBadge } from "./device-status-badge";

type DeviceTableProps = {
  devices: readonly Device[];
  onDelete: (device: Device) => void;
};

/** Desktop presentation. The card list covers narrow viewports. */
export function DeviceTable({ devices, onDelete }: DeviceTableProps) {
  return (
    <div className="bg-surface hidden overflow-hidden rounded-2xl border md:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-muted text-muted text-xs tracking-wide uppercase">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">
              Device
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              IP address
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Last ping
            </th>
            <th scope="col" className="px-5 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr
              key={device.id}
              className="hover:bg-surface-muted/60 border-t transition-colors"
            >
              <th scope="row" className="px-5 py-4 font-medium">
                {device.name}
              </th>
              <td className="text-muted px-5 py-4 font-mono">{device.ip}</td>
              <td className="px-5 py-4">
                <DeviceStatusBadge status={device.status} />
              </td>
              <td className="text-muted px-5 py-4">{device.lastPing}</td>
              <td className="px-5 py-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Delete ${device.name}`}
                  className="text-muted hover:text-rose-600 dark:hover:text-rose-400"
                  onClick={() => onDelete(device)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
