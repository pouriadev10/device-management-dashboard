"use client";

import { useDevices } from "@/features/devices/queries";

import { DeviceList } from "./device-list";

export function DevicesDashboard() {
  const { data: devices, isPending, isError, refetch } = useDevices();

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
        <h3 className="font-medium text-rose-800 dark:text-rose-200">
          Could not load devices
        </h3>
        <p className="mt-1 text-sm text-rose-700/80 dark:text-rose-300/80">
          Something went wrong while reaching the device registry.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return <DeviceList devices={devices ?? []} isPending={isPending} />;
}
