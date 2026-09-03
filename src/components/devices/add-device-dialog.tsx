"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PlusIcon } from "@/components/ui/icons";
import { useAddDevice } from "@/features/devices/queries";
import { useI18n } from "@/features/i18n/i18n-provider";

import { AddDeviceForm } from "./add-device-form";

export function AddDeviceDialog() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const addDevice = useAddDevice();

  function close() {
    setIsOpen(false);
    addDevice.reset();
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        {t("devices.add")}
      </Button>

      <Dialog
        open={isOpen}
        onClose={close}
        title={t("devices.add.title")}
        description={t("devices.add.description")}
      >
        {/* Remounting on open clears whatever was typed during the last visit. */}
        {isOpen ? (
          <AddDeviceForm
            isSubmitting={addDevice.isPending}
            onCancel={close}
            onSubmit={(device) =>
              addDevice.mutate(device, { onSuccess: close })
            }
          />
        ) : null}
      </Dialog>
    </>
  );
}
