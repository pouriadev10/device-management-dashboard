"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { AlertIcon } from "@/components/ui/icons";
import { filterDevices } from "@/features/devices/filter-devices";
import {
  DEFAULT_FILTERS,
  hasActiveFilters,
} from "@/features/devices/filter-params";
import { useDeleteDevice, useDevices } from "@/features/devices/queries";
import type { Device } from "@/features/devices/types";
import { useDeviceFilters } from "@/features/devices/use-device-filters";
import { useI18n } from "@/features/i18n/i18n-provider";

import { DeleteDeviceDialog } from "./delete-device-dialog";
import { DeviceEmptyState } from "./device-empty-state";
import { DeviceFilterBar } from "./device-filter-bar";
import { DeviceList } from "./device-list";

const NO_DEVICES: readonly Device[] = [];

export function DevicesDashboard() {
  const { t } = useI18n();
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
      <div className="border-danger-border bg-danger-soft rounded-panel border px-6 py-10 text-center">
        <span className="text-danger mx-auto grid size-12 place-items-center">
          <AlertIcon className="size-6" />
        </span>
        <h3 className="text-danger mt-2 font-medium">
          {t("devices.error.title")}
        </h3>
        <p className="text-muted mx-auto mt-1.5 max-w-sm text-sm text-pretty">
          {t("devices.error.description")}
        </p>
        <Button
          variant="danger"
          className="mt-5"
          onClick={() => void refetch()}
        >
          {t("devices.error.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DeviceFilterBar
        filters={filters}
        onSearchChange={(search) => setFilters({ search })}
        onStatusChange={(status) => setFilters({ status })}
      />

      <p aria-live="polite" className="text-muted text-sm">
        {isPending
          ? t("devices.loading")
          : t("devices.count", {
              shown: visibleDevices.length,
              total: devices.length,
              count: devices.length,
            })}
      </p>

      <DeviceList
        devices={visibleDevices}
        isPending={isPending}
        onDelete={setDeviceToDelete}
        emptyState={
          hasActiveFilters(filters) ? (
            <DeviceEmptyState
              title={t("devices.noMatches.title")}
              description={t("devices.noMatches.description")}
              action={
                <Button
                  variant="secondary"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  {t("filters.clear")}
                </Button>
              }
            />
          ) : (
            <DeviceEmptyState
              title={t("devices.empty.title")}
              description={t("devices.empty.description")}
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
