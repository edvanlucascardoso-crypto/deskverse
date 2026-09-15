import { zodResolver } from "@hookform/resolvers/zod";
import { authFormSchema } from "@/zod/schemas/auth";

export const authFormResolver = zodResolver(authFormSchema);
