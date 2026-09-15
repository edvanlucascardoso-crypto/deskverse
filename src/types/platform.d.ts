import type { z } from "zod";
import type { platformEnvironmentSchema } from "@/zod/schemas/platform";

export type PlatformEnvironment = z.infer<typeof platformEnvironmentSchema>;
