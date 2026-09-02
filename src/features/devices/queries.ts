"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchDevices } from "./api";

/**
 * Query keys live next to the options that use them so every call site shares
 * one identity — mutations can invalidate without guessing at the key shape.
 */
export const deviceKeys = {
  all: ["devices"] as const,
};

export const deviceListOptions = queryOptions({
  queryKey: deviceKeys.all,
  queryFn: fetchDevices,
});

export function useDevices() {
  return useQuery(deviceListOptions);
}
