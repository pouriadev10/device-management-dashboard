import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { I18nProvider } from "@/features/i18n/i18n-provider";
import type { Locale } from "@/features/i18n/locales";

import { LocaleToggle } from "./locale-toggle";
function renderToggle(locale: Locale = "en") {
  const user = userEvent.setup();

  render(
    <I18nProvider locale={locale}>
      <LocaleToggle />
    </I18nProvider>,
  );

  return { user };
}

const toggle = () => screen.getByRole("button");

afterEach(() => {
  document.cookie = "locale=; path=/; max-age=0";
});

describe("LocaleToggle", () => {
  it("offers the language you are not reading, named in itself", () => {
    renderToggle();

    expect(toggle()).toHaveTextContent("فارسی");
  });

  it("says what pressing it does, without hiding what is written on it", () => {
    // Voice control users say the visible word, so it has to be part of the
    // accessible name rather than replaced by it.
    renderToggle();

    expect(toggle()).toHaveAccessibleName("Switch language to فارسی");
  });

  it("switches the language", async () => {
    const { user } = renderToggle();

    await user.click(toggle());

    expect(toggle()).toHaveTextContent("English");
  });

  it("offers the way back from Persian", () => {
    renderToggle("fa");

    expect(toggle()).toHaveTextContent("English");
    expect(toggle()).toHaveAccessibleName("تغییر زبان به English");
  });
});
