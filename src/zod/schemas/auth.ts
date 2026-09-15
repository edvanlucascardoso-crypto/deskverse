import { z } from "zod";

export const authFormSchema = z.object({
  name: z.string().trim().max(80, "Use no máximo 80 caracteres.").optional(),
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(8, "Use pelo menos 8 caracteres.").max(128, "Use no máximo 128 caracteres."),
});
