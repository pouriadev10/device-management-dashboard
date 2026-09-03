import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";

import { AppHeader } from "@/components/layout/app-header";
import { I18nProvider } from "@/features/i18n/i18n-provider";
import { LOCALE_DIRECTION } from "@/features/i18n/locales";
import { getLocale, getServerTranslator } from "@/features/i18n/server";
import { getStoredTheme } from "@/features/theme/server";
import { QueryProvider } from "@/lib/query-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Not preloaded: most visits never render a word of Persian, and the stylesheet
// only reaches for this face on an element that does.
const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator();

  return {
    title: { default: t("meta.title"), template: t("meta.titleTemplate") },
    description: t("meta.description"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Both preferences come from cookies, so the first byte of HTML is already in
  // the right language, direction and theme. Nothing flashes and corrects
  // itself, and there is no blocking script in the head to make that true.
  const [locale, theme] = await Promise.all([getLocale(), getStoredTheme()]);

  return (
    <html
      lang={locale}
      dir={LOCALE_DIRECTION[locale]}
      // Absent until someone chooses, which is what lets the stylesheet fall
      // through to `prefers-color-scheme`.
      data-theme={theme}
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased`}
      // The toggles write to these three attributes directly; React should not
      // read that as a mismatch to be corrected.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={locale}>
          <QueryProvider>
            <AppHeader />
            {children}
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
