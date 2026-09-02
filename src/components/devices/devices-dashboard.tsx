"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { filterDevices } from "@/features/devices/filter-devices";
import {
  DEFAULT_FILTERS,
  hasActiveFilters,
} from "@/features/devices/filter-params";
import { useDeleteDevice, useDevices } from "@/features/devices/queries";
import type { Device } from "@/features/devices/types";
import { useDeviceFilters } from "@/hooks/use-device-filters";

import { DeleteDeviceDialog } from "./delete-device-dialog";
import { DeviceEmptyState } from "./device-empty-state";
import { DeviceFilters } from "./device-filters";
import { DeviceList } from "./device-list";

const NO_DEVICES: readonly Device[] = [];

export function DevicesDashboard() {
  const { filters, setFilters } = useDeviceFilters();
  const { data, isPending, isError, refetch } = useDevices();
  const deleteDevice = useDeleteDevice();

  // Holding the device rather than a boolean means the confirmation can name it.
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  const devices = data ?? NO_DEVICES;
  const visibleDevices = useMemo(
    () => filterDevices(devices, filters),
    [devices, filters],
  );

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
        <h3 className="font-medium text-rose-800 dark:text-rose-200">
          Could not load devices
        </h3>
        <p className="mt-1 text-sm text-rose-700/80 dark:text-rose-300/80">
          Something went wrong while reaching the device registry.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={() => void refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DeviceFilters
        filters={filters}
        onSearchChange={(search) => setFilters({ search })}
        onStatusChange={(status) => setFilters({ status })}
      />

      <p aria-live="polite" className="text-muted text-sm">
        {isPending
          ? "Loading devices…"
          : `Showing ${visibleDevices.length} of ${devices.length} ${
              devices.length === 1 ? "device" : "devices"
            }`}
      </p>

      <DeviceList
        devices={visibleDevices}
        isPending={isPending}
        onDelete={setDeviceToDelete}
        emptyState={
          hasActiveFilters(filters) ? (
            <DeviceEmptyState
              title="No devices match these filters"
              description="Try a different name or IP address, or widen the status filter."
              action={
                <Button
                  variant="secondary"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <DeviceEmptyState
              title="No devices yet"
              description="Devices you register will show up here with their latest reachability."
            />
          )
        }
      />

      <DeleteDeviceDialog
        device={deviceToDelete}
        isDeleting={deleteDevice.isPending}
        onCancel={() => setDeviceToDelete(null)}
        onConfirm={(device) =>
          deleteDevice.mutate(device.id, {
            onSuccess: () => setDeviceToDelete(null),
          })
        }
      />
    </div>
  );
}
