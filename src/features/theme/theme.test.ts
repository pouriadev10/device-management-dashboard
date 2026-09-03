import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { applyTheme, parseTheme, resolveTheme, THEME_ATTRIBUTE } from "./theme";

/** jsdom answers every media query with `false`, so dark has to be stood in for. */
function stubSystemTheme(dark: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: dark && query.includes("prefers-color-scheme: dark"),
    media: query,
  }));
}

beforeEach(() => {
  document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  document.cookie = "theme=; path=/; max-age=0";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseTheme", () => {
  it.each(["light", "dark"] as const)("reads %s", (theme) => {
    expect(parseTheme(theme)).toBe(theme);
  });

  it.each([undefined, null, "", "system", "Dark"])(
    "treats %s as no choice at all",
    (value) => {
      // Not "light": the difference between an unset theme and a chosen light
      // one is what decides whether the operating system still gets a say.
      expect(parseTheme(value)).toBeUndefined();
    },
  );
});

describe("resolveTheme", () => {
  it("prefers the choice written on the document", () => {
    stubSystemTheme(true);
    document.documentElement.setAttribute(THEME_ATTRIBUTE, "light");

    expect(resolveTheme()).toBe("light");
  });

  it("falls back to the operating system", () => {
    stubSystemTheme(true);

    expect(resolveTheme()).toBe("dark");
  });

  it("is light when the system asks for nothing else", () => {
    stubSystemTheme(false);

    expect(resolveTheme()).toBe("light");
  });
});

describe("applyTheme", () => {
  it("puts the theme on the document", () => {
    applyTheme("dark");

    expect(document.documentElement).toHaveAttribute(THEME_ATTRIBUTE, "dark");
  });

  it("remembers it, so the next server render starts there", () => {
    applyTheme("dark");

    expect(document.cookie).toContain("theme=dark");
  });
});
