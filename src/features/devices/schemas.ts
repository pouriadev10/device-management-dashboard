import { z } from "zod";

/**
 * The statuses a device can actually be in. Declared as a const tuple so it can
 * drive both the Zod schema and the UI (badges, filter options) from one place.
 */
export const DEVICE_STATUSES = ["Online", "Offline", "Warning"] as const;

export const deviceStatusSchema = z.enum(DEVICE_STATUSES);

/** A single octet: 0-255, written without leading zeros. */
const OCTET_PATTERN = /^(0|[1-9]\d{0,2})$/;

/**
 * Validates a dotted-quad IPv4 address.
 *
 * Deliberately stricter than the usual `\d+\.\d+\.\d+\.\d+` regex: octets are
 * range-checked and leading zeros are rejected, because `192.168.01.1` is
 * ambiguous (some resolvers read it as octal).
 */
export function isIpv4(value: string): boolean {
  const octets = value.split(".");
  if (octets.length !== 4) return false;
  return octets.every(
    (octet) => OCTET_PATTERN.test(octet) && Number(octet) <= 255,
  );
}

export const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  ip: z.string(),
  status: deviceStatusSchema,
  lastPing: z.string(),
});

/** Shape of the "add device" form. `id` and `lastPing` are assigned on create. */
export const newDeviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Device name is required")
    .max(64, "Device name must be 64 characters or fewer"),
  ip: z
    .string()
    .trim()
    .min(1, "IP address is required")
    .refine(isIpv4, "Enter a valid IPv4 address, e.g. 192.168.1.1"),
  status: deviceStatusSchema,
});
