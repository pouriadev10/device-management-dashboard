import { Button } from "@/components/ui/button";
import type { Device } from "@/features/devices/types";

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
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={`Delete ${device.name}`}
      className="text-muted hover:text-rose-600 dark:hover:text-rose-400"
      onClick={() => onDelete(device)}
    >
      Delete
    </Button>
  );
}
