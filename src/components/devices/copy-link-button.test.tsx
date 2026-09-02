import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyLinkButton } from "./copy-link-button";

const writeText = vi.fn<(text: string) => Promise<void>>();

function renderButton() {
  render(<CopyLinkButton />);
  return screen.getByRole("button");
}

/** Lets the click's promise settle while the timers are still faked. */
const flush = () => act(async () => {});

describe("CopyLinkButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset();
    writeText.mockResolvedValue(undefined);
    // userEvent installs its own clipboard stub, so the button is driven with
    // fireEvent here to keep this one in place.
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText },
    });
    window.history.replaceState(null, "", "/devices?search=nas&status=Online");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("invites a copy before anything has been copied", () => {
    expect(renderButton()).toHaveTextContent("Copy link");
  });

  it("copies the address including the filters", async () => {
    const button = renderButton();

    fireEvent.click(button);
    await flush();

    expect(writeText).toHaveBeenCalledExactlyOnceWith(window.location.href);
    expect(writeText.mock.calls[0]?.[0]).toContain("search=nas");
    expect(writeText.mock.calls[0]?.[0]).toContain("status=Online");
  });

  it("confirms the copy", async () => {
    const button = renderButton();

    fireEvent.click(button);
    await flush();

    expect(button).toHaveTextContent("Link copied");
  });

  it("goes back to offering a copy after a moment", async () => {
    const button = renderButton();

    fireEvent.click(button);
    await flush();
    expect(button).toHaveTextContent("Link copied");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(button).toHaveTextContent("Copy link");
  });

  it("stays quiet when the clipboard is unavailable", async () => {
    writeText.mockRejectedValue(new Error("denied"));

    const button = renderButton();

    fireEvent.click(button);
    await flush();

    // The URL is still in the address bar, so a blocked clipboard is not worth
    // interrupting anyone over — it just must not claim to have copied.
    expect(button).toHaveTextContent("Copy link");
  });
});
