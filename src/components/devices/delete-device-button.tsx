import { Button } from "@/components/ui/button";
import type { Device } from "@/features/devices/types";
import { useI18n } from "@/features/i18n/i18n-provider";

type DeleteDeviceButtonProps = {
  device: Device;
  onDelete: (device: Device) => void;
};

/**
 * Shared by the table and the card so the two presentations cannot drift apart.
 * The accessible name matters most: every row offers the same "Delete", and the
 * device name is the only thing telling one button from another.
 */
export function DeleteDeviceButton({
  device,
  onDelete,
}: DeleteDeviceButtonProps) {
  const { t } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={t("devices.delete.label", { name: device.name })}
      className="text-danger hover:bg-danger-soft hover:text-danger"
      onClick={() => onDelete(device)}
    >
      {t("devices.delete")}
    </Button>
  );
}
