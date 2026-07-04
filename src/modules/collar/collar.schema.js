import { z } from "zod";

export const createCollarSchema = z.object({
  serialNumber: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .transform((v) => v.toUpperCase()),

  deviceName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  hardwareVersion: z
    .string()
    .trim()
    .min(1),

  firmwareVersion: z
    .string()
    .trim()
    .min(1),

  macAddress: z
    .string()
    .trim()
    .min(1),

  simNumber: z
    .string()
    .trim()
    .optional()
    .default("")
});

export const updateCollarSchema =
  createCollarSchema.partial();