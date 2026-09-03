import type { Metadata } from "next";

import { DevicesDashboard } from "@/components/devices/devices-dashboard";
import { DevicesHeader } from "@/components/devices/devices-header";
import { getServerTranslator } from "@/features/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();

  return { title: t("devices.title") };
}

export default async function DevicesPage(props: PageProps<"/devices">) {
  // Reading searchParams opts this route into dynamic rendering, which is what
  // makes the permalink work properly: useSearchParams() inside the dashboard is
  // then already populated during the server render, so a shared link arrives
  // filtered instead of flashing the full list and correcting itself.
  await props.searchParams;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <DevicesHeader />

      <div className="mt-8">
        <DevicesDashboard />
      </div>
    </main>
  );
}
