import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppHeader } from "./app-header";

describe("AppHeader", () => {
  it("identifies the application", () => {
    render(<AppHeader />);

    const header = screen.getByRole("banner");

    expect(header).toBeVisible();
    expect(header).toHaveTextContent("Device Management");
  });
});
