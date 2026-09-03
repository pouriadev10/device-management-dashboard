import { z } from "zod";

import { defaultTranslator, type Translator } from "@/features/i18n/translate";

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
  /**
   * How long ago the device last answered, rather than a phrase like "2 mins
   * ago". A stored sentence is stored in one language; the number can be worded
   * in whichever language the page is being read in.
   */
  lastPingMinutesAgo: z.number().int().nonnegative(),
});

/**
 * Shape of the "add device" form. `id` and the ping age are assigned on create.
 *
 * Built around a translator because the messages are what the person filling the
 * form reads, and they should not be in English on a Persian page. The export
 * below binds the default one, so anything that only needs the shape — types,
 * tests, a server-side check — can go on importing a plain schema.
 */
export function createNewDeviceSchema({ t }: Pick<Translator, "t">) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t("form.validation.name.required"))
      .max(64, t("form.validation.name.max")),
    ip: z
      .string()
      .trim()
      .min(1, t("form.validation.ip.required"))
      .refine(isIpv4, t("form.validation.ip.invalid")),
    status: deviceStatusSchema,
  });
}

export const newDeviceSchema = createNewDeviceSchema(defaultTranslator);
