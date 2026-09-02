import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "./dialog";

function renderDialog({
  open = true,
  description,
}: { open?: boolean; description?: string } = {}) {
  const onClose = vi.fn();

  const { rerender } = render(
    <Dialog
      open={open}
      onClose={onClose}
      title="Add a device"
      description={description}
    >
      <button type="button">Save</button>
    </Dialog>,
  );

  return { onClose, rerender };
}

describe("Dialog", () => {
  it("stays shut until it is opened", () => {
    renderDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is named by its title for assistive technology", () => {
    renderDialog();

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Add a device");
  });

  it("is described by its description when it has one", () => {
    renderDialog({ description: "Register a device." });

    expect(screen.getByRole("dialog")).toHaveAccessibleDescription(
      "Register a device.",
    );
  });

  it("closes when the backdrop is clicked", () => {
    const { onClose } = renderDialog();

    // The dialog element itself is the backdrop; the panel inside it is not.
    fireEvent.click(screen.getByRole("dialog"));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("ignores a click on the panel itself", () => {
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("reports a close it did not initiate, such as Escape", () => {
    const { onClose } = renderDialog();

    // Escape is handled by the element itself, which fires `close`.
    fireEvent(screen.getByRole("dialog"), new Event("close"));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shuts again when it is no longer open", () => {
    const { rerender, onClose } = renderDialog();

    rerender(
      <Dialog open={false} onClose={onClose} title="Add a device">
        <button type="button">Save</button>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
