# Requisitos de integração — SPRINT-15-11

- Conectar somente APIs documentadas de OpenProject/Plane, se houver instalação autorizada.
- Deskverse continua fonte de verdade de projetos, tarefas, dependências, approvals e auditoria.
- Toda mutação exige estado anterior/novo, origem, actor, `baseVersion`, idempotência e notificação.
- A tela de projetos permanece read-only para a pessoa usuária.
- Cobrir conflito, dependência circular, responsável ausente, prazo impossível e rollback lógico.
