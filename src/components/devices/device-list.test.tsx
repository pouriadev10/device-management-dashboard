import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MOCK_DEVICES } from "@/features/devices/mock-data";

import { DeviceList } from "./device-list";

describe("DeviceList", () => {
  it("shows a skeleton while devices are loading", () => {
    render(<DeviceList devices={[]} isPending />);

    expect(
      screen.getByRole("status", { name: "Loading devices" }),
    ).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("renders one table row per device", () => {
    render(<DeviceList devices={MOCK_DEVICES} isPending={false} />);

    const rows = within(screen.getByRole("table")).getAllByRole("row");

    // One header row plus a row per device.
    expect(rows).toHaveLength(MOCK_DEVICES.length + 1);
  });

  it("shows every field of a device", () => {
    render(<DeviceList devices={MOCK_DEVICES.slice(0, 1)} isPending={false} />);

    const table = within(screen.getByRole("table"));

    expect(table.getByText("Core-Switch-01")).toBeVisible();
    expect(table.getByText("192.168.1.1")).toBeVisible();
    expect(table.getByText("Online")).toBeVisible();
    expect(table.getByText("2 mins ago")).toBeVisible();
  });

  it("renders a card for each device alongside the table", () => {
    render(<DeviceList devices={MOCK_DEVICES} isPending={false} />);

    // Both presentations are in the DOM; CSS shows exactly one at a time.
    expect(screen.getAllByRole("listitem")).toHaveLength(MOCK_DEVICES.length);
  });

  it("shows an empty state when there are no devices", () => {
    render(<DeviceList devices={[]} isPending={false} />);

    expect(screen.getByText("No devices yet")).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
