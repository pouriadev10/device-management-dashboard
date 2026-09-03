import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_ATTRIBUTE } from "@/features/theme/theme";

import { ThemeToggle } from "./theme-toggle";

const root = () => document.documentElement;

beforeEach(() => {
  root().removeAttribute(THEME_ATTRIBUTE);
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.cookie = "theme=; path=/; max-age=0";
});

describe("ThemeToggle", () => {
  it("carries a label for each theme", () => {
    // Which one is announced is decided in CSS, and there is no stylesheet
    // here — so what this can check is that neither is missing. Rendering both
    // is what makes the button right before any script has run.
    render(<ThemeToggle />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("Switch to dark theme");
    expect(button).toHaveTextContent("Switch to light theme");
  });

  it("switches the theme", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(root()).toHaveAttribute(THEME_ATTRIBUTE, "dark");
  });

  it("switches back", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));

    expect(root()).toHaveAttribute(THEME_ATTRIBUTE, "light");
  });
});
