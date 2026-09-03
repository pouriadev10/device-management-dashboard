"use client";

import { DocumentTitle } from "@/features/i18n/document-title";
import { useI18n } from "@/features/i18n/i18n-provider";

import { AddDeviceDialog } from "./add-device-dialog";

/**
 * A client component so the language switch lands in one frame. Rendered on the
 * server, this heading would keep the language of the request that fetched it
 * while everything around it changed — exactly the seam the transition exists to
 * avoid.
 */
export function DevicesHeader() {
  const { t } = useI18n();

  return (
    <>
      <DocumentTitle titleKey="devices.title" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {t("devices.title")}
          </h1>
          <p className="text-muted max-w-prose text-sm text-pretty">
            {t("devices.subtitle")}
          </p>
        </div>

        <AddDeviceDialog />
      </div>
    </>
  );
}
