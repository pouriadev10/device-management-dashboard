"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import { writePreferenceCookie } from "@/lib/preference-cookie";
import { startViewTransition } from "@/lib/view-transition";

import { LOCALE_COOKIE, LOCALE_DIRECTION, type Locale } from "./locales";
import { defaultTranslator, getTranslator, type Translator } from "./translate";

type I18n = Translator & {
  setLocale: (locale: Locale) => void;
};

/**
 * The default is a working English translator rather than an error, so a
 * component can be rendered on its own — in a test, or in isolation — without
 * being wrapped first.
 */
const I18nContext = createContext<I18n>({
  ...defaultTranslator,
  setLocale: () => {},
});

/**
 * The locale arrives from the server, which read it from the cookie, so the
 * first render is already in the right language and reading direction. Changing
 * it afterwards is a purely client-side swap: everything on screen turns over in
 * one frame, and the query string holding the filters is left alone.
 *
 * Which means the server render is a starting point, not a live view — so
 * user-visible strings belong in client components. The alternative, refreshing
 * the server tree on every change, was worse than it looks: the layout renders
 * `lang`, `dir` and `data-theme` onto `<html>`, and the toggles write to those
 * same attributes directly. A refresh already in flight carries the values from
 * before the change and puts them back, so flipping the theme while the language
 * was still settling left the page dark with `theme=light` in the cookie. One
 * writer per attribute; the head metadata catches up in [DocumentTitle].
 */
export function I18nProvider({
  locale: initialLocale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocale] = useState(initialLocale);

  const changeLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      writePreferenceCookie(LOCALE_COOKIE, next);

      // Every string on the page changes and the whole layout mirrors, which is
      // abrupt at full speed. `flushSync` puts that re-render inside the
      // transition, so the browser has both states to cross-fade between.
      startViewTransition(() => {
        document.documentElement.lang = next;
        document.documentElement.dir = LOCALE_DIRECTION[next];
        flushSync(() => setLocale(next));
      });
    },
    [locale],
  );

  const value = useMemo(
    () => ({ ...getTranslator(locale), setLocale: changeLocale }),
    [locale, changeLocale],
  );

  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18n {
  return useContext(I18nContext);
}
