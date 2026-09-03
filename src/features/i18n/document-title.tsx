"use client";

import { useEffect } from "react";

import { useI18n } from "./i18n-provider";
import type { MessageKey } from "./messages";

/**
 * Keeps the tab title in the language on screen.
 *
 * `generateMetadata` runs on the server, so the title it produces is fixed to
 * the language of the request that fetched the page — and the language can
 * change after that without another request. This re-derives it, using the same
 * template the metadata does. Nothing has to be undone later: the cookie is
 * already written, so the next server render arrives at the same title on its
 * own.
 */
export function DocumentTitle({ titleKey }: { titleKey: MessageKey }) {
  const { t } = useI18n();

  useEffect(() => {
    document.title = t("meta.titleTemplate").replace("%s", t(titleKey));
  }, [t, titleKey]);

  return null;
}
