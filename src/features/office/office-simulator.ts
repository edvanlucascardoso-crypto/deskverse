import type { OfficeAction } from "./office-domain";

export const officeScenarios = {
  happy: { label: "Fluxo feliz", description: "Inicia, registra aprovação e entrega", actions: [{ type: "START" }, { type: "REQUEST_APPROVAL" }, { type: "APPROVE" }, { type: "COMPLETE" }] as OfficeAction[] },
  waiting: { label: "Pedir resposta", description: "Pausa em WAITING_USER e retoma", actions: [{ type: "START" }, { type: "REQUEST_USER" }] as OfficeAction[] },
  approval: { label: "Aprovação humana", description: "Protege a entrega até aprovar", actions: [{ type: "START" }, { type: "REQUEST_APPROVAL" }] as OfficeAction[] },
  failure: { label: "Falha técnica", description: "Mostra erro e caminho de retry", actions: [{ type: "START" }, { type: "FAIL" }] as OfficeAction[] },
} as const;
