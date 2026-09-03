import { describe, expect, it } from "vitest";

import { LOCALES, parseLocale } from "./locales";
import { CATALOGUES, type MessageKey } from "./messages";
import { getTranslator } from "./translate";

const en = getTranslator("en");
const fa = getTranslator("fa");

const keys = Object.keys(CATALOGUES.en) as MessageKey[];

const placeholders = (message: string) =>
  [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

describe("catalogues", () => {
  it.each(LOCALES)("says something in every message in %s", (locale) => {
    const blank = keys.filter((key) => CATALOGUES[locale][key].trim() === "");

    expect(blank).toEqual([]);
  });

  it("keeps the placeholders a translated message is given", () => {
    // A dropped `{name}` reads as a finished sentence and is easy to miss in
    // review, but leaves the dialog unable to say which device it means.
    const mismatched = keys.filter(
      (key) =>
        placeholders(CATALOGUES.fa[key]).join() !==
        placeholders(CATALOGUES.en[key]).join(),
    );

    expect(mismatched).toEqual([]);
  });
});

describe("parseLocale", () => {
  it("reads a known locale", () => {
    expect(parseLocale("fa")).toBe("fa");
  });

  it.each([undefined, null, "", "de", "en-GB"])(
    "falls back to English for %s",
    (value) => {
      expect(parseLocale(value)).toBe("en");
    },
  );
});

describe("getTranslator", () => {
  it("hands back the same translator for a locale", () => {
    expect(getTranslator("fa")).toBe(fa);
  });
});

describe("t", () => {
  it("fills placeholders in", () => {
    expect(en.t("devices.delete.label", { name: "Core-Switch-01" })).toBe(
      "Delete Core-Switch-01",
    );
  });

  it("leaves a placeholder it was given nothing for", () => {
    expect(en.t("devices.delete.label", { other: "x" })).toBe("Delete {name}");
  });

  it("counts one device in the singular", () => {
    expect(en.t("devices.count", { shown: 1, total: 1, count: 1 })).toBe(
      "Showing 1 of 1 device",
    );
  });

  it("counts several in the plural", () => {
    expect(en.t("devices.count", { shown: 2, total: 4, count: 4 })).toBe(
      "Showing 2 of 4 devices",
    );
  });

  it("counts in the digits of the language", () => {
    expect(fa.t("devices.count", { shown: 2, total: 4, count: 4 })).toContain(
      "۴",
    );
  });

  it("isolates a Latin value inside a right-to-left sentence", () => {
    // Without the isolate the brackets around the address end up on the wrong
    // sides of it, because the sentence around them runs the other way.
    const message = fa.t("devices.delete.description", {
      name: "Storage-NAS",
      ip: "192.168.1.50",
    });

    expect(message).toContain("⁨Storage-NAS⁩");
    expect(message).toContain("⁨192.168.1.50⁩");
  });

  it("leaves a left-to-right sentence unmarked", () => {
    expect(
      en.t("devices.delete.description", {
        name: "Storage-NAS",
        ip: "192.168.1.50",
      }),
    ).toBe(
      "Storage-NAS (192.168.1.50) will be removed from the list. This cannot be undone.",
    );
  });
});

describe("formatRelativeMinutes", () => {
  it("calls a device that answered this minute recently pinged", () => {
    expect(en.formatRelativeMinutes(0)).toBe("Just now");
    expect(fa.formatRelativeMinutes(0)).toBe("همین حالا");
  });

  it("counts minutes below the hour", () => {
    expect(en.formatRelativeMinutes(2)).toBe("2 minutes ago");
    expect(en.formatRelativeMinutes(59)).toBe("59 minutes ago");
  });

  it("moves up to hours, then to days", () => {
    expect(en.formatRelativeMinutes(120)).toBe("2 hours ago");
    expect(en.formatRelativeMinutes(60 * 24 * 3)).toBe("3 days ago");
  });

  it("words the same age in the language being read", () => {
    expect(fa.formatRelativeMinutes(120)).toContain("۲");
    expect(fa.formatRelativeMinutes(120)).not.toBe(
      en.formatRelativeMinutes(120),
    );
  });
});
