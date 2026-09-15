import { officeAgentEventInputSchema } from "@/zod/schemas/office";
import type { OfficeAgentEvent, OfficeEventSink, OfficeEventTool } from "@/types/office";

type OfficeEventToolOptions = {
  sink: OfficeEventSink;
  now?: () => Date;
};

/**
 * Boundary used by agent runtimes. Persistence and real-time delivery belong
 * to the sink; the tool owns validation and local idempotency for retries.
 */
export function createOfficeEventTool({ sink, now = () => new Date() }: OfficeEventToolOptions): OfficeEventTool {
  const seen = new Map<string, OfficeAgentEvent>();

  return {
    async report(input) {
      const parsed = officeAgentEventInputSchema.parse(input);
      const key = parsed.idempotencyKey ?? parsed.id;
      if (key) {
        const previous = seen.get(key);
        if (previous) return { ok: true, duplicate: true, event: previous };
      }

      const event: OfficeAgentEvent = { ...parsed, id: parsed.id ?? crypto.randomUUID(), occurredAt: parsed.occurredAt ?? now().toISOString() };
      await sink(event);
      if (key) seen.set(key, event);
      return { ok: true, duplicate: false, event };
    },
  };
}
