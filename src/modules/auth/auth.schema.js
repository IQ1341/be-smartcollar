import { z } from "zod";

export const syncUserSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(10),
  address: z.string().min(3),
  photoUrl: z.string().optional().default(""),
});