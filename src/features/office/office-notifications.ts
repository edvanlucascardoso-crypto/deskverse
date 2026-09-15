import type { Activity, AgentActivity } from "@/components/canvas/agent-data";
import type { OfficeEvent, OfficeSnapshot } from "./office-domain";

const notificationTone: Record<OfficeEvent["type"], string> = {
  "run.started": "#46d3c2",
  "run.waiting_user": "#f4c64e",
  "run.waiting_approval": "#f4c64e",
  "run.resumed": "#46d3c2",
  "run.completed": "#5bcfbe",
  "run.failed": "#ef6b73",
  "run.reset": "#a7acb5",
};

const canvasActivity: Record<OfficeEvent["type"], AgentActivity> = {
  "run.started": "working",
  "run.waiting_user": "waiting",
  "run.waiting_approval": "waiting",
  "run.resumed": "working",
  "run.completed": "completed",
  "run.failed": "error",
  "run.reset": "idle",
};

export function officeEventToActivity(event: OfficeEvent, run: OfficeSnapshot): Activity {
  return {
    id: `office-${event.id}`,
    text: event.message,
    time: "agora",
    tone: notificationTone[event.type],
    origin: event.source,
    impact: event.impact,
    agentId: "social",
    relatedLabel: run.title,
    officeRunId: run.runId,
  };
}

export function officeEventToCanvasActivity(event: OfficeEvent) {
  return canvasActivity[event.type];
}
