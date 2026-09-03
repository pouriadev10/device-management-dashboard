"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { useI18n } from "@/features/i18n/i18n-provider";
import { toggleTheme } from "@/features/theme/toggle-theme";

/**
 * Both states are drawn and CSS chooses between them, which is what lets this
 * button be correct on the very first paint: the theme may be coming from the
 * operating system, and that is not something the server can know or a React
 * render can guess without correcting itself a moment later.
 *
 * The button's own rectangle is where the wipe collapses to, so the change
 * appears to be pulled into the thing that was pressed.
 */
export function ThemeToggle() {
  const { t } = useI18n();
  const button = useRef<HTMLButtonElement>(null);

  return (
    <Button
      ref={button}
      variant="ghost"
      size="icon"
      // Measured off the ref, not `event.currentTarget`: the wipe collapses to
      // this exact rectangle, and it has to be the button every time — the
      // first press included.
      onClick={() => {
        const origin = button.current?.getBoundingClientRect();
        if (origin) toggleTheme(origin);
      }}
    >
      <MoonIcon className="theme-light-only size-4.5" />
      <SunIcon className="theme-dark-only size-4.5" />
      <span className="theme-light-only sr-only">{t("theme.toDark")}</span>
      <span className="theme-dark-only sr-only">{t("theme.toLight")}</span>
    </Button>
  );
}
