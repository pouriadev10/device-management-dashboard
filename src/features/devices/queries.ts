"use client";

import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createDevice, deleteDevice, fetchDevices } from "./api";
import type { Device } from "./types";

/**
 * Query keys live next to the options that use them so every call site shares
 * one identity — mutations update the cache without guessing at the key shape.
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

export function useAddDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDevice,
    onSuccess: (device) => {
      // Writing the result straight into the cache shows the new device at once.
      // Invalidating instead would send the list back through its 700ms load and
      // flash the skeleton over data we already have.
      queryClient.setQueryData(deviceKeys.all, (current: Device[] = []) => [
        device,
        ...current,
      ]);
    },
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: (_result, id) => {
      queryClient.setQueryData(deviceKeys.all, (current: Device[] = []) =>
        current.filter((device) => device.id !== id),
      );
    },
  });
}
