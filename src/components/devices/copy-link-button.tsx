"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckIcon, LinkIcon } from "@/components/ui/icons";
import { useI18n } from "@/features/i18n/i18n-provider";

/**
 * Copies the current URL, filters included. The whole point of keeping filter
 * state in the URL is that a view can be handed to someone else, so the app
 * should make that obvious rather than leaving it to the address bar.
 */
export function CopyLinkButton() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copyCurrentUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked (insecure origin, denied permission).
      // The URL is still in the address bar, so this is not worth interrupting.
      setCopied(false);
    }
  }

  return (
    <Button
      variant="secondary"
      className="w-full sm:w-auto"
      onClick={() => void copyCurrentUrl()}
    >
      {copied ? <CheckIcon /> : <LinkIcon />}
      {copied ? t("filters.copyLink.done") : t("filters.copyLink")}
    </Button>
  );
}
