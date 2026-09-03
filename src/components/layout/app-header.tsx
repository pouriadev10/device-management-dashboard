"use client";

import { SignalIcon } from "@/components/ui/icons";
import { useI18n } from "@/features/i18n/i18n-provider";

import { LocaleToggle } from "./locale-toggle";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  const { t } = useI18n();

  return (
    <header className="bg-surface/85 sticky top-0 z-10 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <span
          aria-hidden
          className="bg-primary text-primary-foreground rounded-control grid size-9 place-items-center"
        >
          <SignalIcon className="size-4.5" />
        </span>

        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">
            {t("app.name")}
          </p>
          <p className="text-muted text-xs">{t("app.tagline")}</p>
        </div>

        <div className="ms-auto flex items-center gap-1">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
