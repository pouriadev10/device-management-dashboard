import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MOCK_DEVICES } from "@/features/devices/mock-data";
import type { Device } from "@/features/devices/types";

import { DeviceList } from "./device-list";

const emptyState = <p>Nothing to show</p>;

function renderList({
  devices = MOCK_DEVICES,
  isPending = false,
}: {
  devices?: readonly Device[];
  isPending?: boolean;
} = {}) {
  const onDelete = vi.fn();

  render(
    <DeviceList
      devices={devices}
      isPending={isPending}
      emptyState={emptyState}
      onDelete={onDelete}
    />,
  );

  return { onDelete };
}

describe("DeviceList", () => {
  it("shows a skeleton while devices are loading", () => {
    renderList({ devices: [], isPending: true });

    expect(
      screen.getByRole("status", { name: "Loading devices" }),
    ).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("renders one table row per device", () => {
    renderList();

    const rows = within(screen.getByRole("table")).getAllByRole("row");

    // One header row plus a row per device.
    expect(rows).toHaveLength(MOCK_DEVICES.length + 1);
  });

  it("shows every field of a device", () => {
    renderList({ devices: MOCK_DEVICES.slice(0, 1) });

    const table = within(screen.getByRole("table"));

    expect(table.getByText("Core-Switch-01")).toBeVisible();
    expect(table.getByText("192.168.1.1")).toBeVisible();
    expect(table.getByText("Online")).toBeVisible();
    expect(table.getByText("2 minutes ago")).toBeVisible();
  });

  it("renders a card for each device alongside the table", () => {
    renderList();

    // Both presentations are in the DOM; CSS shows exactly one at a time.
    expect(screen.getAllByRole("listitem")).toHaveLength(MOCK_DEVICES.length);
  });

  it("names the device in each delete button", () => {
    renderList({ devices: MOCK_DEVICES.slice(0, 1) });

    // One in the table, one in the card.
    expect(
      screen.getAllByRole("button", { name: "Delete Core-Switch-01" }),
    ).toHaveLength(2);
  });

  it("asks to delete the device whose button was pressed", () => {
    const { onDelete } = renderList();

    fireEvent.click(
      within(screen.getByRole("table")).getByRole("button", {
        name: "Delete Storage-NAS",
      }),
    );

    expect(onDelete).toHaveBeenCalledExactlyOnceWith(
      MOCK_DEVICES.find((device) => device.name === "Storage-NAS"),
    );
  });

  it("asks to delete from the card list too, not only the table", () => {
    const { onDelete } = renderList({ devices: MOCK_DEVICES.slice(2, 3) });

    // The cards are the mobile presentation; their button is a separate element
    // from the table's and has to be wired up in its own right.
    const card = screen.getByRole("listitem");
    fireEvent.click(
      within(card).getByRole("button", { name: "Delete Storage-NAS" }),
    );

    expect(onDelete).toHaveBeenCalledExactlyOnceWith(MOCK_DEVICES[2]);
  });

  it("shows the given empty state when there are no devices", () => {
    renderList({ devices: [] });

    expect(screen.getByText("Nothing to show")).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
