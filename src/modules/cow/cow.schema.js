import { z } from "zod";

export const createCowSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Code minimal 2 karakter")
    .max(20),

  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100),

  breed: z
    .string()
    .trim()
    .min(2, "Breed wajib diisi"),

  gender: z.enum(["male", "female"]),

  birthDate: z.string(),

  weight: z
    .number()
    .positive(),

  color: z
    .string()
    .trim()
    .optional()
    .default(""),

  photoUrl: z
    .string()
    .optional()
    .default(""),

  note: z
    .string()
    .optional()
    .default(""),

  status: z.enum([
    "healthy",
    "sick",
    "pregnant"
  ])
});

export const updateCowSchema = createCowSchema.partial();