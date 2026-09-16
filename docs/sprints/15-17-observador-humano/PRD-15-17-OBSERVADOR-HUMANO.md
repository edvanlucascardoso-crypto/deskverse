# PRD — Observador humano

**Capability:** `human.observation`
**Tipo:** presença humana; não é `LeaderAgent`, `SpecialistAgent` ou `WorkerAgent`
**Bloqueia MVP/Gate A0:** não

## Resultado

Dar à pessoa autorizada uma visão compacta de runs, cards, notificações e checkpoints, permitindo reconhecer, aprovar, assumir, cancelar e escalar. Presença não consome LLM.

## Fluxo e tools

`activity.observe` → `notification.open` → `checkpoint.inspect` → `approval.decide` ou `takeover.start` → `action.audit` → `takeover.end`.

Takeover revoga ações protegidas e novos envios do agente, preserva motivo e mantém a conversa no escopo. A UI é drawer-first, responsiva, acessível por teclado e não cria uma visão Kanban do canvas.

## Open source recomendado

- [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-js) e suas [semantic conventions](https://opentelemetry.io/docs/concepts/semantic-conventions/): padronizar trace/metric/event de observação, sem substituir auditoria do Deskverse.
- [Langfuse](https://github.com/langfuse/langfuse): avaliação/observabilidade opcional em ambiente interno; enviar somente campos redigidos e verificar licença/retention antes de produção.

## Aceite específico

- A pessoa identifica o que aconteceu, o que está aguardando e qual ação é segura.
- Approval, takeover e cancelamento têm readback e auditoria.
- Perda de conexão não mostra ação como concluída.
