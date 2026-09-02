"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Device } from "@/features/devices/types";

type DeleteDeviceDialogProps = {
  /** The device awaiting confirmation, or null when the dialog is closed. */
  device: Device | null;
  isDeleting?: boolean;
  onConfirm: (device: Device) => void;
  onCancel: () => void;
};

export function DeleteDeviceDialog({
  device,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteDeviceDialogProps) {
  return (
    <Dialog
      open={device !== null}
      onClose={onCancel}
      title="Delete this device?"
      description={
        device
          ? `${device.name} (${device.ip}) will be removed from the list. This cannot be undone.`
          : undefined
      }
    >
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={isDeleting || device === null}
          onClick={() => device && onConfirm(device)}
        >
          {isDeleting ? "Deleting…" : "Delete device"}
        </Button>
      </div>
    </Dialog>
  );
}
