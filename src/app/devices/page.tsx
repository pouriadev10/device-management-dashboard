import type { Metadata } from "next";

import { DevicesDashboard } from "@/components/devices/devices-dashboard";

export const metadata: Metadata = { title: "Devices" };

export default async function DevicesPage(props: PageProps<"/devices">) {
  // Reading searchParams opts this route into dynamic rendering, which is what
  // makes the permalink work properly: useSearchParams() inside the dashboard is
  // then already populated during the server render, so a shared link arrives
  // filtered instead of flashing the full list and correcting itself.
  await props.searchParams;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Devices
        </h1>
        <p className="text-muted text-sm">
          Every device registered on the network, with its current reachability.
        </p>
      </div>

      <div className="mt-6">
        <DevicesDashboard />
      </div>
    </main>
  );
}
