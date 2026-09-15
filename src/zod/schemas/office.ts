import { z } from "zod";

export const createOfficeRunInputSchema = z.object({
  title: z.string().trim().min(3, "Dê um nome com pelo menos 3 caracteres.").max(80, "Use no máximo 80 caracteres."),
  objective: z.string().trim().min(10, "Explique o que precisa ser feito.").max(500, "Use no máximo 500 caracteres."),
  delivery: z.string().trim().min(3, "Descreva como o trabalho será considerado pronto.").max(120, "Use no máximo 120 caracteres."),
  notes: z.string().trim().max(1000, "Use no máximo 1.000 caracteres.").optional(),
});

export const officeArtifactReferenceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  version: z.string().min(1),
  type: z.string().min(1).optional(),
});

export const officeApprovalRequestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  reason: z.string().min(1),
  requestedBy: z.string().min(1),
  required: z.boolean().default(true),
  order: z.number().int().nonnegative().default(0),
  conversationId: z.string().min(1).optional(),
  artifacts: z.array(officeArtifactReferenceSchema).default([]),
});

export const officeAgentEventTypeSchema = z.enum([
  "run.started",
  "run.resumed",
  "run.waiting_user",
  "run.waiting_approval",
  "run.completed",
  "run.failed",
  "run.cancelled",
  "approval.requested",
  "approval.decided",
  "step.started",
  "step.completed",
  "delegation.requested",
]);

export const officeAgentEventInputSchema = z.object({
  id: z.string().min(1).optional(),
  runId: z.string().min(1),
  type: officeAgentEventTypeSchema,
  source: z.string().min(1),
  responsible: z.string().min(1),
  message: z.string().min(1),
  impact: z.string().min(1),
  nextStep: z.string().min(1),
  checkpoint: z.string().min(1).nullable().optional(),
  approvalId: z.string().min(1).optional(),
  approval: officeApprovalRequestSchema.optional(),
  conversationId: z.string().min(1).optional(),
  artifact: officeArtifactReferenceSchema.optional(),
  idempotencyKey: z.string().min(1).optional(),
  occurredAt: z.string().datetime().optional(),
}).superRefine((event, context) => {
  if ((event.type === "approval.requested" || event.type === "run.waiting_approval") && (!event.approval || !event.approvalId || event.approval.id !== event.approvalId)) {
    context.addIssue({ code: "custom", path: ["approval"], message: "Uma aprovação detalhada deve acompanhar este evento." });
  }
  if (event.type === "approval.decided" && !event.approvalId) {
    context.addIssue({ code: "custom", path: ["approvalId"], message: "A decisão precisa identificar a aprovação." });
  }
});

export const officeApprovalDecisionSchema = z.object({
  runId: z.string().min(1),
  approvalId: z.string().min(1),
  decision: z.enum(["approved", "changes_requested", "rejected"]),
  note: z.string().trim().max(1000, "Use no máximo 1.000 caracteres.").optional(),
  idempotencyKey: z.string().min(1),
  decidedAt: z.string().datetime().optional(),
});
