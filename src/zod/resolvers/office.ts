import { zodResolver } from "@hookform/resolvers/zod";
import { createOfficeRunInputSchema } from "@/zod/schemas/office";

export const createOfficeRunResolver = zodResolver(createOfficeRunInputSchema);
