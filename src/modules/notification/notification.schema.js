import { z } from "zod";

export const sendWhatsAppSchema = z.object({
  phone: z.string().min(5, "Nomor telepon wajib diisi"),
  message: z.string().min(1, "Pesan wajib diisi"),
  template: z.string().optional(),
});

export const sendTestWhatsAppSchema = z.object({
  phone: z.string().min(5, "Nomor telepon wajib diisi"),
  message: z.string().min(1, "Pesan wajib diisi"),
});

export default sendWhatsAppSchema;
