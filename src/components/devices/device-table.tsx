import type { Device } from "@/features/devices/types";

import { DeviceStatusBadge } from "./device-status-badge";

/** Desktop presentation. The card list covers narrow viewports. */
export function DeviceTable({ devices }: { devices: readonly Device[] }) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
