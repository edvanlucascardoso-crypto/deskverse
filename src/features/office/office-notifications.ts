import type { Activity, AgentActivity } from "@/components/canvas/agent-data";
import type { OfficeEvent, OfficeSnapshot } from "@/types/office";

const notificationTone: Record<OfficeEvent["type"], string> = {
  "run.started": "#46d3c2",
  "run.waiting_user": "#f4c64e",
  "run.waiting_approval": "#f4c64e",
  "run.resumed": "#46d3c2",
  "run.completed": "#5bcfbe",
  "run.failed": "#ef6b73",
  "run.cancelled": "#ef6b73",
  "run.reset": "#a7acb5",
  "approval.requested": "#f4c64e",
  "approval.decided": "#46d3c2",
  "step.started": "#46d3c2",
  "step.completed": "#5bcfbe",
  "delegation.requested": "#46d3c2",
};

const canvasActivity: Record<OfficeEvent["type"], AgentActivity> = {
  "run.started": "working",
  "run.waiting_user": "waiting",
  "run.waiting_approval": "waiting",
  "run.resumed": "working",
  "run.completed": "completed",
  "run.failed": "error",
  "run.cancelled": "error",
  "run.reset": "idle",
  "approval.requested": "waiting",
  "approval.decided": "working",
  "step.started": "working",
  "step.completed": "working",
  "delegation.requested": "communicating",
};

export function officeEventToActivity(event: OfficeEvent, run: OfficeSnapshot): Activity {
  return {
    id: `office-${event.id}`,
    text: event.message,
    time: "agora",
    tone: notificationTone[event.type],
    origin: event.source,
    impact: event.impact,
    agentId: run.leaderId || "social",
    relatedLabel: run.title,
    officeRunId: run.runId,
    officeApprovalId: event.approvalId,
    officeConversationId: event.conversationId,
    officeArtifactId: event.artifact?.id,
  };
}

export function officeEventToCanvasActivity(event: OfficeEvent) {
  return canvasActivity[event.type];
}
