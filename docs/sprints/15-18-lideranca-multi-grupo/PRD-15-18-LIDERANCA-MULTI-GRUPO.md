# PRD — Liderança multi-grupo e workforce compartilhada

**Capability:** `leadership.multi_group`
**Tipo:** `LeaderAgent` persistente + `SpecialistAgent`s compartilhados + workers efêmeros
**Bloqueia MVP/Gate A0:** não

## Resultado

Coordenar departamentos/grupos no mesmo workspace, preservando uma única identidade lógica por especialista, políticas, filas e isolamento. O canvas continua uma grade espacial de tiles, não um grafo de hierarquia ou Kanban.

## Fluxo e tools

`group.inspect` → `objective.route` → `specialist.select` → `delegation.create` → `handoff.sequence` → `status.aggregate` → `leader.escalate`.

Delegação é por capability, não por worker fixo. Comunicação mediada pelo líder tem uma conversa ativa por fluxo, checkpoint e cancelamento em cascata. Sem líder disponível, o sistema entra em `WAITING_USER`/escalation, sem escolher outro por heurística invisível.

## Open source recomendado

- [LangGraph](https://github.com/langchain-ai/langgraph), MIT: referência opcional para state graph, durable execution e human-in-the-loop em um adapter de orquestração.
- O runtime produtivo continua sendo `AgentRuntime`/Eve; LangGraph não pode criar memória paralela, política própria ou identidade duplicada.

## Aceite específico

- Um especialista atende grupos diferentes sem cruzar contexto ou permissão.
- Fila, budget, senioridade e capability são auditáveis por run.
- Reflow, foco, seleção e comunicação permanecem acessíveis e contínuos no canvas.
