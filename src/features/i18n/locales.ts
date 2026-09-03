/** The languages the interface is available in. */
export const LOCALES = ["en", "fa"] as const;

export type Locale = (typeof LOCALES)[number];

export type Direction = "ltr" | "rtl";

export const DEFAULT_LOCALE: Locale = "en";

/** Where the choice is kept, so the server can render in the right language. */
export const LOCALE_COOKIE = "locale";

export const LOCALE_DIRECTION: Record<Locale, Direction> = {
  en: "ltr",
  fa: "rtl",
};

/**
 * Each language named in itself. A switcher that says "Persian" is no use to
 * someone who cannot read the language it is currently in, which is exactly the
 * person reaching for it.
 */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
};

/** Anything unrecognised — a stale cookie, a hand-edited one — reads as English. */
export function parseLocale(value: string | null | undefined): Locale {
  return LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE;
}

export function isRtl(locale: Locale): boolean {
  return LOCALE_DIRECTION[locale] === "rtl";
}
