import type { z } from "zod";
import type { createOfficeRunInputSchema, officeAgentEventInputSchema, officeApprovalDecisionSchema, officeApprovalRequestSchema, officeArtifactReferenceSchema } from "@/zod/schemas/office";

export type CreateOfficeRunInput = z.infer<typeof createOfficeRunInputSchema>;
export type OfficeArtifactReference = z.infer<typeof officeArtifactReferenceSchema>;
export type OfficeApprovalRequest = z.infer<typeof officeApprovalRequestSchema>;
export type OfficeAgentEventInput = z.input<typeof officeAgentEventInputSchema>;
export type OfficeAgentEvent = z.output<typeof officeAgentEventInputSchema> & { id: string; occurredAt: string };
export type OfficeApprovalDecision = z.infer<typeof officeApprovalDecisionSchema>;

export type OfficeRunState = "empty" | "loading" | "working" | "WAITING_USER" | "WAITING_APPROVAL" | "success" | "error" | "cancelled";
export type OfficePhase = "entrada" | "trabalho" | "decisao" | "entrega";
export type OfficeApprovalState = "pending" | "approved" | "changes_requested" | "rejected" | "cancelled" | "expired";
export type OfficeEvent = Omit<OfficeAgentEvent, "type"> & { type: OfficeAgentEvent["type"] | "run.reset" };
export type OfficeApproval = OfficeApprovalRequest & { state: OfficeApprovalState; decision?: string; decidedAt?: string };

export type OfficeSnapshot = {
  runId: string;
  title: string;
  brief: string;
  leaderId: string;
  parameters: string;
  state: OfficeRunState;
  phase: OfficePhase;
  source: string;
  responsible: string;
  updatedAt: string;
  nextStep: string;
  notes: string;
  checkpoint: string | null;
  delivery: { label: string; status: "pending" | "ready" };
  approvals: OfficeApproval[];
  events: OfficeEvent[];
};

export type OfficeWorkspaceState = { activeRunId: string | null; runs: OfficeSnapshot[] };
export type OfficeAction =
  | { type: "START" }
  | { type: "REQUEST_USER" }
  | { type: "ANSWER_USER"; answer?: string }
  | { type: "REQUEST_APPROVAL" }
  | { type: "APPROVE"; approvalId?: string }
  | { type: "REJECT"; approvalId?: string; decision?: string }
  | { type: "COMPLETE" }
  | { type: "FAIL"; message?: string }
  | { type: "RETRY" }
  | { type: "CANCEL" }
  | { type: "CLEAR" };

export type OfficeLoadResult = { ok: true; state: OfficeWorkspaceState } | { ok: false; message: string; lastState?: OfficeWorkspaceState };
export interface OfficeRepository { load(workspaceId: string, userId: string): Promise<OfficeLoadResult>; save(workspaceId: string, userId: string, state: OfficeWorkspaceState): Promise<void>; }
export type OfficeEventSink = (event: OfficeAgentEvent) => Promise<void> | void;
export type OfficeEventToolResult = { ok: true; duplicate: boolean; event: OfficeAgentEvent };
export interface OfficeEventTool { report(input: unknown): Promise<OfficeEventToolResult>; }
