# PRD — Agente de gestão de projetos

**Capability:** `project.management`
**Tipo:** `SpecialistAgent` Gestor de Projetos/Gerente
**Bloqueia MVP/Gate A0:** não

## Resultado

Consultar e alterar objetivos, planos, tarefas, dependências, responsáveis, prazos, saúde e histórico somente pelas tools autorizadas. A tela dedicada do usuário continua somente leitura.

## Fluxo e tools

`project.inspect` → `dependency.analyze` → `plan.propose` → `approval_or_policy_check` → `plan.apply` → `notification.emit` → `project.health.update`.

Cada mutação exige origem, estado anterior, novo estado, motivo, actor, `baseVersion`/idempotência e próximo passo. Conflito reabre inspeção; não há last-write-wins. O agente pode pedir informação curta ao usuário quando o brief for ambíguo.

## Open source recomendado

- [OpenProject API/MCP](https://www.openproject.org/docs/api/): referência para work packages, dependências, revisões e autodiscovery. Começar pela API v3; MCP de escrita externo só após avaliar edição/licença da instalação.
- [Plane REST API](https://developers.plane.so/api-reference/introduction): alternativa para intake, ciclos, docs e webhooks; usar como connector, não como segunda fonte de verdade.

## Aceite específico

- Usuário não ganha controles de criação/edição/exclusão na tela de projetos.
- Dependências impossíveis geram `WAITING_USER` ou escalonamento.
- Notificação atualiza card, estado e histórico somente depois do commit confirmado.
