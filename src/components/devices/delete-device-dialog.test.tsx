import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MOCK_DEVICES } from "@/features/devices/mock-data";
import type { Device } from "@/features/devices/types";

import { DeleteDeviceDialog } from "./delete-device-dialog";

const device = MOCK_DEVICES[0] as Device;

function setup({ open = true }: { open?: boolean } = {}) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  const user = userEvent.setup();

  render(
    <DeleteDeviceDialog
      device={open ? device : null}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />,
  );

  return { user, onConfirm, onCancel };
}

const confirmButton = () =>
  screen.getByRole("button", { name: "Delete device" });

describe("DeleteDeviceDialog", () => {
  it("stays closed until a device is chosen", () => {
    setup({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("names the device so the wrong one is not deleted by accident", () => {
    setup();

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(
      screen.getByText(/Core-Switch-01 \(192\.168\.1\.1\)/),
    ).toBeInTheDocument();
  });

  it("deletes nothing until it is confirmed", async () => {
    const { user, onConfirm, onCancel } = setup();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("passes the device back on confirmation", async () => {
    const { user, onConfirm } = setup();

    await user.click(confirmButton());

    expect(onConfirm).toHaveBeenCalledExactlyOnceWith(device);
  });

  it("blocks a second confirmation while the first is in flight", () => {
    const onConfirm = vi.fn();

    render(
      <DeleteDeviceDialog
        device={device}
        isDeleting
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
  });
});
