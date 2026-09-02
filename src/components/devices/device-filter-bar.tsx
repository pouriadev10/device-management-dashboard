"use client";

import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import {
  STATUS_FILTERS,
  type DeviceFilters,
  type StatusFilter,
} from "@/features/devices/filter-params";
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
          Search devices by name or IP address
        </label>
        <SearchIcon />
        <Input
          id="device-search"
          ref={inputRef}
          type="search"
          defaultValue={filters.search}
          onChange={(event) => publishSearch(event.target.value)}
          placeholder="Search by name or IP"
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <fieldset className="min-w-0">
          <legend className="sr-only">Filter by status</legend>
          <div className="bg-surface-muted flex gap-1 rounded-xl border p-1">
            {STATUS_FILTERS.map((status) => {
              const isActive = filters.status === status;

              return (
                <label
                  key={status}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-center text-sm font-medium whitespace-nowrap transition-colors sm:flex-none",
                    "focus-within:ring-ring focus-within:ring-2",
                    isActive
                      ? "bg-surface text-foreground shadow-sm"
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
                  {status}
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

function SearchIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
    >
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13 13 4 4" strokeLinecap="round" />
    </svg>
  );
}
