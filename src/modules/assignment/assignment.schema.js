import { z } from "zod";

export const attachSchema = z.object({

  cowId: z
    .string()
    .trim()
    .min(1),

  collarId: z
    .string()
    .trim()
    .min(1)

});

export const detachSchema = z.object({

  cowId: z
    .string()
    .trim()
    .min(1)

});