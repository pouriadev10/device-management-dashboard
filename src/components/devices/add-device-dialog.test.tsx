import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDevice } from "@/features/devices/api";

import { AddDeviceDialog } from "./add-device-dialog";

vi.mock("@/features/devices/api", () => ({
  fetchDevices: vi.fn(),
  createDevice: vi.fn(),
  deleteDevice: vi.fn(),
}));

const createDeviceMock = vi.mocked(createDevice);

const created = {
  id: "99",
  name: "Edge-Router-02",
  ip: "10.0.0.42",
  status: "Online",
  lastPing: "Just now",
} as const;

function renderDialog() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const user = userEvent.setup();

  render(
    <QueryClientProvider client={queryClient}>
      <AddDeviceDialog />
    </QueryClientProvider>,
  );

  return { user };
}

const openButton = () => screen.getByRole("button", { name: "Add device" });

const nameField = () => screen.getByLabelText("Device name");

/** The submit button inside the dialog, as opposed to the one that opens it. */
const submitButton = () =>
  screen.getAllByRole("button", { name: "Add device" }).at(-1)!;

async function fillIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(nameField(), "Edge-Router-02");
  await user.type(screen.getByLabelText("IP address"), "10.0.0.42");
}

describe("AddDeviceDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createDeviceMock.mockResolvedValue({ ...created });
  });

  it("keeps the form out of the way until it is asked for", () => {
    renderDialog();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the form", async () => {
    const { user } = renderDialog();

    await user.click(openButton());

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(nameField()).toBeVisible();
  });

  it("registers the device and closes itself", async () => {
    const { user } = renderDialog();
    await user.click(openButton());

    await fillIn(user);
    await user.click(submitButton());

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(createDeviceMock).toHaveBeenCalledOnce();
    expect(createDeviceMock.mock.calls[0]?.[0]).toEqual({
      name: "Edge-Router-02",
      ip: "10.0.0.42",
      status: "Online",
    });
  });

  it("adds nothing when the form is dismissed", async () => {
    const { user } = renderDialog();
    await user.click(openButton());

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(createDeviceMock).not.toHaveBeenCalled();
  });

  it("starts blank on reopening rather than showing the last attempt", async () => {
    const { user } = renderDialog();

    await user.click(openButton());
    await user.type(nameField(), "Half-typed-name");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    await user.click(openButton());

    expect(nameField()).toHaveValue("");
  });

  it("does not close on a device the form rejected", async () => {
    const { user } = renderDialog();
    await user.click(openButton());

    await user.type(nameField(), "Edge-Router-02");
    await user.type(screen.getByLabelText("IP address"), "999.1.1.1");
    await user.click(submitButton());

    expect(
      await screen.findByText("Enter a valid IPv4 address, e.g. 192.168.1.1"),
    ).toBeVisible();
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(createDeviceMock).not.toHaveBeenCalled();
  });

  it("stays open and reports the wait while the device is being registered", async () => {
    createDeviceMock.mockImplementation(
      () => new Promise(() => {}) as Promise<typeof created>,
    );

    const { user } = renderDialog();
    await user.click(openButton());
    await fillIn(user);
    await user.click(submitButton());

    expect(
      await screen.findByRole("button", { name: "Adding…" }),
    ).toBeDisabled();
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});
