"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAddDevice } from "@/features/devices/queries";

import { AddDeviceForm } from "./add-device-form";

export function AddDeviceDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const addDevice = useAddDevice();

  function close() {
    setIsOpen(false);
    addDevice.reset();
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add device</Button>

      <Dialog
        open={isOpen}
        onClose={close}
        title="Add a device"
        description="Register a device so it shows up in the list straight away."
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
