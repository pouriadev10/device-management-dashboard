"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Device } from "@/features/devices/types";
import { useI18n } from "@/features/i18n/i18n-provider";

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
  const { t } = useI18n();

  return (
    <Dialog
      open={device !== null}
      onClose={onCancel}
      title={t("devices.delete.title")}
      description={
        device
          ? t("devices.delete.description", {
              name: device.name,
              ip: device.ip,
            })
          : undefined
      }
    >
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button
          variant="danger"
          disabled={isDeleting || device === null}
          onClick={() => device && onConfirm(device)}
        >
          {isDeleting
            ? t("devices.delete.pending")
            : t("devices.delete.confirm")}
        </Button>
      </div>
    </Dialog>
  );
}
