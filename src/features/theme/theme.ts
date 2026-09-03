import { writePreferenceCookie } from "@/lib/preference-cookie";

export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_COOKIE = "theme";

/** Set on `<html>`; the stylesheet reads it to pin `color-scheme`. */
export const THEME_ATTRIBUTE = "data-theme";

export function parseTheme(
  value: string | null | undefined,
): Theme | undefined {
  return THEMES.find((theme) => theme === value);
}

/**
 * The theme actually on screen: the stored choice if there is one, otherwise
 * whatever the operating system asked for.
 *
 * Read from the document rather than from React state on purpose. Before anyone
 * has chosen, the answer lives in a media query and nowhere else, and reading it
 * on demand means the toggle never has to render a guess and correct it once it
 * hydrates.
 */
export function resolveTheme(): Theme {
  const chosen = parseTheme(
    document.documentElement.getAttribute(THEME_ATTRIBUTE),
  );
  if (chosen) return chosen;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Applies a theme to the page and remembers it for the next server render. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  writePreferenceCookie(THEME_COOKIE, theme);
}
