"use client";

import { useEffect, useRef } from "react";

import { SearchIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  STATUS_FILTERS,
  type DeviceFilters,
  type StatusFilter,
} from "@/features/devices/filter-params";
import { useI18n } from "@/features/i18n/i18n-provider";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/lib/cn";

import { CopyLinkButton } from "./copy-link-button";

const SEARCH_DEBOUNCE_MS = 300;

type DeviceFilterBarProps = {
  filters: DeviceFilters;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: StatusFilter) => void;
};

export function DeviceFilterBar({
  filters,
  onSearchChange,
  onStatusChange,
}: DeviceFilterBarProps) {
  const { t } = useI18n();

  // The field is uncontrolled so typing stays instant while the URL catches up
  // on its own schedule.
  const inputRef = useRef<HTMLInputElement>(null);
  const publishedSearch = useRef(filters.search);

  const publishSearch = useDebouncedCallback((search: string) => {
    publishedSearch.current = search;
    onSearchChange(search);
  }, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    // Anything we published ourselves is already in the field.
    if (filters.search === publishedSearch.current) return;

    // The URL moved on its own — a shared link, the back button, or the filters
    // being cleared. Adopt it, and drop the keystroke still waiting to be
    // published, which is now stale and would undo the change.
    publishSearch.cancel();
    publishedSearch.current = filters.search;

    const input = inputRef.current;
    if (input) input.value = filters.search;
  }, [filters.search, publishSearch]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <label htmlFor="device-search" className="sr-only">
          {t("filters.search.label")}
        </label>
        <SearchIcon className="text-muted pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          id="device-search"
          ref={inputRef}
          type="search"
          defaultValue={filters.search}
          onChange={(event) => publishSearch(event.target.value)}
          placeholder={t("filters.search.placeholder")}
          className="ps-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <fieldset className="min-w-0">
          <legend className="sr-only">{t("filters.status.legend")}</legend>
          {/* Radios rather than buttons: one choice out of four, which is what a
              radio group is, and arrow keys move between them for free. */}
          <div className="bg-surface-muted rounded-control flex gap-1 border p-1">
            {STATUS_FILTERS.map((status) => {
              const isActive = filters.status === status;

              return (
                <label
                  key={status}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md px-3 py-1.5 text-center text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-out sm:flex-none",
                    "focus-within:ring-ring focus-within:ring-2",
                    isActive
                      ? "bg-surface text-foreground shadow-panel"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={isActive}
                    onChange={() => onStatusChange(status)}
                    className="sr-only"
                  />
                  {t(`status.${status}`)}
                </label>
              );
            })}
          </div>
        </fieldset>

        <CopyLinkButton />
      </div>
    </div>
  );
}
