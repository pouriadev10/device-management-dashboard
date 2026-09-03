import { cookies } from "next/headers";
import { cache } from "react";

import { parseTheme, THEME_COOKIE, type Theme } from "./theme";

/**
 * The stored theme, or `undefined` when nobody has chosen one — which is not the
 * same as "light". Leaving `data-theme` off the document in that case is what
 * lets the stylesheet fall through to `prefers-color-scheme`, so a reader whose
 * system is dark gets a dark page on their first visit without a script running
 * first.
 */
export const getStoredTheme = cache(async (): Promise<Theme | undefined> => {
  const store = await cookies();

  return parseTheme(store.get(THEME_COOKIE)?.value);
});
