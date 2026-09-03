import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DocumentTitle } from "./document-title";
import { I18nProvider, useI18n } from "./i18n-provider";
import type { Locale } from "./locales";
function Probe() {
  const { locale, t, setLocale } = useI18n();

  return (
    <>
      <p data-testid="locale">{locale}</p>
      <p data-testid="message">{t("devices.title")}</p>
      <button type="button" onClick={() => setLocale("fa")}>
        Persian
      </button>
      <button type="button" onClick={() => setLocale("en")}>
        English
      </button>
    </>
  );
}

function renderProbe(locale: Locale = "en") {
  const user = userEvent.setup();

  render(
    <I18nProvider locale={locale}>
      <Probe />
    </I18nProvider>,
  );

  return { user };
}

const message = () => screen.getByTestId("message").textContent;

beforeEach(() => {
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
});

afterEach(() => {
  document.cookie = "locale=; path=/; max-age=0";
});

describe("I18nProvider", () => {
  it("renders in the language the server resolved", () => {
    renderProbe("fa");

    expect(message()).toBe("دستگاه‌ها");
  });

  it("translates without a provider at all", () => {
    // A component rendered on its own should still read as English rather than
    // throwing or falling back to raw message keys.
    render(<Probe />);

    expect(message()).toBe("Devices");
  });

  it("changes language without a round trip", async () => {
    const { user } = renderProbe();
    expect(message()).toBe("Devices");

    await user.click(screen.getByRole("button", { name: "Persian" }));

    expect(message()).toBe("دستگاه‌ها");
  });

  it("turns the document around with the language", async () => {
    const { user } = renderProbe();

    await user.click(screen.getByRole("button", { name: "Persian" }));

    expect(document.documentElement).toHaveAttribute("lang", "fa");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
  });

  it("remembers the choice for the next server render", async () => {
    const { user } = renderProbe();

    await user.click(screen.getByRole("button", { name: "Persian" }));

    expect(document.cookie).toContain("locale=fa");
  });

  it("does nothing when asked for the language already on screen", async () => {
    const { user } = renderProbe();

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(document.cookie).not.toContain("locale=");
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
  });
});

describe("DocumentTitle", () => {
  it("titles the tab in the language the page was served in", () => {
    render(
      <I18nProvider locale="fa">
        <DocumentTitle titleKey="devices.title" />
      </I18nProvider>,
    );

    expect(document.title).toBe("دستگاه‌ها · مدیریت دستگاه‌ها");
  });

  it("follows the language when it changes without a request", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider locale="en">
        <DocumentTitle titleKey="devices.title" />
        <Probe />
      </I18nProvider>,
    );
    expect(document.title).toBe("Devices · Device Management");

    await user.click(screen.getByRole("button", { name: "Persian" }));

    expect(document.title).toBe("دستگاه‌ها · مدیریت دستگاه‌ها");
  });
});
