import { z } from "zod";

/**
 * Server-side validation for POST /api/contact (design D2).
 * All fields are trimmed; the email is lowercased and must be well-formed.
 * Error messages are Spanish and user-facing.
 */
export const contactSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio." })
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre no puede superar los 100 caracteres."),
  email: z
    .string({ error: "El correo es obligatorio." })
    .trim()
    .toLowerCase()
    .max(254, "El correo no puede superar los 254 caracteres.")
    .pipe(z.email("El correo no es válido.")),
  message: z
    .string({ error: "El mensaje es obligatorio." })
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres.")
    .max(4000, "El mensaje no puede superar los 4000 caracteres."),
});

export type ContactInput = z.infer<typeof contactSchema>;
