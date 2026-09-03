/**
 * The theme and the language are kept in cookies rather than in localStorage so
 * the server can read them while it renders. That is what removes the flash: the
 * first byte of HTML already carries the right `data-theme`, `lang` and `dir`,
 * and there is no blocking script in `<head>` making up for their absence.
 */
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function writePreferenceCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
}
