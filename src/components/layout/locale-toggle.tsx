"use client";

import { Button } from "@/components/ui/button";
import { LanguageIcon } from "@/components/ui/icons";
import { useI18n } from "@/features/i18n/i18n-provider";
import { LOCALE_LABELS, type Locale } from "@/features/i18n/locales";

/**
 * With two languages a switch is clearer than a menu: the button shows the one
 * you are not reading, named in itself, since "Persian" is no help to someone
 * who cannot read the English it is written in.
 *
 * The visible name is part of the accessible name rather than being replaced by
 * an `aria-label`, so saying what is written on the button is enough to press it.
 */
export function LocaleToggle() {
  const { locale, t, setLocale } = useI18n();
  const next: Locale = locale === "fa" ? "en" : "fa";

  return (
    <Button
      variant="ghost"
      size="sm"
      // Names the action while still containing the word written on the button,
      // which is what someone driving this by voice will say.
      aria-label={`${t("locale.switchTo")} ${LOCALE_LABELS[next]}`}
      onClick={() => setLocale(next)}
    >
      <LanguageIcon />
      <span lang={next}>{LOCALE_LABELS[next]}</span>
    </Button>
  );
}
