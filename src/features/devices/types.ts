import type { z } from "zod";

import type {
  deviceSchema,
  deviceStatusSchema,
  newDeviceSchema,
} from "./schemas";

/**
 * Types are inferred from the Zod schemas rather than declared alongside them,
 * so validation and typing can never drift apart.
 */
export type DeviceStatus = z.infer<typeof deviceStatusSchema>;
export type Device = z.infer<typeof deviceSchema>;
export type NewDeviceInput = z.infer<typeof newDeviceSchema>;
