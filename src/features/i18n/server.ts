import { cookies } from "next/headers";
import { cache } from "react";

import { LOCALE_COOKIE, parseLocale, type Locale } from "./locales";
import { getTranslator, type Translator } from "./translate";

/**
 * The language for this request. Reading the cookie makes the route dynamic,
 * which is the trade: a server-rendered dashboard cannot be cached across
 * readers and be in each reader's language at the same time, and the language
 * is the one worth having.
 *
 * `cache` collapses the repeated calls of a single render into one read.
 */
export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();

  return parseLocale(store.get(LOCALE_COOKIE)?.value);
});

/** Translator for a server render, for the strings that never reach the client. */
export async function getServerTranslator(): Promise<Translator> {
  return getTranslator(await getLocale());
}
