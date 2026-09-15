import type { OfficeAction } from "@/types/office";

export const officeScenarios = {
  happy: { label: "Caminho completo", description: "Passa pela aprovação e registra a entrega", actions: [{ type: "START" }, { type: "REQUEST_APPROVAL" }, { type: "APPROVE" }, { type: "COMPLETE" }] as OfficeAction[] },
  waiting: { label: "Pedir uma informação", description: "Pausa para você responder e continua", actions: [{ type: "START" }, { type: "REQUEST_USER" }] as OfficeAction[] },
  approval: { label: "Pedir aprovação", description: "Para antes da sua aprovação", actions: [{ type: "START" }, { type: "REQUEST_APPROVAL" }] as OfficeAction[] },
  failure: { label: "Simular um erro", description: "Mostra como continuar depois de um erro", actions: [{ type: "START" }, { type: "FAIL" }] as OfficeAction[] },
} as const;
