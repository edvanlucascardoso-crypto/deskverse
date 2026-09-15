import type { z } from "zod";
import type { authFormSchema } from "@/zod/schemas/auth";

export type AuthForm = z.infer<typeof authFormSchema>;
