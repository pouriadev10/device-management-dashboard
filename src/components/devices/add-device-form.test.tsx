import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AddDeviceForm } from "./add-device-form";

function setup() {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  const user = userEvent.setup();

  render(<AddDeviceForm onSubmit={onSubmit} onCancel={onCancel} />);

  return { user, onSubmit, onCancel };
}

const submit = () => screen.getByRole("button", { name: "Add device" });
const nameField = () => screen.getByLabelText("Device name");
const ipField = () => screen.getByLabelText("IP address");

describe("AddDeviceForm", () => {
  it("reports both missing fields rather than only the first", async () => {
    const { user, onSubmit } = setup();

    await user.click(submit());

    expect(await screen.findByText("Device name is required")).toBeVisible();
    expect(screen.getByText("IP address is required")).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("explains what a valid IP address looks like", async () => {
    const { user, onSubmit } = setup();

    await user.type(nameField(), "Edge-Router-02");
    await user.type(ipField(), "192.168.1.256");
    await user.click(submit());

    expect(
      await screen.findByText("Enter a valid IPv4 address, e.g. 192.168.1.1"),
    ).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("ties each message to its field for assistive technology", async () => {
    const { user } = setup();

    await user.click(submit());
    await screen.findByText("Device name is required");

    expect(nameField()).toHaveAttribute("aria-invalid", "true");
    expect(nameField()).toHaveAccessibleDescription("Device name is required");
  });

  it("submits the trimmed values with the chosen status", async () => {
    const { user, onSubmit } = setup();

    await user.type(nameField(), "  Edge-Router-02  ");
    await user.type(ipField(), "10.0.0.42");
    await user.selectOptions(
      screen.getByLabelText("Initial status"),
      "Warning",
    );
    await user.click(submit());

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      name: "Edge-Router-02",
      ip: "10.0.0.42",
      status: "Warning",
    });
  });

  it("defaults the status to Online", () => {
    setup();

    expect(screen.getByLabelText("Initial status")).toHaveValue("Online");
  });

  it("clears a message once the field is corrected", async () => {
    const { user } = setup();

    await user.click(submit());
    await screen.findByText("Device name is required");

    await user.type(nameField(), "Edge-Router-02");

    await waitFor(() => {
      expect(
        screen.queryByText("Device name is required"),
      ).not.toBeInTheDocument();
    });
  });

  it("backs out without submitting", async () => {
    const { user, onSubmit, onCancel } = setup();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
